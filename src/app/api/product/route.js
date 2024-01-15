import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/backend/models/Product';
import { getToken } from 'next-auth/jwt';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { mc } from '@/lib/minio';

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

export const GET = async (req) => {
  await dbConnect();

  const _id = await req.url.split('?')[1];

  try {
    const product = await Product?.findOne({ _id });
    const response = NextResponse.json({
      message: 'One Product fetched successfully',
      success: true,
      product,
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Product loading error',
      },
      { status: 500 }
    );
  }
};

export async function POST(req, res) {
  const token = await getToken({ req: req });
  if (token) {
    try {
      await dbConnect();
      const { payload } = await req.json();
      let {
        title,
        description,
        category,
        cost,
        price,
        sizes,
        featured,
        images,
        brand,
        gender,
        salePrice,
        salePriceEndDate,
        stock,
        createdAt,
      } = payload;
      // Parse images as JSON
      images = JSON.parse(images);
      sizes = JSON.parse(sizes);
      stock = Number(stock);
      cost = Number(cost);
      price = Number(price);
      const sale_price = Number(salePrice);
      const sale_price_end_date = salePriceEndDate;
      const user = { _id: token?._id };
      if (featured === 'si') {
        featured = true;
      } else {
        featured = false;
      }

      // set image urls
      const savedProductImages = [];
      const savedProductMinioBucketImages = [];
      const savedProductColors = [];
      images?.map(async (image) => {
        let image_url = image.i_file;
        let p_images = {
          url: `https://minio.salvawebpro.com:9000/shopout/products/${image_url}`,
          color: image.i_color,
        };
        let minio_image = {
          i_filePreview: image.i_filePreview,
          i_file: image.i_file,
        };
        savedProductMinioBucketImages.push(minio_image);
        savedProductImages.push(p_images);
        let tempColor = { value: image.i_color, hex: '#001001' };

        savedProductColors.push(tempColor);
        // upload images to bucket
      });
      const colors = savedProductColors;
      images = savedProductImages;
      // Create a new Product in the database

      const newProduct = new Product({
        title,
        description,
        featured,
        brand,
        gender,
        category,
        colors,
        sizes,
        images,
        stock,
        price,
        sale_price,
        sale_price_end_date,
        cost,
        createdAt,
        user,
      });

      // Save the Product to the database
      const savedProduct = await newProduct.save();

      // upload images to bucket
      savedProductMinioBucketImages?.map(async (image) => {
        // Remove the data URI prefix (e.g., "data:image/jpeg;base64,")
        const base64Image = image.i_filePreview?.split(';base64,').pop();
        // Create a buffer from the base64 string
        const buffer = Buffer.from(base64Image, 'base64');
        const path = join('/', 'tmp', image.i_file);
        await writeFile(path, buffer);
        const fileName = '/products/' + String(image.i_file);

        await uploadToBucket('shopout', fileName, path);
      });
      const response = NextResponse.json({
        message: 'Producto creado exitosamente',
        success: true,
        product: savedProduct,
      });

      return response;
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Error al crear Producto',
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
  if (token) {
    try {
      await dbConnect();
      const { payload } = await req.json();
      let {
        title,
        description,
        category,
        cost,
        price,
        sizes,
        images,
        brand,
        gender,
        salePrice,
        salePriceEndDate,
        stock,
        _id,
      } = payload;

      // Parse images as JSON
      images = JSON.parse(images);
      sizes = JSON.parse(sizes);
      stock = Number(stock);
      cost = Number(cost);
      price = Number(price);
      const oid = _id;
      const sale_price = Number(salePrice);
      const sale_price_end_date = salePriceEndDate;
      const user = { _id: token?._id };

      // set image urls
      const savedProductImages = [];
      const savedProductMinioBucketImages = [];
      const savedProductColors = [];
      images?.map(async (image) => {
        let image_url;
        let p_images;
        let tempColor;
        if (image.i_file) {
          image_url = image.i_file;
          p_images = {
            url: `https://minio.salvawebpro.com:9000/shopout/products/${image_url}`,
            color: image.i_color,
          };
          let minio_image = {
            i_filePreview: image.url,
            i_file: image.i_file,
          };
          savedProductMinioBucketImages.push(minio_image);
          savedProductImages.push(p_images);
          tempColor = { value: image.i_color, hex: '#001001' };
          savedProductColors.push(tempColor);
        } else {
          p_images = {
            url: image.url,
            color: image.color,
          };
          savedProductImages.push(p_images);
          tempColor = { value: image.i_color, hex: '#001001' };
          savedProductColors.push(tempColor);
        }
      });
      const colors = savedProductColors;
      images = savedProductImages;
      // Create a new Product in the database

      const updateProduct = await Product.findOne({ _id: oid });

      updateProduct.title = title;
      updateProduct.description = description;
      updateProduct.brand = brand;
      updateProduct.gender = gender;
      updateProduct.category = category;
      updateProduct.colors = colors;
      updateProduct.sizes = sizes;
      updateProduct.images = images;
      updateProduct.stock = stock;
      updateProduct.price = price;
      updateProduct.sale_price = sale_price;
      updateProduct.sale_price_end_date = sale_price_end_date;
      updateProduct.cost = cost;
      updateProduct.user = user;

      // Save the Product to the database
      const savedProduct = await updateProduct.save();

      // upload images to bucket
      savedProductMinioBucketImages?.map(async (image) => {
        // Remove the data URI prefix (e.g., "data:image/jpeg;base64,")
        const base64Image = image.i_filePreview?.split(';base64,').pop();
        // Create a buffer from the base64 string
        const buffer = Buffer.from(base64Image, 'base64');
        const path = join('/', 'tmp', image.i_file);
        await writeFile(path, buffer);
        const fileName = '/products/' + String(image.i_file);

        await uploadToBucket('shopout', fileName, path);
      });
      const response = NextResponse.json({
        message: 'Producto actualizado exitosamente',
        success: true,
        product: savedProduct,
      });

      return response;
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Error al crear Producto',
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
  const sessionData = req.headers.get('x-mysession-key');
  const session = JSON.parse(sessionData);
  if (session) {
    try {
      await dbConnect();
      const urlData = await req.url.split('?');
      const id = urlData[1];
      const deleteProduct = await Product.findByIdAndDelete(id);
      return new Response(JSON.stringify(deleteProduct), { status: 201 });
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
