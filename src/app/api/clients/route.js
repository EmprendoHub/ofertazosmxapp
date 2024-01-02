import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/backend/models/User';

export const GET = async (req, res) => {
  await dbConnect();

  try {
    let clients = await User.find({});
    const clientsCount = clients.length;
    const response = NextResponse.json({
      message: 'Clients fetched successfully',
      success: true,
      clientsCount,
      clients,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Clients loading error',
      },
      { status: 500 }
    );
  }
};
