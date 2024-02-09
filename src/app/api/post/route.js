import Post from '@/backend/models/Post';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { mc } from '@/lib/minio';
import Product from '@/backend/models/Product';

// Put a file in bucket my-bucketname.
const uploadToBucket = async (folder, filename, file) => {
  return new Promise((resolve, reject) => {
    mc.fPutObject(folder, filename, file, function (err, result) {
      if (err) {
        console.log('Error from minio', err);
        reject(err);
      } else {
        console.log('Success uploading images to minio');
        resolve({
          _id: result._id, // Make sure _id and url are properties of the result object
          url: result.url,
        });
      }
    });
  });
};

export const GET = async (request) => {
  const cookie = await request.headers.get('cookie');
  if (!cookie) {
    // Not Signed in
    const notAuthorized = 'You are not authorized no no no';
    return new Response(JSON.stringify(notAuthorized), {
      status: 400,
    });
  }

  try {
    await dbConnect();
    const id = await request.headers.get('id');
    //const _id = await request.url.split('?')[1];
    const post = await Post?.findOne({ _id: id });
    // Find products matching any of the tag values
    const trendingProducts = await Product.find({
      'tags.value': post.category,
    }).limit(4);

    const response = NextResponse.json({
      message: 'One Post fetched successfully',
      success: true,
      post,
      trendingProducts,
    });
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: 'Post loading error',
      },
      { status: 500 }
    );
  }
};

export async function POST(req, res) {
  const token = await getToken({ req: req });
  if (token && token.user.role === 'manager') {
    try {
      await dbConnect();
      const { payload } = await req.json();
      let { title, category, images, summary, content, createdAt } = payload;

      // Parse images as JSON
      images = JSON.parse(images);
      let mainImage;
      const authorId = { _id: token?._id };
      const updatedAt = createdAt;
      const published = true;

      // set image urls
      const savedPostImages = [];
      const savedPostMinioBucketImages = [];
      images?.map(async (image, index) => {
        let image_url = image.i_file;
        let p_images = {
          url: `https://minio.salvawebpro.com:9000/shopout/posts/${image_url}`,
        };
        if (index === 0) {
          mainImage = p_images;
        }
        let minio_image = {
          i_filePreview: image.i_filePreview,
          i_file: image.i_file,
        };
        savedPostMinioBucketImages.push(minio_image);
        savedPostImages.push(p_images);

        // upload images to bucket
      });
      images = savedPostImages;

      const newPost = new Post({
        title,
        category,
        mainImage,
        images,
        summary,
        content,
        published,
        authorId,
        createdAt,
        updatedAt,
      });

      // Save the Post to the database
      const savedPost = await newPost.save();

      // upload images to bucket
      savedPostMinioBucketImages?.map(async (image) => {
        // Remove the data URI prefix (e.g., "data:image/jpeg;base64,")
        const base64Image = image.i_filePreview?.split(';base64,').pop();
        // Create a buffer from the base64 string
        const buffer = Buffer.from(base64Image, 'base64');
        const path = join('/', 'tmp', image.i_file);
        await writeFile(path, buffer);
        const fileName = '/posts/' + String(image.i_file);

        await uploadToBucket('shopout', fileName, path);
      });
      const response = NextResponse.json({
        message: 'Publicación creada exitosamente',
        success: true,
        post: savedPost,
      });

      return response;
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Error al crear Publicación',
        },
        { status: 500 }
      );
    }
  } else {
    // Not Signed in
    return new Response('You are not authorized, eh eh eh, no no no', {
      status: 400,
    });
  }
}

export async function PUT(req, res) {
  const token = await getToken({ req: req });

  if (token && token.user.role === 'manager') {
    try {
      await dbConnect();
      const { payload } = await req.json();
      let { title, category, summary, content, images, _id } = payload;

      // Parse images as JSON
      images = JSON.parse(images);
      let mainImage;

      const authorId = { _id: token?._id };
      const oid = _id;

      // set image urls
      const savedPostImages = [];
      const savedPostMinioBucketImages = [];
      images?.map(async (image, index) => {
        let image_url;
        let p_images;
        if (image.i_filePreview) {
          image_url = image.i_file;
          p_images = {
            url: `https://minio.salvawebpro.com:9000/shopout/posts/${image_url}`,
          };
          if (index === 0) {
            mainImage = p_images;
          }
          let minio_image = {
            i_filePreview: image.i_filePreview,
            i_file: image.i_file,
          };
          savedPostMinioBucketImages.push(minio_image);
          savedPostImages.push(p_images);
        } else {
          p_images = {
            url: image.url,
          };
          savedPostImages.push(p_images);
        }
      });

      images = savedPostImages;

      const updatePost = await Post.findOne({ _id: oid });
      updatePost.title = title;
      updatePost.mainImage = mainImage;
      updatePost.category = category;
      updatePost.summary = summary;
      updatePost.content = content;
      updatePost.images = images;
      updatePost.published = true;
      updatePost.authorId = authorId;

      // Save the Post to the database
      const savedPost = await updatePost.save();
      // upload images to bucket
      savedPostMinioBucketImages?.map(async (image) => {
        // Remove the data URI prefix (e.g., "data:image/jpeg;base64,")
        const base64Image = image.i_filePreview?.split(';base64,').pop();
        // Create a buffer from the base64 string
        const buffer = Buffer.from(base64Image, 'base64');
        const path = join('/', 'tmp', image.i_file);
        await writeFile(path, buffer);
        const fileName = '/posts/' + String(image.i_file);

        await uploadToBucket('shopout', fileName, path);
      });
      const response = NextResponse.json({
        message: 'Publicación actualizado exitosamente',
        success: true,
        post: savedPost,
      });

      return response;
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        {
          error: 'Error al crear Publicación',
        },
        { status: 500 }
      );
    }
  } else {
    // Not Signed in
    return new Response('You are not authorized, eh eh eh, no no no', {
      status: 400,
    });
  }
}

export async function DELETE(req) {
  const token = await getToken({ req: req });
  if (token && token.user.role === 'manager') {
    try {
      await dbConnect();
      const urlData = await req.url.split('?');
      const id = urlData[1];
      const deletePost = await Post.findByIdAndDelete(id);
      return new Response(JSON.stringify(deletePost), { status: 201 });
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
