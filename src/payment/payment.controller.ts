import { Controller, Post, Body, Get, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async create(@Body() body: any) {
    return this.paymentService.createOrder(body);
  }

  @Get()
  async findAll() {
    console.log('Getting all orders...');
    const orders = await this.paymentService.getAllOrders();
    console.log(`Found ${orders.length} orders:`, orders);
    return orders;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Order ID is required');
    }

    // Validate that id is a valid number
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      throw new BadRequestException('Order ID must be a valid number');
    }

    console.log(`Looking for order with ID: ${orderId}`);
    
    try {
      const order = await this.paymentService.getOrderById(orderId);
      console.log(`Found order:`, order);
      
      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }
      
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch order');
    }
  }
}
