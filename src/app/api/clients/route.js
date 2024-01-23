import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/backend/models/User';
import { getToken } from 'next-auth/jwt';

export const GET = async (request, res) => {
  const token = await getToken({ req: request });
  if (token) {
    try {
      await dbConnect();
      let clients = await User.find({ role: 'cliente' });
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
  } else {
    // Not Signed in
    return new Response('You are not authorized, eh eh eh, no no no', {
      status: 400,
    });
  }
};
