import dbConnect from '@/lib/db';
import Address from '@/backend/models/Address';

export async function GET(request) {
  const sessionRaw = await request.headers.get('session');
  const session = JSON.parse(sessionRaw);
  if (!session) {
    // Not Signed in
    return new Response('You are not authorized, eh eh eh, no no no', {
      status: 400,
    });
  }

  try {
    await dbConnect();
    const addresses = await Address.find({ user: session?.user?._id });

    return new Response(JSON.stringify(addresses), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}
