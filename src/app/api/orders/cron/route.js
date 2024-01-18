import Order from '@/backend/models/Order';
import dbConnect from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  console.log('authHeader', authHeader, request.headers);
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    if (new Date() > twoDaysAgo) {
      console.log('more than 2 days ago');
    }

    await dbConnect();
    await Order.updateMany(
      { orderStatus: 'Pendiente', createdAt: { $lte: twoDaysAgo } },
      { $set: { orderStatus: 'Cancelada' } },
      { multi: true, upsert: true }
    );

    return NextResponse.json({
      message: 'Pedidos Cron actualizados exitosamente',
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: 'Error al crear Publicación',
      },
      { status: 500 }
    );
  }
}
