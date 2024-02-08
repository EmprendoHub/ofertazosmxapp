// Import necessary modules
import dbConnect from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

// Put a file in bucket my-bucketname.
const uploadToBucket = async (folder, filename, file) => {
  return new Promise((resolve, reject) => {
    mc.fPutObject(folder, filename, file, function (err, result) {
      if (err) {
        console.log('Error from minio', err);
        reject(err);
      } else {
        resolve({
          _id: result._id, // Make sure _id and url are properties of the result object
          url: result.url,
        });
      }
    });
  });
};

export async function PUT(req, res) {
  const token = await getToken({ req: req });

  if (token) {
    try {
      await dbConnect();
      const { payload } = await req.json();
      const file = payload?.get('image');
      let { name, email, phone, _id } = payload;

      const updateUser = await User.findOne({ _id: _id });

      updateUser.name = name;
      updateUser.email = email;
      updateUser.phone = phone;

      if (!file) {
        // Save the Product to the database
        const savedUser = await updateUser.save();
        const response = NextResponse.json({
          message: 'Usuario actualizado exitosamente',
          success: true,
          product: savedUser,
        });

        return response;
      }
      image = `https://minio.salvawebpro.com:9000/shopout/avatars/${file?.file.name}`;
      // Create a new Product in the database

      // Save the Product to the database
      const savedUser = await updateUser.save();

      // upload images to bucket
      // Remove the data URI prefix (e.g., "data:image/jpeg;base64,")
      const base64Image = image.i_filePreview?.split(';base64,').pop();
      // Create a buffer from the base64 string
      const buffer = Buffer.from(base64Image, 'base64');
      const path = join('/', 'tmp', image.i_file);
      await writeFile(path, buffer);
      const fileName = '/avatars/' + String(image.i_file);

      await uploadToBucket('shopout', fileName, path);
      const response = NextResponse.json({
        message: 'Usuario actualizado exitosamente',
        success: true,
        product: savedUser,
      });

      return response;
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
