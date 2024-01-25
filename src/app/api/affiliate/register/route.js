import dbConnect from '@/lib/db';
import bcrypt from 'bcrypt';
import User from '@/backend/models/User';
import Affiliate from '@/backend/models/Affiliate';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { cstDateTime } from '@/backend/helpers';

export async function POST(req) {
  try {
    await dbConnect();
    const inUser = await req.json();
    const { name, email, password: pass, phone } = await inUser.newAffiliate;
    const isExistingUser = await User?.findOne({ email });
    if (isExistingUser) {
      return new Response('Este correo ya esta registrado', { status: 400 });
    }

    const telephone = phone.replace(/\s/g, ''); // Replace all whitespace characters with an empty string
    const isExistingAffiliatePhone = await Affiliate?.findOne({
      'contact.phone': telephone,
    });
    if (isExistingAffiliatePhone) {
      return new Response('Teléfono ya esta en uso por otro asociado.', {
        status: 400,
      });
    }
    const hashedPassword = await bcrypt.hash(pass, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'afiliado',
    });

    const newAffiliate = new Affiliate({
      user: { _id: newUser._id },
      fullName: newUser.name,
      email: newUser.email,
      dateOfBirth: cstDateTime(),
      address: {
        street: 'Calle 132',
        city: 'Mi Ciudad',
        province: 'Mi estado',
        zip_code: '55644',
        country: 'Mexico',
      },
      contact: {
        phone: telephone,
      },
      joinedAt: cstDateTime(),
      isActive: true,
    });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const account = await stripe.accounts.create({
      type: 'express',
      email: email,
      metadata: {
        affiliateId: newAffiliate._id,
      },
    });
    newAffiliate.stripe_id = account.id;
    newUser.stripe_id = account.id;
    try {
      await newUser.save();
      await newAffiliate.save();
    } catch (error) {
      console.log(error);
    }

    return NextResponse.json({
      message: 'Nuevo Afiliado Registrado',
      success: true,
    });
    //return new Response('Nuevo Afiliado Registrado', { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}
