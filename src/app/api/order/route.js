import Address from '@/backend/models/Address';
import Order from '@/backend/models/Order';
import User from '@/backend/models/User';
import dbConnect from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export const GET = async (request, res) => {
  await dbConnect();
  const token = await getToken({ req: request });
  if (token) {
    try {
      const _id = await request.url.split('?')[1];
      let order = await Order.findOne({ _id });

      let deliveryAddress = await Address.findOne(order.shippingInfo);
      let orderUser = await User.findOne(order.user);

      const response = NextResponse.json({
        message: 'Order fetched successfully',
        success: true,
        order,
        deliveryAddress,
        orderUser,
      });

      return response;
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Orders loading error',
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
