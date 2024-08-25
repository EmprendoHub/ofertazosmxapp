import { getToken } from "next-auth/jwt";
import { User } from "@/models/user";

export async function POST(request) {
  const { code, codeVerifier } = await request.json();
  const userToken = getToken({ req: request });
  try {
    const appId = process.env.NEXT_PUBLIC_MERCADO_LIBRE_APP_ID;
    const secretKey = process.env.MERCADO_LIBRE_APP_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_MERCADO_LIBRE_REDIRECT_URL;
    const response = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: appId,
        client_secret: secretKey,
        code: code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    const tokenData = await response.json();
    if (tokenData.status === 400) {
      return new Response(JSON.stringify(tokenData), {
        status: 400,
      });
    }
    if (tokenData && userToken) {
      const user = await User.findOne({ _id: userToken.user._id });
      if (user) {
        user.mercado_token = tokenData;
        await user.save();
      }
    }
    return new Response(JSON.stringify(tokenData), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
