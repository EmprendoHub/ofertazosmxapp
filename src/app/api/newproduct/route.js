import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/backend/models/Product';
import { getToken } from 'next-auth/jwt';
import { generateUrlSafeTitle } from '@/backend/helpers';

export async function POST(request, res) {
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
        createdAt,
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

      createdAt = new Date();

      await dbConnect();
      const slug = generateUrlSafeTitle(title);
      const slugExists = await Product.findOne({
        slug: slug,
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

      const newProduct = new Product({
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

      // Save the Product to the database
      await newProduct.save();
      const response = NextResponse.json({
        message: 'Producto creado exitosamente',
        success: true,
      });

      return response;
    } catch (error) {
      console.log(error);
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
