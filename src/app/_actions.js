'use server';
import Address from '@/backend/models/Address';
import dbConnect from '@/lib/db';
import { getServerSession } from 'next-auth';
import { options } from './api/auth/[...nextauth]/options';
import {
  AddressEntrySchema,
  ClientPasswordUpdateSchema,
  ClientUpdateSchema,
  PageEntrySchema,
  PageUpdateSchema,
  PostEntrySchema,
  PostUpdateSchema,
  ProductEntrySchema,
  VariationProductEntrySchema,
  VariationUpdateProductEntrySchema,
  VerifyEmailSchema,
} from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import Post from '@/backend/models/Post';
import Product from '@/backend/models/Product';
import User from '@/backend/models/User';
import Affiliate from '@/backend/models/Affiliate';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import axios from 'axios';
import {
  cstDateTime,
  generateUrlSafeTitle,
  getTotalFromItems,
} from '@/backend/helpers';
import Order from '@/backend/models/Order';
import APIPostsFilters from '@/lib/APIPostsFilters';
import APIFilters from '@/lib/APIFilters';
import APIOrderFilters from '@/lib/APIOrderFilters';
import APIClientFilters from '@/lib/APIClientFilters';
import APIAffiliateFilters from '@/lib/APIAffiliateFilters';
import Page from '@/backend/models/Page';
import Payment from '@/backend/models/Payment';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import Customer from '@/backend/models/Customer';

// Function to get the document count for all from the previous month
const getDocumentCountPreviousMonth = async (model) => {
  const now = new Date();
  const firstDayOfPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );
  const lastDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  try {
    const documentCount = await model.countDocuments(
      {
        createdAt: {
          $gte: firstDayOfPreviousMonth,
          $lte: lastDayOfPreviousMonth,
        },
      },
      {
        published: { $ne: 'false' },
      }
    );

    return documentCount;
  } catch (error) {
    console.error('Error counting documents from the previous month:', error);
    throw error;
  }
};

async function getQuantities(orderItems) {
  // Use reduce to sum up the 'quantity' fields
  const totalQuantity = orderItems?.reduce((sum, obj) => sum + obj.quantity, 0);
  return totalQuantity;
}

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

async function getTotal(orderItems) {
  // Use reduce to sum up the 'total' field
  let totalAmount = orderItems?.reduce(
    (acc, cartItem) => acc + cartItem.quantity * cartItem.price,
    0
  );
  totalAmount = formatter.format(totalAmount);
  return totalAmount;
}

async function getPendingTotal(orderItems, orderAmountPaid) {
  // Use reduce to sum up the 'total' field
  const totalAmount = orderItems?.reduce(
    (acc, cartItem) => acc + cartItem.quantity * cartItem.price,
    0
  );
  let pendingAmount = totalAmount - orderAmountPaid;
  pendingAmount = formatter.format(pendingAmount);
  return pendingAmount;
}

async function subtotal(order) {
  let sub = order?.paymentInfo?.amountPaid - order?.ship_cost;
  sub = formatter.format(sub);
  return sub;
}

// Function to get the document count for all orders from the previous month
const getClientCountPreviousMonth = async () => {
  const now = new Date();
  const firstDayOfPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );
  const lastDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  try {
    const clientCount = await User.countDocuments(
      {
        createdAt: {
          $gte: firstDayOfPreviousMonth,
          $lte: lastDayOfPreviousMonth,
        },
      },
      { role: 'cliente' }
    );

    return clientCount;
  } catch (error) {
    console.error('Error counting clients from the previous month:', error);
    throw error;
  }
};

