import Payment from "@/backend/models/Payment";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request, res) => {
  const token = await request.headers.get("cookie");
  if (!token) {
    // Not Signed in
    const notAuthorized = "You are not authorized no no no";
    return new Response(JSON.stringify(notAuthorized), {
      status: 400,
    });
  }
  try {
    await dbConnect();
    // Get today's date at midnight
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Get tomorrow's date at midnight
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // // Get yesterday's date at midnight
    // const startOfDay = new Date();
    // startOfDay.setDate(startOfDay.getDate() - 1);
    // startOfDay.setHours(0, 0, 0, 0);

    // // Get today's date at midnight (end of yesterday)
    // const endOfDay = new Date();
    // endOfDay.setDate(endOfDay.getDate() - 1);
    // endOfDay.setHours(23, 59, 59, 999);

    // Find payments between startOfDay and endOfDay
    const paymentQuery = await Payment.find({
      pay_date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ pay_date: -1 });

    const paymentTotals = await paymentQuery.reduce(
      (total, payment) => total + payment.amount,
      0
    );

    const itemCount = paymentQuery.length;

    const payments = {
      payments: paymentQuery,
    };
    const dataPacket = {
      payments,
      itemCount,
      paymentTotals,
    };

    return new Response(JSON.stringify(dataPacket), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Payments loading error",
      },
      { status: 500 }
    );
  }
};
