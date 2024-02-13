import { cstDateTime } from '@/backend/helpers';
import Affiliate from '@/backend/models/Affiliate';
import Order from '@/backend/models/Order';
import Product from '@/backend/models/Product';
import ReferralEvent from '@/backend/models/ReferralEvent';
import ReferralLink from '@/backend/models/ReferralLink';
import dbConnect from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req, res) {
  try {
    await dbConnect();

    // Access the value of stripe-signature from the headers
    const signature = await req.headers.get('stripe-signature');
    const rawBody = await req.text();
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    const session = event.data.object;

    // Payment confirmed
    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      // get all the details from stripe checkout to create new order
      const payIntentId = session?.payment_intent;

      const paymentIntent = await stripe?.paymentIntents.retrieve(payIntentId);

      const currentOrder = await Order.findOne({
        _id: session?.metadata?.order,
      });

      currentOrder?.orderItems.forEach(async (item) => {
        console.log(item, 'item');
        const productId = item.product.toString();
        const variationId = item.variation.toString();
        // Find the product by its _id and update its stock
        const product = await Product.findOne({ _id: productId });
        // Find the product variation
        const variation = product.variations.find((variation) =>
          variation._id.equals(variationId)
        );
        if (variation) {
          // Decrement the quantity
          variation.stock -= item.quantity; // Decrease the quantity by 1
          product.stock -= item.quantity; // Decrease the quantity by 1

          // Save the updated product
          await product.save();
          console.log('product after save', product);

          revalidatePath(`/producto/${product._id}`);
        } else {
          console.log('Product not found');
        }
      });

      let newPaymentAmount;
      if (session.payment_status === 'unpaid') {
        newPaymentAmount = 0;
      } else {
        newPaymentAmount = session.amount_total / 100;
      }

      let payAmount = currentOrder.paymentInfo.amountPaid + newPaymentAmount;
      // Use reduce to sum up the 'total' field
      const totalOrderAmount = currentOrder.orderItems.reduce(
        (acc, orderItem) => acc + orderItem.quantity * orderItem.price,
        0
      );

      if (payAmount >= totalOrderAmount) {
        currentOrder.orderStatus = 'Procesando';
        currentOrder.paymentInfo.status = 'Paid';
        if (session?.metadata?.referralID) {
          const referralLink = await ReferralLink.findOne({
            _id: session?.metadata?.referralID,
          });

          const affiliate = await Affiliate.findOne(referralLink.affiliateId);
          const affiliateId = await affiliate?._id.toString();
          const timestamp = cstDateTime(); // Current timestamp
          //transfer amount to affiliate
          const transfer = await stripe.transfers.create({
            amount: totalOrderAmount * 0.1 * 100,
            currency: 'mxn',
            destination: affiliate?.stripe_id,
            source_transaction: paymentIntent?.latest_charge,
          });
          // Create a ReferralEvent object
          const newReferralEvent = await ReferralEvent.create({
            referralLinkId: { _id: session?.metadata?.referralID },
            eventType: 'AffiliatePurchase',
            affiliateId: { _id: affiliateId },
            ipAddress: '234.234.235.77',
            userAgent: 'user-agent',
            timestamp: timestamp,
          });
          await newReferralEvent.save();
          referralLink.clickCount = referralLink.clickCount + 1;
          await referralLink.save();
        }
      }

      if (payAmount < totalOrderAmount) {
        currentOrder.orderStatus = 'Apartado';
        if (session?.metadata?.referralID) {
          const referralLink = await ReferralLink.findOne({
            _id: session?.metadata?.referralID,
          });
          const affiliate = await Affiliate.findOne(referralLink.affiliateId);
          const affiliateId = await affiliate?._id.toString();
          const timestamp = cstDateTime(); // Current timestamp
          // Create a ReferralEvent object
          const newReferralEvent = await ReferralEvent.create({
            referralLinkId: { _id: session?.metadata?.referralID },
            eventType: 'AffiliateLayaway',
            affiliateId: { _id: affiliateId },
            ipAddress: '234.234.235.77',
            userAgent: 'user-agent',
            timestamp: timestamp,
          });
          await newReferralEvent.save();
          referralLink.clickCount = referralLink.clickCount + 1;
          await referralLink.save();
        }
      }

      currentOrder.paymentInfo.amountPaid = payAmount;

      await currentOrder.save();
    }
    return NextResponse.json(
      {
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al Pagar el pedido con stripe Pedido',
      },
      { status: 500 }
    );
  }
}
