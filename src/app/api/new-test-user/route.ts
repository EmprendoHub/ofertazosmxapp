import dbConnect from "@/lib/db";
import TestUser from "@/backend/models/TestUser";

export async function POST(req: any) {
  try {
    await dbConnect();
    const { testUser } = await req.json();
    console.log("testUser", testUser);

    const newTestUser = await TestUser.create(testUser);

    return new Response(JSON.stringify(newTestUser), { status: 201 });
  } catch (error: any) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}
