import Order from '@/backend/models/Order';
import dbConnect from '@/lib/db';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function getCartItems(line_items) {
  return new Promise((resolve, reject) => {
    let cartItems = [];

    line_items?.data?.forEach(async (item) => {
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
    const session = event.data.object;

    if (
      event.type === 'checkout.session.completed' &&
      session.payment_status === 'paid'
    ) {
      // get all the details from stripe checkout to create new order

      let line_items;

      if (
        // Layaway
        session?.metadata?.layaway &&
        session?.metadata?.layaway === 'true' &&
        !session?.metadata?.order
      ) {
        line_items = await stripe.invoiceItems.list({
          invoice: session.metadata.invoice,
        });
      } else if (
        session?.metadata?.layaway &&
        session?.metadata?.layaway === 'true' &&
        session?.metadata?.order
      ) {
        const currentOrder = await Order.findOne({
          _id: session?.metadata?.order,
        });
        currentOrder.paymentInfo.amountPaid =
          currentOrder.paymentInfo.amountPaid + session.amount_total / 100;
        currentOrder.orderStatus = 'Procesando';
        const savedOrder = await currentOrder.save();
        return NextResponse.json(
          {
            success: true,
          },
          { status: 201 }
        );
      } else {
        line_items = await stripe.checkout.sessions.listLineItems(
          event.data.object.id
        );
      }

      const orderItems = await getCartItems(line_items);
      const ship_cost = session.shipping_cost.amount_total / 100;
      const date = Date.now();
      const userId = session.client_reference_id;
      let amountPaid;
      if (session.payment_status === 'unpaid') {
        amountPaid = 0;
      } else {
        amountPaid = session.amount_total / 100;
      }

      const paymentInfo = {
        id: session.payment_intent,
        status: session.payment_status,
        amountPaid,
        taxPaid: 0,
        paymentIntent: session.payment_intent,
      };
      let orderData;

      if (session?.metadata?.layaway && session?.metadata?.layaway === 'true') {
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

      await Order.create(orderData);

      await stripe.invoices.del(session.metadata.invoice);

      return NextResponse.json(
        {
          success: true,
        },
        { status: 201 }
      );
    }

    if (
      event.type === 'checkout.session.completed' &&
      session.payment_status === 'unpaid' &&
      !session?.metadata?.payoff
    ) {
      // get all the details from stripe checkout to create new order

      let line_items;

      if (
        session?.metadata?.layaway &&
        session?.metadata?.layaway === 'true' &&
        !session?.metadata?.order
      ) {
        line_items = await stripe.invoiceItems.list({
          invoice: session.metadata.invoice,
        });
      } else {
        line_items = await stripe.checkout.sessions.listLineItems(
          event.data.object.id
        );
      }

      const orderItems = await getCartItems(line_items);
      const ship_cost = session.shipping_cost.amount_total / 100;
      const date = Date.now();
      const userId = session.client_reference_id;
      const amountPaid = 0;

      const paymentInfo = {
        id: session.payment_intent,
        status: session.payment_status,
        amountPaid,
        taxPaid: 0,
        paymentIntent: session.payment_intent,
      };
      let orderData;

      if (session?.metadata?.layaway && session?.metadata?.layaway === 'true') {
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

      await Order.create(orderData);

      await stripe.invoices.del(session.metadata.invoice);

      return NextResponse.json(
        {
          success: true,
        },
        { status: 201 }
      );
    }

    // Bamd Oxxo Payments
    if (event.type === 'checkout.session.async_payment_succeeded') {
      // get all the details from stripe checkout to create new order
      let order;
      if (
        session?.metadata?.layaway &&
        session?.metadata?.layaway === 'true' &&
        session?.metadata?.order
      ) {
        order = await Order?.findOne({
          _id: session?.metadata?.order,
        });
      } else {
        order = await Order?.findOne({
          'paymentInfo.paymentIntent': session.payment_intent,
        });
      }

      console.log('order', order);
      const newPaymentAmount = session.amount_total / 100;

      const payAmount = order.paymentInfo.amountPaid + newPaymentAmount;

      // Use reduce to sum up the 'total' field
      const totalOrderAmount = order.orderItems.reduce(
        (acc, orderItem) => acc + orderItem.quantity * orderItem.price,
        0
      );

      console.log('totalOrderAmount , payAmount', totalOrderAmount, payAmount);

      if (totalOrderAmount >= payAmount) {
        order.orderStatus = 'Procesando';
      }

      if (totalOrderAmount < payAmount) {
        order.orderStatus = 'Apartado';
      }

      order.paymentInfo.amountPaid = payAmount;

      await order.save();
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
