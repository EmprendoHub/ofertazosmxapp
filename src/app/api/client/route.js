import dbConnect from '@/lib/db';
import User from '@/backend/models/User';

export async function DELETE(req) {
  const sessionData = req.headers.get('x-mysession-key');
  const session = JSON.parse(sessionData);
  if (session) {
    try {
      await dbConnect();
      const urlData = await req.url.split('?');
      const id = urlData[1];
      const deleteUser = await User.findByIdAndDelete(id);
      return new Response(JSON.stringify(deleteUser), { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify(error.message), { status: 500 });
    }
  } else {
    // Not Signed in
    return new Response('You are not authorized, eh eh eh, no no no', {
      status: 400,
    });
  }
}
