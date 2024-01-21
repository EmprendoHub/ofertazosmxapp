import Affiliate from '@/backend/models/Affiliate';
import dbConnect from '@/lib/db';
import { getToken } from 'next-auth/jwt';

export async function GET(request) {
  const token = await getToken({ req: request });
  if (token) {
    try {
      await dbConnect();
      const affiliateData = await Affiliate.findOne({ user: token?._id });

      return new Response(JSON.stringify(affiliateData), { status: 201 });
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
