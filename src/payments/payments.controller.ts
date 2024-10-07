import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post('create-session-payment')
  createSessionPayment(@Body() body: PaymentSessionDto) {
    return this.paymentsService.createSessionPayment({ body });
  }

  @Get('success-payment')
  getPayments() {
    return {
      ok: true,
      message: 'Payment success',
    };
  }

  @Get('cancel-payment')
  cancelPayment() {
    return {
      ok: false,
      message: 'Payment cancel',
    };
  }

  @Post('webhook-payment')
  webhookPayment(@Req() req: Request, @Res() res: Response) {
    return this.paymentsService.stripeWebhook(res, req);
  }
}