export async function payPOSDrawer(data) {
  try {
    let {
      items,
      transactionNo,
      payType,
      amountReceived,
      note,
      email,
      phone,
      name,
    } = Object.fromEntries(data);

    await dbConnect();
    let customer;
    let customerEmail;
    let customerPhone;
    let customerName;

    if (email.length > 3) {
      console.log('if  email', email);
      customerEmail = email;
    } else {
      if (phone.length > 3 || name.length > 3) {
        console.log('if phone or name', phone, name);
        customerEmail =
          phone + name.replace(/\s/g, '').substring(0, 8) + '@noemail.com';
      } else {
        console.log('if sucursal');
        customerEmail = 'sucursal@shopout.com';
      }
    }

    if (name.length > 3) {
      customerName = name;
    } else {
      customerName = 'SUCURSAL';
    }

    const query = { $or: [{ email: customerEmail }] };
    if (phone.length > 3) {
      customerPhone = phone;
      query.$or.push({ phone: phone });
    } else {
      customerPhone = '';
    }

    const customerExists = await Customer.findOne(query);

    if (!customerExists) {
      // Generate a random 64-byte token
      const newCustomer = new Customer({
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
      });
      await newCustomer.save();
      customer = newCustomer;
    } else {
      customer = customerExists;
    }
    items = JSON.parse(items);
    const branchInfo = 'Sucursal';
    const ship_cost = 0;
    const date = cstDateTime();

    let paymentInfo;
    let layAwayIntent;
    let currentOrderStatus;
    let payMethod;

    if (transactionNo === 'EFECTIVO') {
      payMethod = 'EFECTIVO';
    } else if (!isNaN(transactionNo)) {
      payMethod = 'TERMINAL';
    }
    if (payType === 'layaway') {
      paymentInfo = {
        id: 'partial',
        status: 'unpaid',
        amountPaid: amountReceived,
        taxPaid: 0,
        paymentIntent: 'partial',
      };
      currentOrderStatus = 'Apartado';
      layAwayIntent = true;
    } else {
      paymentInfo = {
        id: 'paid',
        status: 'paid',
        amountPaid: amountReceived,
        taxPaid: 0,
        paymentIntent: 'paid',
      };
      currentOrderStatus = 'Pagado';
      layAwayIntent = false;
    }

    const cartItems = [];
    await Promise.all(
      items?.map(async (item) => {
        const variationId = item._id.toString();
        const product = await Product.findOne({
          'variations._id': variationId,
        });

        const variation = product.variations.find((variation) =>
          variation._id.equals(variationId)
        );
        // Check if there is enough stock
        if (variation.stock < item.quantity) {
          console.log('Este producto no cuenta con existencias');
          return {
            error: {
              title: { _errors: ['Este producto no cuenta con existencias'] },
            },
          };
        } else {
          variation.stock -= 1;
          product.stock -= 1;
          cartItems.push({
            product: product._id,
            variation: variationId,
            name: item.title,
            color: item.color,
            size: item.size,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          });
          product.save();
        }
      })
    );

    let orderData = {
      customer: customer._id,
      phone: customer?.phone,
      email: customer?.email,
      customerName: customerName,
      comment: note,
      ship_cost,
      createdAt: date,
      branch: branchInfo,
      paymentInfo,
      orderItems: cartItems,
      orderStatus: currentOrderStatus,
      layaway: layAwayIntent,
      affiliateId: '',
    };

    let newOrder = await new Order(orderData);
    await newOrder.save();
    const newOrderString = JSON.stringify(newOrder);

    let paymentTransactionData = {
      type: 'sucursal',
      paymentIntent: '',
      amount: amountReceived,
      reference: transactionNo,
      pay_date: date,
      method: payMethod,
      order: newOrder?._id,
      customer: newOrder?.customer,
    };
    try {
      const newPaymentTransaction = await new Payment(paymentTransactionData);

      await newPaymentTransaction.save();
    } catch (error) {
      console.log('dBberror', error);
    }

    // send email after order is confirmed
    if (
      customerEmail.includes('@noemail.com') ||
      customerEmail === 'sucursal@shopout.com'
    ) {
      console.log('did not send email');
    } else {
      try {
        const subject = '¡Gracias por tu compra!';
        const bodyOne = `Queríamos expresarte nuestro más sincero agradecimiento por haber elegido SHOP OUT MX para realizar tu compra reciente. Nos complace enormemente saber que confías en nuestros productos/servicios.`;
        const bodyTwo = `Tu apoyo significa mucho para nosotros y nos comprometemos a brindarte la mejor experiencia posible. Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en ponerte en contacto con nuestro equipo de atención al cliente. Estamos aquí para ayudarte en cualquier momento.`;
        const title = 'Recibo de compra';
        const greeting = `Estimado/a ${customer?.name}`;
        const senderName = 'www.shopout.com.mx';
        const bestRegards = '¡Que tengas un excelente día!';
        const recipient_email = customer?.email;
        const sender_email = 'contacto@shopout.com.mx';
        const fromName = 'Shopout Mx';

        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GOOGLE_MAIL,
            pass: process.env.GOOGLE_MAIL_PASS_ONE,
          },
        });

        const formattedAmountPaid = formatter.format(
          newOrder?.paymentInfo?.amountPaid || 0
        );

        const mailOption = {
          from: `"${fromName}" ${sender_email}`,
          to: recipient_email,
          subject,
          html: `
        <!DOCTYPE html>
        <html lang="es">
        <body>
        <div>
        <p>${greeting}</p>
        <div>${bodyOne}</div>
        <p>${title}</p>
        <table style="width: 100%; font-size: 0.875rem; text-align: left;">
          <thead style="font-size: .7rem; color: #4a5568;  text-transform: uppercase;">
            <tr>
              <th style="padding: 0.75rem;">Nombre</th>
              <th style="padding: 0.75rem;">Tamaño</th>
              <th style="padding: 0.75rem;">Color</th>
              <th style="padding: 0.75rem;">Cant.</th>
              <th style="padding: 0.75rem;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${newOrder?.orderItems
              ?.map(
                (item, index) =>
                  `<tr style="background-color: #fff;" key="${index}">
                <td style="padding: 0.75rem;">${item.name}</td>
                <td style="padding: 0.75rem;">${item.size}</td>
                <td style="padding: 0.75rem;">${item.color}</td>
                <td style="padding: 0.75rem;">${item.quantity}</td>
                <td style="padding: 0.75rem;">${item.price}</td>
              </tr>`
              )
              .join('')}
              <tr>
              <div style="max-width: 100%; width: 100%; margin: 0 auto; background-color: #ffffff; display: flex; flex-direction: column; padding: 0.5rem;">
        ${
          newOrder?.orderStatus === 'Apartado'
            ? `<ul style="margin-bottom: .75rem; padding-left: 0px;">
            <li style="display: flex; justify-content: space-between; gap: 0.75rem; color: #4a5568; margin-bottom: 0.25rem;">
              <span>Total de Artículos:</span>
              <span style="color: #48bb78;">
                ${await getQuantities(newOrder?.orderItems)} (Artículos)
              </span>
            </li>
            <li style="display: flex; justify-content: space-between; gap: 0.75rem; color: #4a5568; margin-bottom: 0.25rem;">
              <span>Sub-Total:</span>
              <span>
                ${(await subtotal(newOrder)) || 0}
              </span>
            </li>
            <li style="display: flex; justify-content: space-between; gap: 0.75rem; color: #4a5568; margin-bottom: 0.25rem;">
              <span>Total:</span>
              <span>
                ${(await getTotal(newOrder?.orderItems)) || 0}
              </span>
            </li>
            <li style="font-size: 1.25rem; font-weight: bold; border-top: 1px solid #cbd5e0; display: flex; justify-content: space-between; gap: 0.75rem; padding-top: 0.75rem;">
              <span>Abono:</span>
              <span>
                - ${formattedAmountPaid}
              </span>
            </li>
            <li style="font-size: 1.25rem; color: #ff9900; font-weight: bold; border-top: 1px solid #cbd5e0; display: flex; justify-content: space-between; gap: 0.75rem; padding-top: 0.25rem;">
              <span>Pendiente:</span>
              <span>
                ${
                  (await getPendingTotal(
                    newOrder?.orderItems,
                    newOrder?.paymentInfo?.amountPaid
                  )) || 0
                }
                
              </span>
            </li>
          </ul>`
            : `<ul style="margin-bottom: 1.25rem;">
            <li style="display: flex; justify-content: space-between; gap: 0.75rem; color: #4a5568; margin-bottom: 0.25rem;">
              <span>Sub-Total:</span>
              <span>
                ${(await subtotal(newOrder)) || 0}
              </span>
            </li>
            <li style="display: flex; justify-content: space-between; gap: 0.75rem; color: #4a5568; margin-bottom: 0.25rem;">
              <span>Total de Artículos:</span>
              <span style="color: #086e4f;">
                ${await getQuantities(newOrder?.orderItems)} (Artículos)
              </span>
            </li>
            <li style="display: flex; justify-content: space-between; gap: 0.75rem; color: #4a5568; margin-bottom: 0.25rem;">
              <span>Envió:</span>
              <span>
                ${newOrder?.ship_cost}
              </span>
            </li>
            <li style="font-size: 1.875rem; font-weight: bold; border-top: 1px solid #cbd5e0; display: flex; justify-content: space-between; gap: 0.75rem; margin-top: 1rem; padding-top: 0.75rem;">
              <span>Total:</span>
              <span>
                ${formattedAmountPaid}
                
              </span>
            </li>
          </ul>`
        }
        </div>
              </tr>
          </tbody>
        </table>
        <div>${bodyTwo}</div>
        <p>${senderName}</p>
        <p>${bestRegards}</p>
        </div>
        </body>
        </html>
        `,
        };

        await transporter.sendMail(mailOption);
        console.log(`Email sent successfully to ${recipient_email}`);
      } catch (error) {
        console.log(error);
        throw Error(error);
      }
    }

    revalidatePath('/admin/');
    revalidatePath('/puntodeventa/');
    return { newOrder: newOrderString };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getDashboard() {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let orders;
    let todaysOrders;
    let products;
    let affiliates;
    let clients;
    let posts;
    let thisWeeksOrder;
    let totalOrdersThisWeek;
    let dailyOrders;
    let dailyOrdersTotals;
    let monthlyOrdersTotals;
    let yearlyOrdersTotals;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight

    // Set start of the current year
    const startOfYear = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);

    // Set end of the current year
    const endOfYear = new Date(today.getFullYear() + 1, 0, 0, 0, 0, 0, 0);

    // Set start of the current month
    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
      0,
      0,
      0,
      0
    );

    // Set end of the current month
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      0,
      0,
      0,
      0
    );
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - today.getDay());
    startOfCurrentWeek.setHours(0, 0, 0, 0); // Set time to midnight

    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0
    );

    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      0,
      0
    );

    // Calculate yesterday's date
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1, 0, 0, 0, 0); // Set it to yesterday

    // Set start and end of yesterday
    const startOfYesterday = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
      0,
      0,
      0,
      0
    );
    const endOfYesterday = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate() + 1,
      0,
      0,
      0,
      0
    );

    orders = await Order.find({ orderStatus: { $ne: 'Cancelado' } })
      .sort({ createdAt: -1 }) // Sort in descending order of creation date
      .limit(5);

    affiliates = await Affiliate.find({ published: { $ne: 'false' } })
      .sort({ createdAt: -1 }) // Sort in descending order of creation date
      .limit(5);
    clients = await Customer.find()
      .sort({ createdAt: -1 }) // Sort in descending order of creation date
      .limit(5);
    posts = await Post.find({ published: { $ne: 'false' } })
      .sort({ createdAt: -1 }) // Sort in descending order of creation date
      .limit(5);

    dailyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfToday,
            $lt: endOfToday,
          },
        },
      },
      {
        $unwind: '$orderItems',
      },
      {
        $group: {
          _id: {
            orderStatus: '$orderStatus',
            orderId: '$orderId',
            _id: '$_id',
          },
          total: { $sum: '$orderItems.price' },
        },
      },
      {
        $project: {
          _id: '$_id._id',
          total: 1,
          orderStatus: '$_id.orderStatus',
          orderId: '$_id.orderId',
        },
      },
    ]);

    dailyOrdersTotals = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfToday,
            $lt: endOfToday,
          },
        },
      },
      {
        $unwind: '$orderItems',
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$orderItems.price' },
        },
      },
    ]);

    // Perform aggregation to get yesterday's totals
    let yesterdaysOrdersTotals = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYesterday,
            $lt: endOfYesterday,
          },
        },
      },
      {
        $unwind: '$orderItems',
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$orderItems.price' },
        },
      },
    ]);

    thisWeeksOrder = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfCurrentWeek,
            $lt: today,
          },
        },
      },
      {
        $unwind: '$orderItems', // Deconstruct the orderItems array
      },
      {
        $group: {
          _id: {
            orderStatus: '$orderStatus',
            orderId: '$orderId', // Include orderId in the _id
            _id: '$_id', // Include _id in the _id
          },
          total: { $sum: '$orderItems.price' }, // Calculate the total sum of prices
        },
      },
      {
        $project: {
          _id: '$_id._id', // Project the _id from _id
          total: 1,
          orderStatus: '$_id.orderStatus',
          orderId: '$_id.orderId', // Project orderId
        },
      },
    ]);

    totalOrdersThisWeek = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfCurrentWeek,
            $lt: today,
          },
        },
      },
      {
        $unwind: '$orderItems', // Deconstruct the orderItems array
      },
      {
        $group: {
          _id: null, // Group all documents without any specific criteria
          total: { $sum: '$orderItems.price' }, // Calculate the total sum of prices
        },
      },
    ]);

    // Perform aggregation to get this month's totals
    monthlyOrdersTotals = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $unwind: '$orderItems',
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$orderItems.price' },
        },
      },
    ]);

    // Perform aggregation to get this year's totals
    yearlyOrdersTotals = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lt: endOfYear,
          },
        },
      },
      {
        $unwind: '$orderItems',
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$orderItems.price' },
        },
      },
    ]);

    products = await Product.find({ published: { $ne: 'false' } })
      .sort({ createdAt: -1 }) // Sort in descending order of creation date
      .limit(5);

    const totalOrderCount = await Order.countDocuments({
      orderStatus: { $ne: 'Cancelado' },
    });
    const totalPostCount = await Post.countDocuments();
    const totalCustomerCount = await Customer.countDocuments({
      name: { $ne: 'SUCURSAL' },
    });
    const totalProductCount = await Product.countDocuments({
      published: { $ne: 'false' },
    });
    const orderCountPreviousMonth = await getDocumentCountPreviousMonth(Order);

    orders = JSON.stringify(orders);
    clients = JSON.stringify(clients);
    dailyOrders = JSON.stringify(dailyOrders);
    affiliates = JSON.stringify(affiliates);
    products = JSON.stringify(products);
    posts = JSON.stringify(posts);
    thisWeeksOrder = JSON.stringify(thisWeeksOrder);
    const thisWeekOrderTotals = totalOrdersThisWeek[0]?.total;
    dailyOrdersTotals = dailyOrdersTotals[0]?.total;
    yesterdaysOrdersTotals = yesterdaysOrdersTotals[0]?.total;
    monthlyOrdersTotals = monthlyOrdersTotals[0]?.total;
    yearlyOrdersTotals = yearlyOrdersTotals[0]?.total;
    return {
      orders: orders,
      clients: clients,
      posts: posts,
      affiliates: affiliates,
      dailyOrders: dailyOrders,
      dailyOrdersTotals: dailyOrdersTotals,
      yesterdaysOrdersTotals: yesterdaysOrdersTotals,
      thisWeeksOrder: thisWeeksOrder,
      products: products,
      totalOrderCount: totalOrderCount,
      totalCustomerCount: totalCustomerCount,
      orderCountPreviousMonth: orderCountPreviousMonth,
      totalProductCount: totalProductCount,
      thisWeekOrderTotals: thisWeekOrderTotals,
      monthlyOrdersTotals: monthlyOrdersTotals,
      yearlyOrdersTotals: yearlyOrdersTotals,
      totalPostCount: totalPostCount,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getPOSDashboard() {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let orders;
    let todaysOrders;
    let products;
    let thisWeeksOrder;
    let totalOrdersThisWeek;
    let dailyOrders;
    let dailyOrdersTotals;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight

    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - today.getDay());
    startOfCurrentWeek.setHours(0, 0, 0, 0); // Set time to midnight

    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0
    );

    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      0,
      0
    );

    if (session) {
      if (session?.user?.role === 'sucursal') {
        orders = await Order.find({ orderStatus: { $ne: 'Cancelado' } })
          .sort({ createdAt: -1 }) // Sort in descending order of creation date
          .limit(5);

        dailyOrders = await Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfToday,
                $lt: endOfToday,
              },
            },
          },
          {
            $unwind: '$orderItems',
          },
          {
            $group: {
              _id: {
                orderStatus: '$orderStatus',
                orderId: '$orderId',
                _id: '$_id',
              },
              total: { $sum: '$orderItems.price' },
            },
          },
          {
            $project: {
              _id: '$_id._id',
              total: 1,
              orderStatus: '$_id.orderStatus',
              orderId: '$_id.orderId',
            },
          },
        ]);
        dailyOrdersTotals = await Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfToday,
                $lt: endOfToday,
              },
            },
          },
          {
            $unwind: '$orderItems',
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$orderItems.price' },
            },
          },
        ]);

        thisWeeksOrder = await Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfCurrentWeek,
                $lt: today,
              },
            },
          },
          {
            $unwind: '$orderItems', // Deconstruct the orderItems array
          },
          {
            $group: {
              _id: {
                orderStatus: '$orderStatus',
                orderId: '$orderId', // Include orderId in the _id
                _id: '$_id', // Include _id in the _id
              },
              total: { $sum: '$orderItems.price' }, // Calculate the total sum of prices
            },
          },
          {
            $project: {
              _id: '$_id._id', // Project the _id from _id
              total: 1,
              orderStatus: '$_id.orderStatus',
              orderId: '$_id.orderId', // Project orderId
            },
          },
        ]);
        totalOrdersThisWeek = await Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfCurrentWeek,
                $lt: today,
              },
            },
          },
          {
            $unwind: '$orderItems', // Deconstruct the orderItems array
          },
          {
            $group: {
              _id: null, // Group all documents without any specific criteria
              total: { $sum: '$orderItems.price' }, // Calculate the total sum of prices
            },
          },
        ]);

        products = await Product.find({ published: { $ne: 'false' } })
          .sort({ createdAt: -1 }) // Sort in descending order of creation date
          .limit(5);
      }
    }

    const totalOrderCount = await Order.countDocuments({
      orderStatus: { $ne: 'Cancelado' },
    });
    const totalProductCount = await Product.countDocuments({
      published: { $ne: 'false' },
    });
    const orderCountPreviousMonth = await getDocumentCountPreviousMonth(Order);

    orders = JSON.stringify(orders);
    dailyOrders = JSON.stringify(dailyOrders);

    products = JSON.stringify(products);
    thisWeeksOrder = JSON.stringify(thisWeeksOrder);
    const thisWeekOrderTotals = totalOrdersThisWeek[0]?.total;
    dailyOrdersTotals = dailyOrdersTotals[0]?.total;
    return {
      orders: orders,
      dailyOrders: dailyOrders,
      dailyOrdersTotals: dailyOrdersTotals,
      thisWeeksOrder: thisWeeksOrder,
      products: products,
      totalOrderCount: totalOrderCount,
      orderCountPreviousMonth: orderCountPreviousMonth,
      totalProductCount: totalProductCount,
      thisWeekOrderTotals: thisWeekOrderTotals,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getInstagramDashboard() {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let orders;
    let todaysOrders;
    let products;
    let thisWeeksOrder;
    let totalOrdersThisWeek;
    let dailyOrders;
    let dailyOrdersTotals;
    const today = new Date();
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(
      startOfCurrentWeek.getDate() - startOfCurrentWeek.getDay()
    );
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    if (session) {
      if (session?.user?.role === 'sucursal') {
        orders = await Order.find({ orderStatus: { $ne: 'Cancelado' } })
          .sort({ createdAt: -1 }) // Sort in descending order of creation date
          .limit(5);

        dailyOrders = await Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfToday,
                $lt: endOfToday,
              },
            },
          },
          {
            $unwind: '$orderItems',
          },
          {
            $group: {
              _id: {
                orderStatus: '$orderStatus',
                orderId: '$orderId',
                _id: '$_id',
              },
              total: { $sum: '$orderItems.price' },
            },
          },
          {
            $project: {
              _id: '$_id._id',
              total: 1,
              orderStatus: '$_id.orderStatus',
              orderId: '$_id.orderId',
            },
          },
        ]);
        dailyOrdersTotals = await Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfToday,
                $lt: endOfToday,
              },
            },
          },
          {
            $unwind: '$orderItems',
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$orderItems.price' },
            },
          },
        ]);

        thisWeeksOrder = await Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfCurrentWeek,
                $lt: today,
              },
            },
          },
          {
            $unwind: '$orderItems', // Deconstruct the orderItems array
          },
          {
            $group: {
              _id: {
                orderStatus: '$orderStatus',
                orderId: '$orderId', // Include orderId in the _id
                _id: '$_id', // Include _id in the _id
              },
              total: { $sum: '$orderItems.price' }, // Calculate the total sum of prices
            },
          },
          {
            $project: {
              _id: '$_id._id', // Project the _id from _id
              total: 1,
              orderStatus: '$_id.orderStatus',
              orderId: '$_id.orderId', // Project orderId
            },
          },
        ]);
        totalOrdersThisWeek = await Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfCurrentWeek,
                $lt: today,
              },
            },
          },
          {
            $unwind: '$orderItems', // Deconstruct the orderItems array
          },
          {
            $group: {
              _id: null, // Group all documents without any specific criteria
              total: { $sum: '$orderItems.price' }, // Calculate the total sum of prices
            },
          },
        ]);

        products = await Product.find({ published: { $ne: 'false' } })
          .sort({ createdAt: -1 }) // Sort in descending order of creation date
          .limit(5);
      }
    }

    const totalOrderCount = await Order.countDocuments({
      orderStatus: { $ne: 'Cancelado' },
    });
    const totalProductCount = await Product.countDocuments({
      published: { $ne: 'false' },
    });
    const orderCountPreviousMonth = await getDocumentCountPreviousMonth(Order);

    orders = JSON.stringify(orders);
    dailyOrders = JSON.stringify(dailyOrders);

    products = JSON.stringify(products);
    thisWeeksOrder = JSON.stringify(thisWeeksOrder);
    const thisWeekOrderTotals = totalOrdersThisWeek[0]?.total;
    dailyOrdersTotals = dailyOrdersTotals[0]?.total;
    return {
      orders: orders,
      dailyOrders: dailyOrders,
      dailyOrdersTotals: dailyOrdersTotals,
      thisWeeksOrder: thisWeeksOrder,
      products: products,
      totalOrderCount: totalOrderCount,
      orderCountPreviousMonth: orderCountPreviousMonth,
      totalProductCount: totalProductCount,
      thisWeekOrderTotals: thisWeekOrderTotals,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getOnePost(slug) {
  try {
    await dbConnect();

    let post = await Post.findOne({ slug: slug });
    const postCategory = post.category;
    // Find products matching any of the tag values
    let trendingProducts = await Product.find({
      'tags.value': postCategory,
    }).limit(4);

    // convert to string
    post = JSON.stringify(post);
    trendingProducts = JSON.stringify(trendingProducts);

    return { post: post, trendingProducts: trendingProducts };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getOnePage(category) {
  try {
    await dbConnect();
    let page = await Page.findOne({ category: category });
    // convert to string
    page = JSON.stringify(page);

    return { page: page };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function addNewPage(data) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };
  let {
    category,
    preTitle,
    mainTitle,
    subTitle,
    mainImage,
    sections,
    createdAt,
  } = Object.fromEntries(data);

  sections = JSON.parse(sections);
  createdAt = new Date(createdAt);
  // validate form data
  const result = PageEntrySchema.safeParse({
    mainTitle: mainTitle,
    mainImage: mainImage,
    createdAt: createdAt,
  });
  const { error: zodError } = result;
  if (zodError) {
    return { error: zodError.format() };
  }

  //check for errors
  await dbConnect();
  const slug = generateUrlSafeTitle(mainTitle);

  const slugExists = await Page.findOne({ slug: slug });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ['Este Titulo de Pagina ya esta en uso'] },
      },
    };
  }
  const { error } = await Page.create({
    category,
    preTitle,
    mainTitle,
    subTitle,
    slug,
    mainImage,
    sections,
    createdAt,
    published: true,
    authorId: { _id: session?.user._id },
  });
  if (error) throw Error(error);
  revalidatePath('/');
}

