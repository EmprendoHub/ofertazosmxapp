import { exchangeCodeForToken } from "@/actions/mercadolibre";

export async function POST(request) {
  const { code, codeVerifier } = await request.json();

  try {
    const tokenData = await exchangeCodeForToken(code, codeVerifier);
    return new Response(JSON.stringify(tokenData), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
