import Order from '@/backend/models/Order';
import dbConnect from '@/lib/db';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function getCartItems(line_items) {
  return new Promise((resolve, reject) => {
    let cartItems = [];

    line_items?.data?.forEach(async (item) => {
      console.log(item, 'item');
      const product = await stripe.products.retrieve(item.price.product);
      const productId = product.metadata.productId;

      cartItems.push({
        product: productId,
        name: product.name,
        price: item.price.unit_amount_decimal / 100,
        quantity: item.quantity,
        image: product.images[0],
      });

      if (cartItems.length === line_items?.data.length) {
        resolve(cartItems);
      }
    });
  });
}

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

    if (event.type === 'checkout.session.completed') {
      // get all the details from stripe checkout to create new order
      const session = event.data.object;
      let line_items;

      console.log(
        'session.metadata.layaway === true',
        session.metadata.layaway === true
      );

      if (session.metadata.layaway === true) {
        line_items = await stripe.invoiceItems.list({
          invoice: session.metadata.invoice,
        });
        console.log(line_items, 'line_items');
      } else {
        line_items = await stripe.checkout.sessions.listLineItems(
          event.data.object.id
        );
      }

      const orderItems = await getCartItems(line_items);
      const ship_cost = session.shipping_cost.amount_total / 100;
      const date = Date.now();
      const userId = session.client_reference_id;
      const amountPaid = session.amount_total / 100;

      const paymentInfo = {
        id: session.payment_intent,
        status: session.payment_status,
        amountPaid,
        taxPaid: session.total_details.amount_tax / 100,
      };
      let orderData;

      if (session.metadata.layaway === true) {
        orderData = {
          user: userId,
          ship_cost,
          createdAt: date,
          shippingInfo: JSON.parse(session.metadata.shippingInfo),
          paymentInfo,
          orderItems,
          orderStatus: 'Apartado',
          layaway: true,
        };
      } else {
        orderData = {
          user: userId,
          ship_cost,
          createdAt: date,
          shippingInfo: JSON.parse(session.metadata.shippingInfo),
          paymentInfo,
          orderItems,
          layaway: false,
        };
      }

      console.log(orderData, 'orderData');

      const order = await Order.create(orderData);
      return NextResponse.json(
        {
          success: true,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al crear Pedido',
      },
      { status: 500 }
    );
  }
}
