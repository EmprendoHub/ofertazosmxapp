"use server";

import { options } from "@/app/api/auth/[...nextauth]/options";
import User from "@/backend/models/User";
import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth";

export async function updateUserMercadoToken(tokenData: any) {
  if (!tokenData) return;
  const session = await getServerSession(options);
  try {
    await dbConnect();

    const updatedUSer = await User.findOneAndUpdate(
      { _id: session?.user?._id }, // Query condition
      { $set: { mercado_token: tokenData } } // Update operation
    );
    console.log("updatedUSer", updatedUSer);
  } catch (error: any) {
    console.log(error);

    throw new Error(`Failed to update user: we got error: ${error.message}`);
  }
}
