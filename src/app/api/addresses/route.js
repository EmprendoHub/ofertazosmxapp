import dbConnect from '@/lib/db';
import Address from '@/backend/models/Address';

export async function GET(req) {
  const sessionData = req.headers.get('x-mysession-key');
  const session = JSON.parse(sessionData);
  if (session) {
    try {
      await dbConnect();
      const addressesData = await Address.find({ user: session.user._id });
      const obj1 = Object.assign(addressesData);
      const addresses = {
        addresses: obj1,
      };
      return new Response(JSON.stringify(addresses), { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify(error.message), { status: 500 });
    }
  } else {
    // Not Signed in
    return new Response('You are not authorized, eh eh eh, no no no', {
      status: 400,
    });
  }
}
