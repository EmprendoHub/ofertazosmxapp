import User from '@/backend/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const cookie = await request.headers.get('cookie');
  const token = await request.headers.get('token');
  if (!cookie) {
    // Not Signed in
    const notAuthorized = 'You are not authorized no no no';
    return new Response(JSON.stringify(notAuthorized), {
      status: 400,
    });
  }
  try {
    const verifiedUser = await User.findOne({
      verificationToken: token,
    });
    if (verifiedUser) {
      verifiedUser.active = true;
      verifiedUser.save();
      return NextResponse.json(
        { message: 'Usuario verificado' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Usuario no verificado' },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to send email' },
      { status: 500 }
    );
  }
}
