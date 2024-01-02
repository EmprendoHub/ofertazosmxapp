import dbConnect from '@/lib/db';
import Address from '@/backend/models/Address';
import { getToken } from 'next-auth/jwt';

export async function GET(request) {
  const token = await getToken({ req: request });
  if (token) {
    try {
      await dbConnect();
      const addressesData = await Address.find({ user: token?._id });
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
