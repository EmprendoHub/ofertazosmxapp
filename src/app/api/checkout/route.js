import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import Order from '@/backend/models/Order';

export const POST = async (request) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const reqBody = await request.json();
    const { items, email, user, shipping } = await reqBody;
    const line_items = await items.map((item) => {
      return {
        price_data: {
          currency: 'mxn',
          unit_amount: item.price * 100,
          product_data: {
            name: item.title,
            description: item.description,
            images: [item.images[0].url],
            metadata: { productId: item._id },
          },
        },
        tax_rates: ['txr_1ORJnfF1B19DqtcQKzzP0bOh'],
        quantity: item.quantity,
      };
    });
    const shippingInfo = JSON.stringify(shipping);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/exito`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cancelado`,
      customer_email: email,
      client_reference_id: user?._id,
      metadata: { shippingInfo },
      shipping_options: [
        {
          shipping_rate: 'shr_1ORJl8F1B19DqtcQstdQKHdR',
        },
      ],
      line_items,
    });

    return NextResponse.json({
      message: 'Connection is active',
      success: true,
      id: session.id,
      url: session.url,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
