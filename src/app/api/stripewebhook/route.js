import Order from '@/backend/models/Order';
import dbConnect from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async (req, res) => {
  await dbConnect();

  try {
    const ordersCount = await Order.countDocuments();
    let orders = await Order.find();

    const response = NextResponse.json({
      message: 'Orders fetched successfully',
      success: true,
      ordersCount,
      orders,
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
};
