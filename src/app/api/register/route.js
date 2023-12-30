import dbConnect from '@/lib/db';
import bcrypt from 'bcrypt';
import User from '@/backend/models/User';

export async function POST(req) {
  try {
    await dbConnect();
    const { username, email, password: pass } = await req.json();
    const isExsting = await User?.findOne({ email });
    if (isExsting) {
      return new Response('User is already registered', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(pass, 10);
    // const newUser = await User.create({username, email, password: hashedPassword})
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    // exclude password
    //._doc is getting the calues of the user

    //const {password, ...user} = newUser._doc
    // return new Response(JSON.stringify(user), {status: 201})
    await newUser.save();
    return new Response('New user registered', { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}
