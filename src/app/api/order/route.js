import Address from '@/backend/models/Address';
import Order from '@/backend/models/Order';
import Product from '@/backend/models/Product';
import User from '@/backend/models/User';
import dbConnect from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export const GET = async (request) => {
  const token = await getToken({ req: request });
  if (!token) {
    // Not Signed in
    return new Response('You are not authorized, eh eh eh, no no no', {
      status: 400,
    });
  }
  try {
    await dbConnect();
    const _id = await request.url.split('?')[1];
    let order = await Order.findOne({ _id });

    let deliveryAddress = await Address.findOne(order.shippingInfo);
    let orderUser = await User.findOne(order.user);

    const dataPacket = {
      order,
      deliveryAddress,
      orderUser,
    };
    return new Response(JSON.stringify(dataPacket), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Orders loading error',
      },
      { status: 500 }
    );
  }
};

export async function PUT(req, res) {
  const token = await getToken({ req: req });

  if (token && token.user.role === 'manager') {
    try {
      await dbConnect();
      const { payload } = await req.json();
      let { orderStatus, _id } = payload;

      const oid = _id;

      const updateOrder = await Order.findOne({ _id: oid });
      updateOrder.orderStatus = orderStatus;

      // Save the Post to the database
      const savedOrder = await updateOrder.save();

      const response = NextResponse.json({
        message: 'Pedido actualizado exitosamente',
        success: true,
        post: savedOrder,
      });

      return response;
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        {
          error: 'Error al crear Publicación',
        },
        { status: 500 }
      );
    }
  } else {
    // Not Signed in
    return new Response('You are not authorized, eh eh eh, no no no', {
      status: 400,
    });
  }
}

export async function DELETE(request) {
  const token = await request.headers.get('cookie');

  if (!token) {
    // Not Signed in
    const notAuthorized = 'You are not authorized no no no';
    return new Response(JSON.stringify(notAuthorized), {
      status: 400,
    });
  }

  try {
    await dbConnect();
    const urlData = await request.url.split('?');
    const id = urlData[1];
    const soonToDeleteOrder = await Order.findById(id);

    if (!soonToDeleteOrder) {
      const notFoundResponse = 'Order not found';
      return new Response(JSON.stringify(notFoundResponse), { status: 404 });
    }

    // Iterate through order items and update Product quantities
    for (const orderItem of soonToDeleteOrder.orderItems) {
      const productId = orderItem.product.toString();
      const product = await Product.findById(productId);

      if (product) {
        // Increment the product quantity by the quantity of items in the deleted order
        await Product.updateOne(
          { _id: productId },
          { $inc: { stock: orderItem.quantity } }
        );
      }
    }
    const deleteOrder = await Order.findByIdAndDelete(id);

    return new Response(JSON.stringify(deleteOrder), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}
