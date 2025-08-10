import { Controller, Post, Body, Req, Res, Headers, Get, Param } from '@nestjs/common';
import { PaymentService } from '../payment/payment.service';
import { StripeService } from './stripe.service';
import { Request, Response } from 'express';
import { RawBodyRequest } from '@nestjs/common';
import Stripe from 'stripe';
import { OrderStatus } from '@prisma/client';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly stripeService: StripeService
  ) {}

  @Post('create-payment-intent')
  async createPayment(@Body() body: any) {
    const { userId, bookId, amount, currency } = body;

    // Create order in database
    const order = await this.paymentService.createOrder({ userId, bookId, amount, currency });

    // Create Stripe payment intent
    const paymentIntent = await this.stripeService.createPaymentIntent(
      amount,
      currency,
      {
        orderId: order.id.toString(),
        userId: userId.toString(),
        bookId: bookId.toString(),
      }
    );

    // Update order with payment intent ID
    await this.paymentService.updateOrderWithPaymentIntent(order.id, paymentIntent.id);

    return {
      orderId: order.id,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  @Post('webhook')
  async handleWebhook(@Req() req: RawBodyRequest<Request>, @Res() res: Response, @Headers('stripe-signature') sig: string) {
    let event: Stripe.Event;

    try {
      event = this.stripeService.constructWebhookEvent(req.body, sig);
    } catch (err) {
      console.log('Webhook signature verification failed, trying mock webhook...');
      // For testing purposes, try to handle as mock webhook
      try {
        event = req.body as Stripe.Event;
        if (!event.type || !event.data) {
          return res.status(400).send(`Webhook Error: Invalid event format`);
        }
      } catch (mockErr) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = parseInt(paymentIntent.metadata.orderId);
        
        await this.paymentService.updateOrderStatus(orderId, OrderStatus.PAID);
        console.log(`Order ${orderId} marked as PAID`);
        break;

      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        const failedOrderId = parseInt(failedPaymentIntent.metadata.orderId);
        
        await this.paymentService.updateOrderStatus(failedOrderId, OrderStatus.FAILED);
        console.log(`Order ${failedOrderId} marked as FAILED`);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true, eventType: event.type });
  }

  @Get('payment-status/:paymentIntentId')
  async getPaymentStatus(@Param('paymentIntentId') paymentIntentId: string) {
    const paymentIntent = await this.stripeService.retrievePaymentIntent(paymentIntentId);
    return {
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
    };
  }

  @Post('test-webhook')
  async testWebhook(@Body() body: any) {
    const { orderId, eventType = 'payment_intent.succeeded' } = body;
    
    try {
      if (eventType === 'payment_intent.succeeded') {
        await this.paymentService.updateOrderStatus(orderId, OrderStatus.PAID);
        console.log(`Test: Order ${orderId} marked as PAID`);
      } else if (eventType === 'payment_intent.payment_failed') {
        await this.paymentService.updateOrderStatus(orderId, OrderStatus.FAILED);
        console.log(`Test: Order ${orderId} marked as FAILED`);
      }
      
      return { 
        success: true, 
        message: `Order ${orderId} status updated to ${eventType}`,
        eventType 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
}
