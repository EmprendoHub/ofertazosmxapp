import Order from "@/backend/models/Order";
import APIReportsFilters from "@/lib/APIReportsFilters";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";

async function getTotalValueOfItems(orders) {
  let totalValue = 0;
  orders.forEach((order) => {
    if (order.orderItems && order.orderItems.length > 0) {
      const orderTotal = order.orderItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      totalValue += orderTotal;
    }
  });
  return totalValue;
}

export const GET = async (request, res) => {
  const sessionRaw = await request.headers.get("session");
  const session = JSON.parse(sessionRaw);
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
    let orderQuery;
    if (session?.user?.role === "manager") {
      orderQuery = Order.find({ orderStatus: { $ne: "Cancelado" } });
    } else {
      orderQuery = Order.find({
        user: session?.user?._id,
        orderStatus: { $ne: "Cancelado" },
      });
    }

    // Apply descending order based on a specific field (e.g., createdAt)
    orderQuery = orderQuery.sort({ createdAt: -1 });

    // Extract page and per_page from request URL
    const totalOrderCount = await Order.countDocuments();

    // Apply search Filters including order_id and orderStatus
    const apiReportsFilters = new APIReportsFilters(
      orderQuery,
      request.nextUrl.searchParams
    )
      .searchAllFields()
      .filter();

    let ordersData = await apiReportsFilters.query;

    const paymentTotals = await ordersData.reduce(
      (total, order) => total + order.paymentInfo.amountPaid,
      0
    );

    const orderTotals = await getTotalValueOfItems(ordersData);
    const itemCount = ordersData.length;

    ordersData = await ordersData
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const orders = {
      orders: ordersData,
    };

    const dataPacket = {
      orders,
      totalOrderCount,
      itemCount,
      paymentTotals,
      orderTotals,
    };

    return new Response(JSON.stringify(dataPacket), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Orders loading error",
      },
      { status: 500 }
    );
  }
};
