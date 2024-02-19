import { cstDateTime } from '@/backend/helpers';
import Order from '@/backend/models/Order';
import Product from '@/backend/models/Product';
import User from '@/backend/models/User';
import { NextResponse } from 'next/server';

async function getCartItems(items) {
  return new Promise((resolve, reject) => {
    let cartItems = [];

    items?.forEach(async (item) => {
      const variationId = item._id;
      const product = await Product.findOne({
        'variations._id': variationId,
      });

      const variation = product.variations.find((variation) =>
        variation._id.equals(item._id)
      );
      // Check if there is enough stock
      if (variation.stock < item.quantity) {
        console.log('Insufficient stock');
        return;
      }

      cartItems.push({
        product: product._id,
        variation: variationId,
        name: item.title,
        color: item.color,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      });

      if (cartItems.length === items?.length) {
        resolve(cartItems);
      }
    });
  });
}

export const POST = async (request) => {
  try {
    //const isLayaway = await request.headers.get('paytype');
    const reqBody = await request.json();
    const { items, email, amountReceived } = await reqBody;
    console.log(items, email, amountReceived);
    const existingUser = await User.findOne({
      email: email,
    });
    let userId = existingUser._id;

    const branchInfo = 'Sucursal Sahuayo';
    const ship_cost = 0;
    const date = cstDateTime();
    const paymentInfo = {
      id: 'paid',
      status: 'paid',
      amountPaid: amountReceived,
      taxPaid: 0,
      paymentIntent: 'pending',
    };

    const order_items = await getCartItems(items);
    console.log(order_items, 'orders items');
    let orderData = {
      user: userId,
      ship_cost,
      createdAt: date,
      branch: branchInfo,
      paymentInfo,
      orderItems: order_items,
      orderStatus: 'Entregado',
      layaway: false,
      affiliateId: '',
    };
    console.log(orderData);
    //await Order.create(orderData);
    const newOrder = await new Order(orderData);
    await newOrder.save();
    console.log(newOrder);
    return NextResponse.json({
      message: 'Orden Pagada!',
      success: true,
      order: newOrder,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
