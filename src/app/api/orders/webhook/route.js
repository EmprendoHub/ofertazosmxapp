import Order from '@/backend/models/Order';
import dbConnect from '@/lib/db';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req, res) {
  try {
    await dbConnect();

    // Access the value of stripe-signature from the headers
    const signature = await req.headers.get('stripe-signature');
    const rawBody = await req.text();
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    const session = event.data.object;

    console.log('session', session, 'session');

    // credit card checkout
    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      // get all the details from stripe checkout to create new order

      const currentOrder = await Order.findOne({
        _id: session?.metadata?.order,
      });

      console.log('currentOrder', currentOrder);
      let newPaymentAmount;
      if (session.payment_status === 'unpaid') {
        newPaymentAmount = 0;
      } else {
        newPaymentAmount = session.amount_total / 100;
      }

      let payAmount = currentOrder.paymentInfo.amountPaid + newPaymentAmount;
      // Use reduce to sum up the 'total' field
      const totalOrderAmount = currentOrder.orderItems.reduce(
        (acc, orderItem) => acc + orderItem.quantity * orderItem.price,
        0
      );

      if (payAmount >= totalOrderAmount) {
        currentOrder.orderStatus = 'Procesando';
        currentOrder.paymentInfo.status = 'Paid';
      }

      if (payAmount < totalOrderAmount) {
        currentOrder.orderStatus = 'Apartado';
      }

      currentOrder.paymentInfo.amountPaid = payAmount;

      await currentOrder.save();
    }
    return NextResponse.json(
      {
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al crear Pedido',
      },
      { status: 500 }
    );
  }
}
