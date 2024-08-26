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
    console.log("serversidertoken DAta", tokenData);
    const updatedUser = await User.findOneAndUpdate(
      { _id: session?.user?._id }, // Query condition
      { $set: { mercado_token: tokenData } }, // Update operation
      { new: true, runValidators: true } // Options
    );
    console.log("updatedUSer", updatedUser);
  } catch (error: any) {
    console.log(error);

    throw new Error(`Failed to update user: we got error: ${error.message}`);
  }
}