export async function updatePage(data) {
  const session = await getServerSession(options);
  let {
    _id,
    category,
    preTitle,
    mainTitle,
    subTitle,
    mainImage,
    sections,
    createdAt,
  } = Object.fromEntries(data);
  sections = JSON.parse(sections);
  const updatedAt = new Date(createdAt);
  // validate form data
  const result = PageUpdateSchema.safeParse({
    category: category,
    mainTitle: mainTitle,
    mainImage: mainImage,
    updatedAt: updatedAt,
  });
  const { error: zodError } = result;
  if (zodError) {
    return { error: zodError.format() };
  }

  //check for errors
  await dbConnect();
  const slug = generateUrlSafeTitle(mainTitle);
  const slugExists = await Page.findOne({
    slug: slug,
    _id: { $ne: _id },
  });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ['Este Titulo de Pagina ya esta en uso'] },
      },
    };
  }
  const { error } = await Page.updateOne(
    { _id },
    {
      category,
      preTitle,
      mainTitle,
      subTitle,
      slug,
      mainImage,
      sections,
      updatedAt,
      published: true,
      authorId: { _id: session?.user._id },
    }
  );
  if (error) throw Error(error);
  revalidatePath('/');
}

export async function getAllPost(searchQuery) {
  const session = await getServerSession(options);

  try {
    await dbConnect();
    let postQuery;
    if (session) {
      if (session?.user?.role === 'manager') {
        postQuery = Post.find({});
      } else {
        postQuery = Post.find({ published: true });
      }
    } else {
      postQuery = Post.find({ published: true });
    }

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = 10;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get('page')) || 1;
    // total number of documents in database
    const itemCount = await Post.countDocuments();
    // Extract all possible categories
    const allCategories = await Post.distinct('category');

    // Apply search Filters
    const apiPostFilters = new APIPostsFilters(postQuery, searchParams)
      .searchAllFields()
      .filter();

    let postsData = await apiPostFilters.query;

    const filteredPostsCount = postsData.length;

    // Pagination filter
    apiPostFilters.pagination(resPerPage, page);
    postsData = await apiPostFilters.query.clone();

    let sortedPosts = postsData
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    sortedPosts = JSON.stringify(sortedPosts);
    return {
      posts: sortedPosts,
      itemCount: itemCount,
      filteredPostsCount: filteredPostsCount,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getOneOrder(id) {
  try {
    await dbConnect();

    let order = await Order.findOne({ _id: id });
    let deliveryAddress = await Address.findOne(order.shippingInfo);
    let orderPayments = await Payment.find({ order: order._id });
    let customer = await Customer.findOne({ email: order.email });

    // convert to string
    order = JSON.stringify(order);
    deliveryAddress = JSON.stringify(deliveryAddress);
    orderPayments = JSON.stringify(orderPayments);
    customer = JSON.stringify(customer);

    return {
      order: order,
      customer: customer,
      deliveryAddress: deliveryAddress,
      orderPayments: orderPayments,
    };
    // return { product };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllOrder(searchQuery) {
  try {
    await dbConnect();
    // Enable profiling for all database operations (level 2)

    const session = await getServerSession(options);
    let orderQuery;
    if (
      session?.user?.role === 'manager' ||
      session?.user?.role === 'sucursal'
    ) {
      orderQuery = Order.find({ orderStatus: { $ne: 'Cancelado' } }).populate(
        'user'
      );
    } else if (session?.user?.role === 'afiliado') {
      const affiliate = await Affiliate.findOne({ user: session?.user?._id });
      orderQuery = Order.find({
        affiliateId: affiliate?._id.toString(),
        orderStatus: { $ne: 'Cancelado' },
      }).populate('user');
    } else {
      orderQuery = Order.find({
        user: session?.user?._id,
        orderStatus: { $ne: 'Cancelado' },
      }).populate('user');
    }

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get('perpage')) || 10;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get('page')) || 1;
    // Apply descending order based on a specific field (e.g., createdAt)
    orderQuery = orderQuery.sort({ createdAt: -1 });
    const totalOrderCount = await Order.countDocuments();

    // Apply search Filters including order_id and orderStatus
    const apiOrderFilters = new APIOrderFilters(
      orderQuery,
      searchParams
    ).searchAllFields();

    let ordersData = await apiOrderFilters.query;

    const itemCount = ordersData.length;
    apiOrderFilters.pagination(resPerPage, page);
    ordersData = await apiOrderFilters.query.clone();

    let orders = JSON.stringify(ordersData);

    return {
      orders: orders,
      totalOrderCount: totalOrderCount,
      itemCount: itemCount,
      resPerPage: resPerPage,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function updateOneOrder(data) {
  try {
    let { transactionNo, paidOn, note, amount, orderId } =
      Object.fromEntries(data);
    let newOrderStatus;
    let newOrderPaymentStatus;
    // Define the model name with the suffix appended with the lottery ID
    await dbConnect();
    // Retrieve the dynamically created Ticket model
    const order = await Order.findOne({ _id: orderId });
    // Calculate total amount based on items
    const date = cstDateTime();
    const orderTotal = await getTotalFromItems(order?.orderItems);
    if (order.paymentInfo.amountPaid + Number(amount) >= orderTotal) {
      newOrderStatus = 'Entregado';
      newOrderPaymentStatus = 'Pagado';
    } else {
      newOrderStatus = 'Apartado';
      newOrderPaymentStatus = 'Pendiente';
    }

    let payMethod;
    if (transactionNo === 'EFECTIVO') {
      payMethod = 'EFECTIVO';
    } else if (!isNaN(transactionNo)) {
      payMethod = 'TERMINAL';
    }
    const updatedOrder = await Order.updateOne(
      { _id: orderId },
      {
        orderStatus: newOrderStatus,
        'paymentInfo.status': newOrderPaymentStatus,
        $inc: { 'paymentInfo.amountPaid': Number(amount) },
      }
    );

    const lastOrder = await Order.findById(orderId);

    let paymentTransactionData = {
      type: 'sucursal',
      paymentIntent: '',
      amount: amount,
      comment: note,
      reference: transactionNo,
      pay_date: date,
      method: payMethod,
      order: lastOrder?._id,
      user: lastOrder?.user,
    };

    try {
      const newPaymentTransaction = await new Payment(paymentTransactionData);

      await newPaymentTransaction.save();
    } catch (error) {
      console.log('dBberror', error);
    }
    revalidatePath(`/admin/pedidos`);
    revalidatePath(`/admin/pedido/${lastOrder?._id}`);
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function changeOrderNoteStatus(data) {
  try {
    let { orderId, note, orderStatus } = Object.fromEntries(data);
    const newStatus = orderStatus;
    const newNote = note;
    await dbConnect();
    const date = cstDateTime();

    const updateOrder = await Order.updateOne(
      { _id: orderId },
      {
        orderStatus: newStatus,
        comment: newNote,
        updatedAt: date,
      }
    );
    revalidatePath(`/admin/pedidos`);
    revalidatePath(`/admin/pedido/${orderId}`);
    return {
      ok: true,
    };
  } catch (error) {
    throw Error(error);
  }
}

export async function getAllPOSOrder(searchQuery) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let orderQuery;
    if (session?.user?.role === 'sucursal') {
      orderQuery = Order.find({
        $and: [{ branch: 'Sucursal' }, { orderStatus: { $ne: 'Cancelado' } }],
      }).populate('user');
    }

    const searchParams = new URLSearchParams(searchQuery);

    const resPerPage = Number(searchParams.get('perpage')) || 10;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get('page')) || 1;
    // Apply descending order based on a specific field (e.g., createdAt)
    orderQuery = orderQuery.sort({ createdAt: -1 });

    // Apply search Filters including order_id and orderStatus
    const apiOrderFilters = new APIOrderFilters(orderQuery, searchParams)
      .searchAllFields()
      .filter();
    let ordersData = await apiOrderFilters.query;

    const itemCount = ordersData.length;

    apiOrderFilters.pagination(resPerPage, page);
    ordersData = await apiOrderFilters.query.clone();
    let orders = JSON.stringify(ordersData);

    return {
      orders: orders,
      itemCount: itemCount,
      resPerPage: resPerPage,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getOneProduct(slug, id) {
  try {
    await dbConnect();
    let product;
    if (id) {
      product = await Product.findOne({ _id: id });
    } else {
      product = await Product.findOne({ slug: slug });
    }

    // convert to string
    product = JSON.stringify(product);
    return { product: product };
    // return { product };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getOneProductWithTrending(slug, id) {
  try {
    await dbConnect();
    let product;
    if (id) {
      product = await Product.findOne({ _id: id });
    } else {
      product = await Product.findOne({ slug: slug });
    }
    let trendingProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);
    // convert to string
    product = JSON.stringify(product);
    trendingProducts = JSON.stringify(trendingProducts);
    return { product: product, trendingProducts: trendingProducts };
    // return { product };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getHomeProductsData() {
  try {
    await dbConnect();
    // Extract tag values from post.tags array
    let trendingProducts = await Product.find({}).limit(100);
    let editorsProducts = await Product.find({}).limit(10);

    trendingProducts = JSON.stringify(trendingProducts);
    editorsProducts = JSON.stringify(editorsProducts);
    return {
      trendingProducts: trendingProducts,
      editorsProducts: editorsProducts,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function updateProductQuantity(variationId) {
  try {
    await dbConnect();
    // Find the product that contains the variation with the specified variation ID
    let product = await Product.findOne({ 'variations._id': variationId });

    if (product) {
      // Find the variation within the variations array
      let variation = product.variations.find(
        (variation) => variation._id.toString() === variationId
      );
      // Update the stock of the variation
      variation.stock -= 1; // Example stock update
      // Save the product to persist the changes
      await product.save();
    } else {
      console.log('Product not found');
      throw Error('Product not found');
    }
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function changeProductStatus(productId) {
  try {
    await dbConnect();
    // Find the product that contains the variation with the specified variation ID
    let product = await Product.findOne({ _id: productId });

    if (product.active === true) {
      product.active = false; // Deactivate Product
    } else {
      product.active = true; // ReActivate Product
    }
    // Save the product to persist the changes
    await product.save();
    revalidatePath('/admin/productos');
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function deleteOneProduct(productId) {
  try {
    await dbConnect();
    // Find the product that contains the variation with the specified variation ID
    await Product.findOneAndDelete({ _id: productId });

    revalidatePath('/admin/productos');
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function changeProductAvailability(productId, location) {
  try {
    await dbConnect();
    // Find the product that contains the variation with the specified variation ID
    let product = await Product.findOne({ _id: productId });
    if (location === 'Instagram') {
      if (product.availability.instagram === true) {
        product.availability.instagram = false; // Remove from physical branch
      } else {
        product.availability.instagram = true; // Add to physical branch
      }
    } else if (location === 'Branch') {
      if (product.availability.branch === true) {
        product.availability.branch = false; // Remove from physical branch
      } else {
        product.availability.branch = true; // Add to physical branch
      }
    } else if (location === 'Online') {
      if (product.availability.online === true) {
        product.availability.online = false; // Remove from physical branch
      } else {
        product.availability.online = true; // Add to physical branch
      }
    }
    // Save the product to persist the changes
    await product.save();
    revalidatePath('/admin/productos');
    revalidatePath('/admin/pos/tienda');
    revalidatePath('/puntodeventa/tienda');
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getVariationStock(variationId) {
  try {
    await dbConnect();
    // Find the product that contains the variation with the specified variation ID
    let product = await Product.findOne({ 'variations._id': variationId });

    if (product) {
      // Find the variation within the variations array
      let variation = product.variations.find(
        (variation) => variation._id.toString() === variationId
      );
      return { currentStock: variation.stock };
    } else {
      throw Error('Product not found');
    }
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getOnePOSProduct(variationId) {
  try {
    await dbConnect();
    // Find the product that contains the variation with the specified variation ID
    let product = await Product.findOne({ 'variations._id': variationId });

    if (product) {
      // Find the variation within the variations array
      let variation = product.variations.find(
        (variation) => variation._id.toString() === variationId
      );

      // Add product name and brand to the variation
      let { title, brand } = product;
      variation = {
        ...variation.toObject(), // Convert Mongoose document to plain object
        title: title,
        brand: brand,
      };

      // convert to string
      product = JSON.stringify(product);
      variation = JSON.stringify(variation);
      return { product: product, variation: variation };
    } else {
      throw Error('Product not found');
    }
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllPOSProductOld(searchQuery) {
  try {
    await dbConnect();
    let productQuery;
    // Find the product that contains the variation with the specified variation ID
    productQuery = Product.find({
      $and: [{ stock: { $gt: 0 } }, { 'availability.branch': true }],
    });

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get('perpage')) || 10;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get('page')) || 1;
    // total number of documents in database
    const productsCount = await Product.countDocuments();
    // Apply search Filters
    const apiProductFilters = new APIFilters(productQuery, searchParams)
      .searchAllFields()
      .filter();

    let productsData = await apiProductFilters.query;

    const filteredProductsCount = productsData.length;

    apiProductFilters.pagination(resPerPage, page);
    productsData = await apiProductFilters.query.clone();

    // descending order
    let sortedProducts = productsData
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    sortedProducts = JSON.stringify(sortedProducts);
    return {
      products: sortedProducts,
      productsCount: productsCount,
      filteredProductsCount: filteredProductsCount,
      resPerPage: resPerPage,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllPOSProduct(searchQuery) {
  try {
    await dbConnect();
    // Find the product that contains the variation with the specified variation ID
    let productQuery = Product.find({
      $and: [{ stock: { $gt: 0 } }, { 'availability.branch': true }],
    });
    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get('perpage')) || 10;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get('page')) || 1;
    productQuery = productQuery.sort({ createdAt: -1 });
    // total number of documents in database
    const productsCount = await Product.countDocuments();
    // Apply search Filters
    const apiProductFilters = new APIFilters(productQuery, searchParams)
      .searchAllFields()
      .filter();

    let productsData = await apiProductFilters.query;

    const filteredProductsCount = productsData.length;

    apiProductFilters.pagination(resPerPage, page);
    productsData = await apiProductFilters.query.clone();
    let products = JSON.stringify(productsData);
    revalidatePath('/admin/pos/productos/');
    return {
      products: products,
      filteredProductsCount: filteredProductsCount,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllPOSProductNoFilter(searchQuery) {
  try {
    await dbConnect();
    // Find the product that contains the variation with the specified variation ID
    let productsData = await Product.find({
      $and: [{ stock: { $gt: 0 } }, { 'availability.branch': true }],
    });

    const filteredProductsCount = productsData.length;
    let products = JSON.stringify(productsData);

    return {
      products: products,
      filteredProductsCount: filteredProductsCount,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllProduct(searchQuery) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let productQuery;
    if (session) {
      if (
        session?.user?.role === 'manager' ||
        session?.user?.role === 'sucursal'
      ) {
        productQuery = Product.find();
      }
    } else {
      productQuery = Product.find({ published: true });
    }

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get('perpage')) || 10;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get('page')) || 1;
    productQuery = productQuery.sort({ createdAt: -1 });
    // total number of documents in database
    const productsCount = await Product.countDocuments();
    // Extract all possible categories
    let allCategories = await Product.distinct('category');
    // Extract all possible categories
    let allBrands = await Product.distinct('brand');
    // Apply search Filters
    const apiProductFilters = new APIFilters(productQuery, searchParams)
      .searchAllFields()
      .filter();

    let productsData = await apiProductFilters.query;

    const filteredProductsCount = productsData.length;

    apiProductFilters.pagination(resPerPage, page);
    productsData = await apiProductFilters.query.clone();
    let sortedProducts = JSON.stringify(productsData);
    allCategories = JSON.stringify(allCategories);
    allBrands = JSON.stringify(allBrands);
    revalidatePath('/admin/productos/');
    return {
      products: sortedProducts,
      productsCount: productsCount,
      filteredProductsCount: filteredProductsCount,
      allCategories: allCategories,
      allBrands: allBrands,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllUserOrder(searchQuery, id) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let orderQuery;

    orderQuery = Order.find({
      user: id,
      orderStatus: { $ne: 'Cancelado' },
    });
    let client = await User.findOne({ _id: id });

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get('perpage')) || 10;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get('page')) || 1;
    // Apply descending order based on a specific field (e.g., createdAt)
    orderQuery = orderQuery.sort({ createdAt: -1 });
    const totalOrderCount = await Order.countDocuments();

    // Apply search Filters including order_id and orderStatus
    const apiOrderFilters = new APIOrderFilters(orderQuery, searchParams)
      .searchAllFields()
      .filter();
    let ordersData = await apiOrderFilters.query;

    const itemCount = ordersData.length;
    apiOrderFilters.pagination(resPerPage, page);
    ordersData = await apiOrderFilters.query.clone();

    let orders = JSON.stringify(ordersData);
    client = JSON.stringify(client);

    return {
      orders: orders,
      client: client,
      totalOrderCount: totalOrderCount,
      itemCount: itemCount,
      resPerPage: resPerPage,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllCustomerOrders(searchQuery, id) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let orderQuery;

    orderQuery = Order.find({
      customer: id,
      orderStatus: { $ne: 'Cancelado' },
    });
    let client = await Customer.findOne({ _id: id });

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get('perpage')) || 10;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get('page')) || 1;
    // Apply descending order based on a specific field (e.g., createdAt)
    orderQuery = orderQuery.sort({ createdAt: -1 });
    const totalOrderCount = await Order.countDocuments();

    // Apply search Filters including order_id and orderStatus
    const apiOrderFilters = new APIOrderFilters(orderQuery, searchParams)
      .searchAllFields()
      .filter();
    let ordersData = await apiOrderFilters.query;

    const itemCount = ordersData.length;
    apiOrderFilters.pagination(resPerPage, page);
    ordersData = await apiOrderFilters.query.clone();

    let orders = JSON.stringify(ordersData);
    client = JSON.stringify(client);

    return {
      orders: orders,
      client: client,
      totalOrderCount: totalOrderCount,
      itemCount: itemCount,
      resPerPage: resPerPage,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllClient(searchQuery) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let clientQuery;

    if (session) {
      if (
        session?.user?.role === 'manager' ||
        session?.user?.role === 'sucursal'
      ) {
        clientQuery = User.find({ role: 'cliente' });
      }
    }

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get('perpage')) || 5;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get('page')) || 1;
    // total number of documents in database
    const clientsCount = await User.countDocuments();
    // Extract all possible categories
    // Apply search Filters
    const apiClientFilters = new APIClientFilters(clientQuery, searchParams)
      .searchAllFields()
      .filter();

    let clientsData = await apiClientFilters.query;

    const filteredClientsCount = clientsData.length;

    apiClientFilters.pagination(resPerPage, page);
    clientsData = await apiClientFilters.query.clone();

    let sortedClients = clientsData
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    let clients = JSON.stringify(sortedClients);

    return {
      clients: clients,
      clientsCount: clientsCount,
      filteredClientsCount: filteredClientsCount,
      resPerPage: resPerPage,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function changeClientStatus(_id) {
  try {
    await dbConnect();
    const client = await User.findOne({ _id: _id });
    if (client && client.active === false) {
      client.active = true;
    } else {
      client.active = false;
    }
    client.save();
    revalidatePath('/admin/clientes');
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function updateClient(data) {
  let { _id, name, phone, email, updatedAt } = Object.fromEntries(data);

  updatedAt = new Date(updatedAt);

  try {
    // validate form data
    const result = ClientUpdateSchema.safeParse({
      name: name,
      phone: phone,
      email: email,
      updatedAt: updatedAt,
    });

    //check for errors
    const { error: zodError } = result;
    if (zodError) {
      return { error: zodError.format() };
    }

    await dbConnect();
    let CustomZodError;
    const client = await User.findOne({ _id: _id });

    if (client?.email != email) {
      const emailExist = await User.find({ email: email });
      if (emailExist) {
        CustomZodError = {
          _errors: [],
          email: { _errors: ['El email ya esta en uso'] },
        };
        return { error: CustomZodError };
      }
    }

    if (client?.phone != phone) {
      const phoneExist = await User.find({ phone: phone });
      if (phoneExist.length > 0) {
        CustomZodError = {
          _errors: [],
          phone: { _errors: ['El teléfono ya esta en uso'] },
        };
        console.log({ error: CustomZodError });
        return { error: CustomZodError };
      }
    }

    client.name = name;
    client.phone = phone;
    client.email = email;
    client.updatedAt = updatedAt;
    // client.avatar = avatar;
    client.save();
    revalidatePath('/perfil/actualizar');
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function updateClientPassword(data) {
  let { _id, newPassword, currentPassword, updatedAt } =
    Object.fromEntries(data);

  updatedAt = new Date(updatedAt);

  try {
    // validate form data
    const result = ClientPasswordUpdateSchema.safeParse({
      newPassword: newPassword,
      currentPassword: currentPassword,
      updatedAt: updatedAt,
    });

    //check for errors
    const { error: zodError } = result;
    if (zodError) {
      return { error: zodError.format() };
    }

    await dbConnect();
    let CustomZodError;
    let hashedPassword;
    const client = await User.findOne({ _id: _id }).select('+password');
    const comparePass = await bcrypt.compare(currentPassword, client.password);
    if (!comparePass) {
      CustomZodError = {
        _errors: [],
        currentPassword: {
          _errors: ['La contraseña actual no es la correcta'],
        },
      };
      return { error: CustomZodError };
    } else {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    client.password = hashedPassword;
    client.updatedAt = updatedAt;
    client.save();
    revalidatePath('/perfil/actualizar_contrasena');
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllAffiliate(searchQuery) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let affiliateQuery;

    if (session) {
      if (session?.user?.role === 'manager') {
        affiliateQuery = Affiliate.find({});
      }
    }

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get('perpage')) || 5;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get('page')) || 1;
    // total number of documents in database
    const affiliatesCount = await Affiliate.countDocuments();
    // Extract all possible categories
    // Apply search Filters
    const apiAffiliateFilters = new APIAffiliateFilters(
      affiliateQuery,
      searchParams
    )
      .searchAllFields()
      .filter();

    let affiliatesData = await apiAffiliateFilters.query;

    const filteredAffiliatesCount = affiliatesData.length;

    apiAffiliateFilters.pagination(resPerPage, page);
    affiliatesData = await apiAffiliateFilters.query.clone();

    let sortedAffiliates = affiliatesData
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    let affiliates = JSON.stringify(sortedAffiliates);

    return {
      affiliates: affiliates,
      affiliatesCount: affiliatesCount,
      filteredAffiliatesCount: filteredAffiliatesCount,
      resPerPage: resPerPage,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllAffiliateOrder(searchQuery, id) {
  const session = await getServerSession(options);

  try {
    await dbConnect();
    const session = await getServerSession(options);
    let orderQuery;
    let affiliate;
    if (session) {
      orderQuery = Order.find({
        affiliateId: id,
        orderStatus: { $ne: 'Cancelado' },
      });
      affiliate = await Affiliate.findOne({ _id: id });
    }

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get('perpage')) || 5;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get('page')) || 1;
    // Apply descending order based on a specific field (e.g., createdAt)
    orderQuery = orderQuery.sort({ createdAt: -1 });
    const totalOrderCount = await Order.countDocuments();

    // Apply search Filters including order_id and orderStatus
    const apiOrderFilters = new APIOrderFilters(orderQuery, searchParams)
      .searchAllFields()
      .filter();
    let ordersData = await apiOrderFilters.query;

    const itemCount = ordersData.length;
    apiOrderFilters.pagination(resPerPage, page);
    ordersData = await apiOrderFilters.query.clone();

    let orders = JSON.stringify(ordersData);
    affiliate = JSON.stringify(affiliate);

    return {
      orders: orders,
      affiliate: affiliate,
      totalOrderCount: totalOrderCount,
      itemCount: itemCount,
      resPerPage: resPerPage,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function updateAffiliate(_id) {
  //check for errors
  await dbConnect();
  try {
    const affiliate = await Affiliate.findOne({ _id: _id });
    if (affiliate && affiliate.isActive === false) {
      affiliate.isActive = true;
    } else {
      affiliate.isActive = false;
    }
    affiliate.save();
    revalidatePath('/admin/clientes');
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function addAddress(data) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };
  const { street, city, province, zip_code, country, phone } =
    Object.fromEntries(data);

  // validate form data

  const { error: zodError } = AddressEntrySchema.safeParse({
    street,
    city,
    province,
    zip_code,
    country,
    phone,
  });
  if (zodError) {
    return { error: zodError.format() };
  }
  //check for errors
  await dbConnect();
  const { error } = await Address.create({
    street,
    city,
    province,
    zip_code,
    country,
    phone,
    user,
  });
  if (error) throw Error(error);
  revalidatePath('/perfil/direcciones');
  revalidatePath('/carrito/envio');
}

export async function deleteAddress(id) {
  //check for errors
  try {
    await dbConnect();
    const deleteAddress = await Address.findByIdAndDelete(id);
    revalidatePath('/perfil/direcciones');
    revalidatePath('/carrito/envio');
  } catch (error) {
    if (error) throw Error(error);
  }
}

export async function addNewPost(data) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };
  let {
    category,
    mainTitle,
    mainImage,
    sectionTwoTitle,
    sectionTwoParagraphOne,
    sectionTwoParagraphTwo,
    sectionThreeTitle,
    sectionThreeParagraphOne,
    sectionThreeImage,
    sectionThreeParagraphFooter,
    sectionFourTitle,
    sectionFourOptionOne,
    sectionFourOptionTwo,
    sectionFourOptionThree,
    sectionFourParagraphOne,
    sectionFourImage,
    sectionFourParagraphFooter,
    sectionFiveTitle,
    sectionFiveImage,
    sectionFiveParagraphOne,
    sectionFiveParagraphTwo,
    sectionSixColOneTitle,
    sectionSixColOneParagraph,
    sectionSixColOneImage,
    sectionSixColTwoTitle,
    sectionSixColTwoParagraph,
    sectionSixColTwoImage,
    sectionSixColThreeTitle,
    sectionSixColThreeParagraph,
    sectionSixColThreeImage,
    sectionSixColOneParagraphFooter,
    sectionSevenTitle,
    sectionSevenImage,
    sectionSevenParagraph,
    createdAt,
  } = Object.fromEntries(data);

  createdAt = new Date(createdAt);
  // validate form data
  const result = PostEntrySchema.safeParse({
    category: category,
    mainTitle: mainTitle,
    mainImage: mainImage,
    createdAt: createdAt,
  });
  const { error: zodError } = result;
  if (zodError) {
    return { error: zodError.format() };
  }

  //check for errors
  await dbConnect();
  const slug = generateUrlSafeTitle(mainTitle);

  const slugExists = await Post.findOne({ slug: slug });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ['Este Titulo de publicación ya esta en uso'] },
      },
    };
  }
  const { error } = await Post.create({
    category,
    mainTitle,
    slug,
    mainImage,
    sectionTwoTitle,
    sectionTwoParagraphOne,
    sectionTwoParagraphTwo,
    sectionThreeTitle,
    sectionThreeParagraphOne,
    sectionThreeImage,
    sectionThreeParagraphFooter,
    sectionFourTitle,
    sectionFourOptionOne,
    sectionFourOptionTwo,
    sectionFourOptionThree,
    sectionFourParagraphOne,
    sectionFourImage,
    sectionFourParagraphFooter,
    sectionFiveTitle,
    sectionFiveImage,
    sectionFiveParagraphOne,
    sectionFiveParagraphTwo,
    sectionSixColOneTitle,
    sectionSixColOneParagraph,
    sectionSixColOneImage,
    sectionSixColTwoTitle,
    sectionSixColTwoParagraph,
    sectionSixColTwoImage,
    sectionSixColThreeTitle,
    sectionSixColThreeParagraph,
    sectionSixColThreeImage,
    sectionSixColOneParagraphFooter,
    sectionSevenTitle,
    sectionSevenImage,
    sectionSevenParagraph,
    createdAt,
    published: true,
    authorId: { _id: session?.user._id },
  });
  if (error) throw Error(error);
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}

export async function updatePost(data) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };
  let {
    _id,
    category,
    mainTitle,
    mainImage,
    sectionTwoTitle,
    sectionTwoParagraphOne,
    sectionTwoParagraphTwo,
    sectionThreeTitle,
    sectionThreeParagraphOne,
    sectionThreeImage,
    sectionThreeParagraphFooter,
    sectionFourTitle,
    sectionFourOptionOne,
    sectionFourOptionTwo,
    sectionFourOptionThree,
    sectionFourParagraphOne,
    sectionFourImage,
    sectionFourParagraphFooter,
    sectionFiveTitle,
    sectionFiveImage,
    sectionFiveParagraphOne,
    sectionFiveParagraphTwo,
    sectionSixColOneTitle,
    sectionSixColOneParagraph,
    sectionSixColOneImage,
    sectionSixColTwoTitle,
    sectionSixColTwoParagraph,
    sectionSixColTwoImage,
    sectionSixColThreeTitle,
    sectionSixColThreeParagraph,
    sectionSixColThreeImage,
    sectionSixColOneParagraphFooter,
    sectionSevenTitle,
    sectionSevenImage,
    sectionSevenParagraph,
    updatedAt,
  } = Object.fromEntries(data);

  updatedAt = new Date(updatedAt);
  // validate form data
  const result = PostUpdateSchema.safeParse({
    category: category,
    mainTitle: mainTitle,
    mainImage: mainImage,
    updatedAt: updatedAt,
  });
  const { error: zodError } = result;
  if (zodError) {
    return { error: zodError.format() };
  }

  //check for errors
  await dbConnect();
  const slug = generateUrlSafeTitle(mainTitle);
  const slugExists = await Post.findOne({ slug: slug, _id: { $ne: _id } });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ['Este Titulo de publicación ya esta en uso'] },
      },
    };
  }
  const { error } = await Post.updateOne(
    { _id },
    {
      category,
      mainTitle,
      slug,
      mainImage,
      sectionTwoTitle,
      sectionTwoParagraphOne,
      sectionTwoParagraphTwo,
      sectionThreeTitle,
      sectionThreeParagraphOne,
      sectionThreeImage,
      sectionThreeParagraphFooter,
      sectionFourTitle,
      sectionFourOptionOne,
      sectionFourOptionTwo,
      sectionFourOptionThree,
      sectionFourParagraphOne,
      sectionFourImage,
      sectionFourParagraphFooter,
      sectionFiveTitle,
      sectionFiveImage,
      sectionFiveParagraphOne,
      sectionFiveParagraphTwo,
      sectionSixColOneTitle,
      sectionSixColOneParagraph,
      sectionSixColOneImage,
      sectionSixColTwoTitle,
      sectionSixColTwoParagraph,
      sectionSixColTwoImage,
      sectionSixColThreeTitle,
      sectionSixColThreeParagraph,
      sectionSixColThreeImage,
      sectionSixColOneParagraphFooter,
      sectionSevenTitle,
      sectionSevenImage,
      sectionSevenParagraph,
      updatedAt,
      published: true,
      authorId: { _id: session?.user._id },
    }
  );
  if (error) throw Error(error);
  revalidatePath('/admin/blog');
  revalidatePath('/blog/publicacion/');
  revalidatePath('/admin/blog/editor');
  revalidatePath('/blog');
}

export async function addVariationProduct(data) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };

  let {
    title,
    description,
    category,
    tags,
    featured,
    branchAvailability,
    instagramAvailability,
    onlineAvailability,
    mainImage,
    brand,
    gender,
    variations,
    salePrice,
    salePriceEndDate,
    createdAt,
  } = Object.fromEntries(data);
  // Parse variations JSON string with reviver function to convert numeric strings to numbers
  let colors = [];
  variations = JSON.parse(variations, (key, value) => {
    if (key === 'color') {
      const color = {
        value: value,
        label: value,
      };
      //check array of object to see if values exists
      const exists = colors.some((c) => c.value === value || c.label === value);
      if (!exists) {
        colors.push(color); // add to colors array
      }
    }
    // Check if the value is a string and represents a number
    if (!isNaN(value) && value !== '' && !Array.isArray(value)) {
      if (key != 'size') {
        return Number(value); // Convert the string to a number
      }
    }
    return value; // Return unchanged for other types of values
  });

  tags = JSON.parse(tags);
  const sale_price = Number(salePrice);
  const sale_price_end_date = salePriceEndDate;
  const images = [{ url: mainImage }];

  // calculate product stock
  const stock = variations.reduce(
    (total, variation) => total + variation.stock,
    0
  );
  createdAt = new Date(createdAt);

  // validate form data
  const result = VariationProductEntrySchema.safeParse({
    title: title,
    description: description,
    brand: brand,
    category: category,
    tags: tags,
    images: images,
    variations: variations,
    stock: stock,
    gender: gender,
    createdAt: createdAt,
  });

  //check for errors
  const { error: zodError } = result;
  if (zodError) {
    return { error: zodError.format() };
  }
  // Create a new Product in the database
  await dbConnect();
  const slug = generateUrlSafeTitle(title);

  const slugExists = await Product.findOne({ slug: slug });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ['Este Titulo de producto ya esta en uso'] },
      },
    };
  }
  const availability = {
    instagram: instagramAvailability,
    branch: branchAvailability,
    online: onlineAvailability,
  };

  const { error } = await Product.create({
    type: 'variation',
    title,
    slug,
    description,
    featured,
    availability,
    brand,
    gender,
    category,
    tags,
    images,
    colors,
    variations,
    stock,
    sale_price,
    sale_price_end_date,
    createdAt,
    user,
  });
  console.log(error);
  if (error) throw Error(error);
  revalidatePath('/admin/productos');
  revalidatePath('/tienda');
}

export async function updateVariationProduct(data) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };

  let {
    title,
    description,
    category,
    tags,
    featured,
    branchAvailability,
    instagramAvailability,
    onlineAvailability,
    mainImage,
    brand,
    gender,
    variations,
    salePrice,
    salePriceEndDate,
    updatedAt,
    _id,
  } = Object.fromEntries(data);
  // Parse variations JSON string with reviver function to convert numeric strings to numbers
  let colors = [];
  variations = JSON.parse(variations, (key, value) => {
    if (key === 'color') {
      const color = {
        value: value,
        label: value,
      };
      //check array of object to see if values exists
      const exists = colors.some((c) => c.value === value || c.label === value);
      if (!exists) {
        colors.push(color); // add to colors array
      }
    }
    // Check if the value is a string and represents a number
    if (!isNaN(value) && value !== '' && !Array.isArray(value)) {
      if (key != 'size') {
        return Number(value); // Convert the string to a number
      }
    }
    return value; // Return unchanged for other types of values
  });

  tags = JSON.parse(tags);
  const sale_price = Number(salePrice);
  const sale_price_end_date = salePriceEndDate;
  const images = [{ url: mainImage }];

  // calculate product stock
  const stock = variations.reduce(
    (total, variation) => total + variation.stock,
    0
  );
  updatedAt = new Date(updatedAt);
  // validate form data
  const result = VariationUpdateProductEntrySchema.safeParse({
    title: title,
    description: description,
    brand: brand,
    category: category,
    tags: tags,
    images: images,
    variations: variations,
    stock: stock,
    gender: gender,
    updatedAt: updatedAt,
  });

  //check for errors
  const { error: zodError } = result;
  if (zodError) {
    return { error: zodError.format() };
  }

  // Create a new Product in the database
  await dbConnect();

  const slug = generateUrlSafeTitle(title);
  const slugExists = await Product.findOne({ slug: slug, _id: { $ne: _id } });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ['Este Titulo de producto ya esta en uso'] },
      },
    };
  }
  const availability = {
    instagram: instagramAvailability,
    branch: branchAvailability,
    online: onlineAvailability,
  };

  const { error } = await Product.updateOne(
    { _id },
    {
      type: 'variation',
      title,
      slug,
      description,
      featured,
      availability,
      brand,
      gender,
      category,
      tags,
      images,
      colors,
      variations,
      stock,
      sale_price,
      sale_price_end_date,
      updatedAt,
      user,
    }
  );
  if (error) throw Error(error);
  revalidatePath('/admin/productos');
  revalidatePath('/tienda');
}

export async function updateRevalidateProduct() {
  revalidatePath('/admin/productos');
  revalidatePath('/tienda');
}

export async function addProduct(data) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };

  let {
    title,
    description,
    category,
    cost,
    price,
    sizes,
    tags,
    colors,
    featured,
    images,
    brand,
    gender,
    salePrice,
    salePriceEndDate,
    stock,
    createdAt,
  } = Object.fromEntries(data);
  // Parse images as JSON
  images = JSON.parse(images);
  sizes = JSON.parse(sizes);
  tags = JSON.parse(tags);
  colors = JSON.parse(colors);
  stock = Number(stock);
  cost = Number(cost);
  price = Number(price);
  const sale_price = Number(salePrice);
  const sale_price_end_date = salePriceEndDate;

  createdAt = new Date(createdAt);

  // validate form data
  const result = ProductEntrySchema.safeParse({
    title: title,
    description: description,
    brand: brand,
    category: category,
    colors: colors,
    sizes: sizes,
    tags: tags,
    images: images,
    gender: gender,
    stock: stock,
    price: price,
    cost: cost,
    createdAt: createdAt,
  });

  //check for errors
  const { error: zodError } = result;
  if (zodError) {
    return { error: zodError.format() };
  }
  // Create a new Product in the database
  await dbConnect();
  const slug = generateUrlSafeTitle(title);
  const slugExists = await Post.findOne({ slug: slug });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ['Este Titulo de producto ya esta en uso'] },
      },
    };
  }
  const { error } = await Product.create({
    type: 'simple',
    title,
    slug,
    description,
    featured,
    brand,
    gender,
    category,
    colors,
    sizes,
    tags,
    images,
    stock,
    price,
    sale_price,
    sale_price_end_date,
    cost,
    createdAt,
    user,
  });
  if (error) throw Error(error);
  revalidatePath('/admin/productos');
  revalidatePath('/tienda');
}

