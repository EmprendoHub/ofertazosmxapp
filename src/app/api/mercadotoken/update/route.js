import { getToken } from "next-auth/jwt";
import { User } from "@/models/user";

export async function POST(request) {
  const userToken = getToken({ req: request });
  let user;
  let tokenData;
  try {
    if (userToken) {
      user = await User.findOne({ _id: userToken.user._id });
      if (user) {
        tokenData = user.mercado_token;
      }
    } else {
    }

    const appId = process.env.NEXT_PUBLIC_MERCADO_LIBRE_APP_ID;
    const secretKey = process.env.MERCADO_LIBRE_APP_SECRET;
    const response = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: appId,
        client_secret: secretKey,
        refresh_token: tokenData.refresh_token,
      }),
    });

    const newTokenData = await response.json();
    if (tokenData.status === 400) {
      return new Response(JSON.stringify(newTokenData), {
        status: 400,
      });
    }

    console.log("newTokenData", newTokenData);
    user.mercado_token = newTokenData;
    await user.save();

    return new Response(JSON.stringify(newTokenData), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
