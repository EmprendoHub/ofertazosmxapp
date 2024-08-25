import { getToken } from "next-auth/jwt";
import User from "@/backend/models/User";

export async function POST(request: any) {
  const userToken: any = await getToken({ req: request });
  try {
    const user: any = await User.findOne({ _id: userToken.user._id });

    const tokenData = user.mercado_token;
    if (!tokenData) {
      return new Response(JSON.stringify(tokenData), {
        status: 400,
      });
    }

    return new Response(JSON.stringify(tokenData), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
