import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/backend/models/Product';
import { getToken } from 'next-auth/jwt';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { mc } from '@/lib/minio';
import { generateUrlSafeTitle } from '@/backend/helpers';

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

export async function PUT(request, res) {
  const token = await getToken({ req: request });

  if (token) {
    try {
      const payload = await request.formData();
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
      } = Object.fromEntries(payload);

      const user = { _id: token?.user?._id };

      // Parse variations JSON string with reviver function to convert numeric strings to numbers
      let colors = [];
      variations = JSON.parse(variations, (key, value) => {
        if (key === 'color') {
          const color = {
            value: value,
            label: value,
          };
          //check array of object to see if values exists
          const exists = colors.some(
            (c) => c.value === value || c.label === value
          );
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

      await dbConnect();
      const slug = generateUrlSafeTitle(title);
      const slugExists = await Product.findOne({
        slug: slug,
        _id: { $ne: _id },
      });
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

      // Update a Product in the database
      await Product.updateOne(
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
      const response = NextResponse.json({
        message: 'Producto actualizado exitosamente',
        success: true,
      });

      return response;
    } catch (error) {
      console.log(error, 'intentional errir');
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