export async function resendEmail(data) {
  let { email, gReCaptchaToken } = Object.fromEntries(data);
  const secretKey = process?.env?.RECAPTCHA_SECRET_KEY;

  //check for errors
  const { error: zodError } = VerifyEmailSchema.safeParse({
    email,
  });
  if (zodError) {
    return { error: zodError.format() };
  }

  const formData = `secret=${secretKey}&response=${gReCaptchaToken}`;
  let res;
  try {
    res = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  } catch (e) {
    console.log('recaptcha error:', e);
  }

  if (res && res.data?.success && res.data?.score > 0.5) {
    // Save data to the database from here
    try {
      await dbConnect();
      const user = await User.findOne({ email: email });
      if (!user) {
        return { error: { email: { _errors: ['Email does not exist'] } } };
      }
      if (user?.isActive === true) {
        return { error: { email: { _errors: ['Email is already verified'] } } };
      }
      if (user?._id) {
        try {
          const subject = 'Confirmar email';
          const body = `Por favor da click en confirmar email para verificar tu cuenta.`;
          const title = 'Completar registro';
          const greeting = `Saludos ${user?.name}`;
          const action = 'CONFIRMAR EMAIL';
          const bestRegards = 'Gracias por unirte a nuestro sitio.';
          const recipient_email = email;
          const sender_email = 'contacto@shopout.com.mx';
          const fromName = 'Shopout Mx';

          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              user: process.env.GOOGLE_MAIL,
              pass: process.env.GOOGLE_MAIL_PASS_ONE,
            },
          });

          try {
            // Verify your transporter
            //await transporter.verify();

            const mailOptions = {
              from: `"${fromName}" ${sender_email}`,
              to: recipient_email,
              subject,
              html: `
        <!DOCTYPE html>
        <html lang="es">
        <body>
        <p>${greeting}</p>
        <p>${title}</p>
        <div>${body}</div>
        <a href="${process.env.NEXTAUTH_URL}/exito?token=${user?.verificationToken}">${action}</a>
        <p>${bestRegards}</p>
        </body>
        
        </html>
        
        `,
            };
            await transporter.sendMail(mailOptions);

            return {
              error: {
                success: {
                  _errors: [
                    'El correo se envió exitosamente revisa tu bandeja de entrada y tu correo no deseado',
                  ],
                },
              },
            };
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          return { error: { email: { _errors: ['Error al enviar email'] } } };
        }
      }
    } catch (error) {
      console.log(error);
      throw Error(error);
    }
  } else {
    return {
      error: {
        email: { _errors: [`Failed Google Captcha Score: ${res.data?.score}`] },
      },
    };
  }
}

