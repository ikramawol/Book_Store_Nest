import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { OrderStatus } from "@prisma/client";

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createOrder(data: { 
    userId: number; bookId: number; amount: number; currency: string }) {
    return this.prisma.order.create({
      data: {
        ...data,
        status: OrderStatus.PENDING,
      },
    });
  }

  async updateOrderStatus(id: number, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async getOrderById(id: number) {
    // console.log(`PaymentService: Looking for order with ID: ${id}`);
    try {
      const order = await this.prisma.order.findUnique({ where: { id } });
      // console.log(`PaymentService: Found order:`, order);
      return order;
    } catch (error) {
      // console.error('PaymentService: Database error:', error);
      throw error;
    }
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateOrderWithPaymentIntent(orderId: number, paymentIntentId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { paymentIntentId },
    });
  }
}
