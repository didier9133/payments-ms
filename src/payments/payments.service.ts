import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { envs } from '../configs/envs';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.STRIPE_SECRET_KEY, {});

  async createSessionPayment({ body }: { body: PaymentSessionDto }) {
    const { currency, items, orderId } = body;
    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          orderId,
        },
      },
      line_items,
      mode: 'payment',
      success_url: envs.STRIPE_SUCCESS_URL,
      cancel_url: envs.STRIPE_CANCEL_URL,
    });

    return session;
  }

  async stripeWebhook(res: Response, req: Request) {
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        envs.STRPE_WEBHOOK_SECRET,
      );

      switch (event.type) {
        case 'charge.succeeded':
          const metadata = event.data.object.metadata;
          const orderId = metadata.orderId;
          console.log('orderId', orderId);
          break;

        default:
          console.log(`Event type ${event.type} not handled`);
      }

      return res.status(200).json({ sig });
    } catch (err) {
      console.log('err', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}
