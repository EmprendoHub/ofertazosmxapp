import Order from '@/backend/models/Order';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

async function getCartItems(items) {
  return new Promise((resolve, reject) => {
    let cartItems = [];

    items?.forEach(async (item) => {
      cartItems.push({
        product: { _id: item._id },
        name: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.images[0].url,
      });

      if (cartItems.length === items?.length) {
        resolve(cartItems);
      }
    });
  });
}

const calculateTotalAmount = (items) => {
  // Assuming each item has a 'price' and 'quantity' property
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const POST = async (request) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const urlData = await request.url.split('?');
    const isLayaway = urlData[1] === 'layaway';
    const reqBody = await request.json();
    const { items, email, user, shipping } = await reqBody;

    const existingCustomers = await stripe.customers.list({
      email: user.email,
    });
    let customerId;

    if (existingCustomers.data.length > 0) {
      // Customer already exists, use the first customer found
      const existingCustomer = existingCustomers.data[0];
      customerId = existingCustomer.id;
    } else {
      // Customer doesn't exist, create a new customer
      const newCustomer = await stripe.customers.create({
        email: user.email,
      });

      customerId = newCustomer.id;
    }

    // Calculate total amount based on items
    let totalAmount = await calculateTotalAmount(items);

    // Calculate installment amount
    let installmentAmount = Math.round(totalAmount * 0.3);

    let session;

    const shippingInfo = JSON.stringify(shipping);
    const ship_cost = 0;
    const date = Date.now();
    const paymentInfo = {
      id: 'pending',
      status: 'pending',
      amountPaid: 0,
      taxPaid: 0,
      paymentIntent: 'pending',
    };
    const order_items = await getCartItems(items);

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
        quantity: item.quantity,
      };
    });

    let orderData;
    if (isLayaway) {
      orderData = {
        user: user._id,
        ship_cost,
        createdAt: date,
        shippingInfo: shipping,
        paymentInfo,
        orderItems: order_items,
        orderStatus: 'Pendiente',
        layaway: true,
      };
    } else {
      orderData = {
        user: user._id,
        ship_cost,
        createdAt: date,
        shippingInfo: shipping,
        paymentInfo,
        orderItems: order_items,
        orderStatus: 'Pendiente',
        layaway: false,
      };
    }

    //await Order.create(orderData);
    const newOrder = await new Order(orderData);
    await newOrder.save();

    console.log(newOrder._id.toString(), 'newOrder._id');

    if (isLayaway) {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'oxxo', 'customer_balance'],
        mode: 'payment',
        customer: customerId,
        payment_method_options: {
          oxxo: {
            expires_after_days: 2,
          },
          customer_balance: {
            funding_type: 'bank_transfer',
            bank_transfer: {
              type: 'mx_bank_transfer',
            },
          },
        },
        locale: 'es-419',
        client_reference_id: user?._id,
        success_url: `${process.env.NEXTAUTH_URL}/perfil/pedidos?pedido_exitoso=true`,
        cancel_url: `${
          process.env.NEXTAUTH_URL
        }/cancelado?${newOrder._id.toString()}`,
        metadata: {
          shippingInfo,
          layaway: isLayaway,
          order: newOrder._id.toString(),
        },
        shipping_options: [
          {
            shipping_rate: 'shr_1OW9lzF1B19DqtcQpzK984xg',
          },
        ],
        line_items: [
          {
            price_data: {
              currency: 'mxn',
              unit_amount: installmentAmount * 100, // Convert to cents
              product_data: {
                name: 'Pago Inicial de Apartado',
                description: `Pago inicial para apartado de pedido #${newOrder.orderId}`,
              },
            },
            quantity: 1,
          },
        ],
      });
    } else {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'oxxo', 'customer_balance'],
        mode: 'payment',
        customer: customerId,
        payment_method_options: {
          oxxo: {
            expires_after_days: 2,
          },
          customer_balance: {
            funding_type: 'bank_transfer',
            bank_transfer: {
              type: 'mx_bank_transfer',
            },
          },
        },
        locale: 'es-419',
        success_url: `${process.env.NEXTAUTH_URL}/perfil/pedidos?pedido_exitoso=true`,
        cancel_url: `${
          process.env.NEXTAUTH_URL
        }/cancelado?${newOrder._id.toString()}`,
        client_reference_id: user?._id,
        metadata: {
          shippingInfo,
          layaway: isLayaway,
          order: newOrder._id.toString(),
        },
        shipping_options: [
          {
            shipping_rate: 'shr_1OW9lzF1B19DqtcQpzK984xg',
          },
        ],
        line_items,
      });
    }

    console.log(' session ', session);

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
