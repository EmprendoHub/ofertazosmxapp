import Affiliate from '@/backend/models/Affiliate';
import Order from '@/backend/models/Order';
import Post from '@/backend/models/Post';
import Product from '@/backend/models/Product';
import User from '@/backend/models/User';
import dbConnect from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async (request, res) => {
  const sessionRaw = await request.headers.get('session');
  const session = JSON.parse(sessionRaw);
  if (!session) {
    // Not Signed in
    return new Response('You are not authorized, eh eh eh, no no no', {
      status: 400,
    });
  }

  try {
    await dbConnect();
    let orders;
    let affiliates;
    let products;
    let clients;
    let posts;

    if (session?.user?.role === 'manager') {
      orders = await Order.find({ orderStatus: { $ne: 'Cancelado' } });
      affiliates = await Affiliate.find({ published: { $ne: 'false' } });
      products = await Product.find({ published: { $ne: 'false' } });
      clients = await User.find({ role: 'cliente' });
      posts = await Post.find({ published: { $ne: 'false' } });

      const totalOrderCount = orders.length;
      const totalAffiliateCount = affiliates.length;
      const totalProductCount = products.length;
      const totalClientCount = clients.length;
      const totalPostCount = posts.length;

      // Apply descending order based on a specific field (e.g., createdAt)
      //   orders = await orders.sort({ createdAt: -1 });
      //   affiliates = await affiliates.sort({ createdAt: -1 });
      //   products = await products.sort({ createdAt: -1 });
      //   clients = await clients.sort({ createdAt: -1 });

      // await Promise.all(
      //   ordersData.map(async (order) => {
      //     let shippingInfo = await Address.findOne({
      //       _id: order.shippingInfo,
      //     });
      //     let user = await User.findOne({ _id: order.user });
      //     order.shippingInfo = shippingInfo;
      //     order.user = user;
      //   })
      // );

      // descending order
      // const sortedOrders = ordersData
      //   .slice()
      //   .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      // If you want a new sorted array without modifying the original one, use slice
      orders = await orders
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      affiliates = await affiliates
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      products = await products
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      clients = await clients
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const dataPacket = {
        orders,
        totalOrderCount,
        affiliates,
        totalAffiliateCount,
        products,
        totalProductCount,
        clients,
        totalClientCount,
        posts,
        totalPostCount,
      };
      return new Response(JSON.stringify(dataPacket), { status: 201 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Dashboard DB loading error',
      },
      { status: 500 }
    );
  }
};
