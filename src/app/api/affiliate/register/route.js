import dbConnect from '@/lib/db';
import bcrypt from 'bcrypt';
import User from '@/backend/models/User';
import Affiliate from '@/backend/models/Affiliate';

export async function POST(req) {
  try {
    await dbConnect();
    const { username, email, password: pass } = await req.json();
    const isExsting = await User?.findOne({ email });
    if (isExsting) {
      return new Response('User is already registered', { status: 400 });
    }
    const name = username;

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
      dateOfBirth: new Date(),
      address: {
        street: 'Calle 132',
        city: 'Mi Ciudad',
        province: 'Mi estado',
        zip_code: '55644',
        country: 'Mexico',
      },
      contact: {
        phone: '5456784545',
      },
      joinedAt: new Date(),
      isActive: true,
    });

    await newUser.save();
    await newAffiliate.save();

    return new Response('Nuevo Afiliado Registrado', { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}
