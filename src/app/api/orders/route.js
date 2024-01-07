import Order from '@/backend/models/Order';
import dbConnect from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const token = await getToken({ req: request });
  if (token) {
    try {
      await dbConnect();
      if (token?.user?.role === 'manager') {
        let ordersData = await Order.find({});

        const obj1 = Object.assign(ordersData);
        const orders = {
          orders: obj1,
        };

        return new Response(JSON.stringify(orders), { status: 201 });
      } else {
        let ordersData = await Order.find({ user: token?._id });

        const obj1 = Object.assign(ordersData);
        const orders = {
          orders: obj1,
        };
        return new Response(JSON.stringify(orders), { status: 201 });
      }
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
}