export async function resetAccountEmail(data) {
  let { email, gReCaptchaToken } = Object.fromEntries(data);
  const secretKey = process?.env?.RECAPTCHA_SECRET_KEY;

  //check for errors
  const { error: zodError } = VerifyEmailSchema.safeParse({
    email,
  });
  if (zodError) {
    return { error: zodError.format() };
  }

  const formData = `secret=${secretKey}&response=${gReCaptchaToken}`;
  let res;
  try {
    res = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  } catch (e) {
    console.log('recaptcha error:', e);
  }

  if (res && res.data?.success && res.data?.score > 0.5) {
    // Save data to the database from here
    try {
      await dbConnect();
      const user = await User.findOne({ email: email });
      if (!user) {
        return { error: { email: { _errors: ['El correo no existe'] } } };
      }
      if (user?.active === false) {
        return {
          error: { email: { _errors: ['El correo no esta verificado'] } },
        };
      }
      if (user?._id) {
        try {
          const subject = 'Desbloquear Cuenta Shopout Mx';
          const body = `Por favor da click en desbloquear para reactivar tu cuenta`;
          const title = 'Desbloquear Cuenta';
          const btnAction = 'DESBLOQUEAR';
          const greeting = `Saludos ${user?.name}`;
          const bestRegards =
            '¿Problemas? Ponte en contacto contacto@shopout.com.mx';
          const recipient_email = email;
          const sender_email = 'contacto@shopout.com.mx';
          const fromName = 'Shopout Mx';

          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              user: process.env.GOOGLE_MAIL,
              pass: process.env.GOOGLE_MAIL_PASS_ONE,
            },
          });

          const mailOption = {
            from: `"${fromName}" ${sender_email}`,
            to: recipient_email,
            subject,
            html: `
              <!DOCTYPE html>
              <html lang="es">
              <body>
              <p>${greeting}</p>
              <p>${title}</p>
              <div>${body}</div>
              <a href="${process.env.NEXTAUTH_URL}/reiniciar?token=${user?.verificationToken}">${btnAction}</a>
              <p>${bestRegards}</p>
              </body>
              
              </html>
              
              `,
          };

          await transporter.sendMail(mailOption);

          return {
            error: {
              success: {
                _errors: [
                  'El correo electrónico fue enviado exitosamente revisa tu bandeja de entrada y spam',
                ],
              },
            },
          };
        } catch (error) {
          return { error: { email: { _errors: ['Failed to send email'] } } };
        }
      }
    } catch (error) {
      if (error) throw Error(error);
    }
  } else {
    return {
      error: {
        email: { _errors: [`Failed Google Captcha Score: ${res.data?.score}`] },
      },
    };
  }
}
