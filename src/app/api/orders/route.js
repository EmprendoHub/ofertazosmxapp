import Address from '@/backend/models/Address';
import Order from '@/backend/models/Order';
import User from '@/backend/models/User';
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

        await Promise.all(
          obj1.map(async (order) => {
            let shippingInfo = await Address.findOne({
              _id: order.shippingInfo,
            });
            let user = await User.findOne({ _id: order.user });
            order.shippingInfo = shippingInfo;
            order.user = user;
          })
        );

        // If you want a new sorted array without modifying the original one, use slice
        // obj1
        //   .slice()
        //   .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        // or for descending order
        const sortedObj1 = obj1
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const orders = {
          orders: sortedObj1,
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
