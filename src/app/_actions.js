'use server';
import Address from '@/backend/models/Address';
import dbConnect from '@/lib/db';
import { getServerSession } from 'next-auth';
import { options } from './api/auth/[...nextauth]/options';
import {
  AddressEntrySchema,
  ClientPasswordUpdateSchema,
  ClientUpdateSchema,
  PostEntrySchema,
  PostUpdateSchema,
  ProductEntrySchema,
  VariationProductEntrySchema,
  VariationUpdateProductEntrySchema,
  VerifyEmailSchema,
} from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import Post from '@/backend/models/Post';
import Product from '@/backend/models/Product';
import User from '@/backend/models/User';
import Affiliate from '@/backend/models/Affiliate';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import axios from 'axios';
import { NextResponse } from 'next/server';
import { generateUrlSafeTitle } from '@/backend/helpers';

export async function changeClientStatus(_id) {
  const session = await getServerSession(options);

  try {
    await dbConnect();
    const client = await User.findOne({ _id: _id });
    if (client && client.active === false) {
      client.active = true;
    } else {
      client.active = false;
    }
    client.save();
    revalidatePath('/admin/clientes');
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function updateClient(data) {
  let { _id, name, phone, email, updatedAt } = Object.fromEntries(data);

  updatedAt = new Date(updatedAt);

  try {
    // validate form data
    const result = ClientUpdateSchema.safeParse({
      name: name,
      phone: phone,
      email: email,
      updatedAt: updatedAt,
    });

    //check for errors
    const { error: zodError } = result;
    if (zodError) {
      return { error: zodError.format() };
    }

    await dbConnect();
    let CustomZodError;
    const client = await User.findOne({ _id: _id });

    if (client?.email != email) {
      const emailExist = await User.find({ email: email });
      if (emailExist) {
        CustomZodError = {
          _errors: [],
          email: { _errors: ['El email ya esta en uso'] },
        };
        return { error: CustomZodError };
      }
    }

    if (client?.phone != phone) {
      const phoneExist = await User.find({ phone: phone });
      if (phoneExist.length > 0) {
        CustomZodError = {
          _errors: [],
          phone: { _errors: ['El teléfono ya esta en uso'] },
        };
        console.log({ error: CustomZodError });
        return { error: CustomZodError };
      }
    }

    client.name = name;
    client.phone = phone;
    client.email = email;
    client.updatedAt = updatedAt;
    // client.avatar = avatar;
    client.save();
    revalidatePath('/perfil/actualizar');
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function updateClientPassword(data) {
  let { _id, newPassword, currentPassword, updatedAt } =
    Object.fromEntries(data);

  updatedAt = new Date(updatedAt);

  try {
    // validate form data
    const result = ClientPasswordUpdateSchema.safeParse({
      newPassword: newPassword,
      currentPassword: currentPassword,
      updatedAt: updatedAt,
    });

    //check for errors
    const { error: zodError } = result;
    if (zodError) {
      return { error: zodError.format() };
    }

    await dbConnect();
    let CustomZodError;
    let hashedPassword;
    const client = await User.findOne({ _id: _id }).select('+password');
    const comparePass = await bcrypt.compare(currentPassword, client.password);
    if (!comparePass) {
      CustomZodError = {
        _errors: [],
        currentPassword: {
          _errors: ['La contraseña actual no es la correcta'],
        },
      };
      return { error: CustomZodError };
    } else {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    client.password = hashedPassword;
    client.updatedAt = updatedAt;
    client.save();
    revalidatePath('/perfil/actualizar_contrasena');
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function updateAffiliate(_id) {
  const session = await getServerSession(options);
  //check for errors
  await dbConnect();
  try {
    const affiliate = await Affiliate.findOne({ _id: _id });
    if (affiliate && affiliate.isActive === false) {
      affiliate.isActive = true;
    } else {
      affiliate.isActive = false;
    }
    affiliate.save();
    revalidatePath('/admin/clientes');
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function addAddress(data) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };
  const { street, city, province, zip_code, country, phone } =
    Object.fromEntries(data);

  // validate form data

  const { error: zodError } = AddressEntrySchema.safeParse({
    street,
    city,
    province,
    zip_code,
    country,
    phone,
  });
  if (zodError) {
    return { error: zodError.format() };
  }
  //check for errors
  await dbConnect();
  const { error } = await Address.create({
    street,
    city,
    province,
    zip_code,
    country,
    phone,
    user,
  });
  if (error) throw Error(error);
  revalidatePath('/perfil/direcciones');
  revalidatePath('/carrito/envio');
}

export async function deleteAddress(id) {
  //check for errors
  try {
    await dbConnect();
    const deleteAddress = await Address.findByIdAndDelete(id);
    revalidatePath('/perfil/direcciones');
    revalidatePath('/carrito/envio');
  } catch (error) {
    if (error) throw Error(error);
  }
}

export async function addNewPost(data) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };
  let {
    category,
    mainTitle,
    mainImage,
    sectionTwoTitle,
    sectionTwoParagraphOne,
    sectionTwoParagraphTwo,
    sectionThreeTitle,
    sectionThreeParagraphOne,
    sectionThreeImage,
    sectionThreeParagraphFooter,
    sectionFourTitle,
    sectionFourOptionOne,
    sectionFourOptionTwo,
    sectionFourOptionThree,
    sectionFourParagraphOne,
    sectionFourImage,
    sectionFourParagraphFooter,
    sectionFiveTitle,
    sectionFiveImage,
    sectionFiveParagraphOne,
    sectionFiveParagraphTwo,
    sectionSixColOneTitle,
    sectionSixColOneParagraph,
    sectionSixColOneImage,
    sectionSixColTwoTitle,
    sectionSixColTwoParagraph,
    sectionSixColTwoImage,
    sectionSixColThreeTitle,
    sectionSixColThreeParagraph,
    sectionSixColThreeImage,
    sectionSixColOneParagraphFooter,
    sectionSevenTitle,
    sectionSevenImage,
    sectionSevenParagraph,
    createdAt,
  } = Object.fromEntries(data);

  createdAt = new Date(createdAt);
  // validate form data
  const result = PostEntrySchema.safeParse({
    category: category,
    mainTitle: mainTitle,
    mainImage: mainImage,
    createdAt: createdAt,
  });
  const { error: zodError } = result;
  if (zodError) {
    return { error: zodError.format() };
  }

  //check for errors
  await dbConnect();
  const { error } = await Post.create({
    category,
    mainTitle,
    mainImage,
    sectionTwoTitle,
    sectionTwoParagraphOne,
    sectionTwoParagraphTwo,
    sectionThreeTitle,
    sectionThreeParagraphOne,
    sectionThreeImage,
    sectionThreeParagraphFooter,
    sectionFourTitle,
    sectionFourOptionOne,
    sectionFourOptionTwo,
    sectionFourOptionThree,
    sectionFourParagraphOne,
    sectionFourImage,
    sectionFourParagraphFooter,
    sectionFiveTitle,
    sectionFiveImage,
    sectionFiveParagraphOne,
    sectionFiveParagraphTwo,
    sectionSixColOneTitle,
    sectionSixColOneParagraph,
    sectionSixColOneImage,
    sectionSixColTwoTitle,
    sectionSixColTwoParagraph,
    sectionSixColTwoImage,
    sectionSixColThreeTitle,
    sectionSixColThreeParagraph,
    sectionSixColThreeImage,
    sectionSixColOneParagraphFooter,
    sectionSevenTitle,
    sectionSevenImage,
    sectionSevenParagraph,
    createdAt,
    published: true,
    authorId: { _id: session?.user._id },
  });
  if (error) throw Error(error);
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}

export async function updatePost(data) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };
  let {
    _id,
    category,
    mainTitle,
    mainImage,
    sectionTwoTitle,
    sectionTwoParagraphOne,
    sectionTwoParagraphTwo,
    sectionThreeTitle,
    sectionThreeParagraphOne,
    sectionThreeImage,
    sectionThreeParagraphFooter,
    sectionFourTitle,
    sectionFourOptionOne,
    sectionFourOptionTwo,
    sectionFourOptionThree,
    sectionFourParagraphOne,
    sectionFourImage,
    sectionFourParagraphFooter,
    sectionFiveTitle,
    sectionFiveImage,
    sectionFiveParagraphOne,
    sectionFiveParagraphTwo,
    sectionSixColOneTitle,
    sectionSixColOneParagraph,
    sectionSixColOneImage,
    sectionSixColTwoTitle,
    sectionSixColTwoParagraph,
    sectionSixColTwoImage,
    sectionSixColThreeTitle,
    sectionSixColThreeParagraph,
    sectionSixColThreeImage,
    sectionSixColOneParagraphFooter,
    sectionSevenTitle,
    sectionSevenImage,
    sectionSevenParagraph,
    updatedAt,
  } = Object.fromEntries(data);

  updatedAt = new Date(updatedAt);
  // validate form data
  const result = PostUpdateSchema.safeParse({
    category: category,
    mainTitle: mainTitle,
    mainImage: mainImage,
    updatedAt: updatedAt,
  });
  const { error: zodError } = result;
  if (zodError) {
    return { error: zodError.format() };
  }

  //check for errors
  await dbConnect();
  const { error } = await Post.updateOne(
    { _id },
    {
      category,
      mainTitle,
      mainImage,
      sectionTwoTitle,
      sectionTwoParagraphOne,
      sectionTwoParagraphTwo,
      sectionThreeTitle,
      sectionThreeParagraphOne,
      sectionThreeImage,
      sectionThreeParagraphFooter,
      sectionFourTitle,
      sectionFourOptionOne,
      sectionFourOptionTwo,
      sectionFourOptionThree,
      sectionFourParagraphOne,
      sectionFourImage,
      sectionFourParagraphFooter,
      sectionFiveTitle,
      sectionFiveImage,
      sectionFiveParagraphOne,
      sectionFiveParagraphTwo,
      sectionSixColOneTitle,
      sectionSixColOneParagraph,
      sectionSixColOneImage,
      sectionSixColTwoTitle,
      sectionSixColTwoParagraph,
      sectionSixColTwoImage,
      sectionSixColThreeTitle,
      sectionSixColThreeParagraph,
      sectionSixColThreeImage,
      sectionSixColOneParagraphFooter,
      sectionSevenTitle,
      sectionSevenImage,
      sectionSevenParagraph,
      updatedAt,
      published: true,
      authorId: { _id: session?.user._id },
    }
  );
  if (error) throw Error(error);
  revalidatePath('/admin/blog');
  revalidatePath('/blog/publicacion/');
  revalidatePath('/admin/blog/editor');
  revalidatePath('/blog');
}

export async function addVariationProduct(data) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };

  let {
    title,
    description,
    category,
    tags,
    featured,
    mainImage,
    brand,
    gender,
    variations,
    salePrice,
    salePriceEndDate,
    createdAt,
  } = Object.fromEntries(data);
  // Parse variations JSON string with reviver function to convert numeric strings to numbers
  let colors = [];
  variations = JSON.parse(variations, (key, value) => {
    if (key === 'color') {
      const color = {
        value: value,
        label: value,
      };
      //check array of object to see if values exists
      const exists = colors.some((c) => c.value === value || c.label === value);
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
  createdAt = new Date(createdAt);

  // validate form data
  const result = VariationProductEntrySchema.safeParse({
    title: title,
    description: description,
    brand: brand,
    category: category,
    tags: tags,
    images: images,
    variations: variations,
    stock: stock,
    gender: gender,
    createdAt: createdAt,
  });

  //check for errors
  const { error: zodError } = result;
  if (zodError) {
    return { error: zodError.format() };
  }
  // Create a new Product in the database
  await dbConnect();
  const titleTag = generateUrlSafeTitle(title);

  const usedTitle = await Product.find({ title: title });
  if (usedTitle.length > 0) {
    return {
      error: {
        title: { _errors: ['Este titulo ya esta en uso para otro producto'] },
      },
    };
  }
  const { error } = await Product.create({
    type: 'variation',
    title,
    titleTag,
    description,
    featured,
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
  if (error) throw Error(error);
  revalidatePath('/admin/productos');
  revalidatePath('/tienda');
}

export async function updateVariationProduct(data) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };

  let {
    title,
    description,
    category,
    tags,
    featured,
    mainImage,
    brand,
    gender,
    variations,
    salePrice,
    salePriceEndDate,
    updatedAt,
    _id,
  } = Object.fromEntries(data);
  // Parse variations JSON string with reviver function to convert numeric strings to numbers
  let colors = [];
  variations = JSON.parse(variations, (key, value) => {
    if (key === 'color') {
      const color = {
        value: value,
        label: value,
      };
      //check array of object to see if values exists
      const exists = colors.some((c) => c.value === value || c.label === value);
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

  // validate form data
  const result = VariationUpdateProductEntrySchema.safeParse({
    title: title,
    description: description,
    brand: brand,
    category: category,
    tags: tags,
    images: images,
    variations: variations,
    stock: stock,
    gender: gender,
    updatedAt: updatedAt,
  });

  //check for errors
  const { error: zodError } = result;
  if (zodError) {
    return { error: zodError.format() };
  }
  // Create a new Product in the database
  await dbConnect();
  const usedTitle = await Product.find({ title: title, _id: { $ne: _id } });

  if (usedTitle.length > 0) {
    return {
      error: {
        title: { _errors: ['Este titulo ya esta en uso para otro producto'] },
      },
    };
  }
  const titleTag = generateUrlSafeTitle(title);
  const { error } = await Product.updateOne(
    { _id },
    {
      type: 'variation',
      title,
      titleTag,
      description,
      featured,
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
  if (error) throw Error(error);
  revalidatePath('/admin/productos');
  revalidatePath('/tienda');
}

export async function addProduct(data) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };

  let {
    title,
    description,
    category,
    cost,
    price,
    sizes,
    tags,
    colors,
    featured,
    images,
    brand,
    gender,
    salePrice,
    salePriceEndDate,
    stock,
    createdAt,
  } = Object.fromEntries(data);
  // Parse images as JSON
  images = JSON.parse(images);
  sizes = JSON.parse(sizes);
  tags = JSON.parse(tags);
  console.log(tags, 'tags');
  colors = JSON.parse(colors);
  stock = Number(stock);
  cost = Number(cost);
  price = Number(price);
  const sale_price = Number(salePrice);
  const sale_price_end_date = salePriceEndDate;

  createdAt = new Date(createdAt);

  // validate form data
  const result = ProductEntrySchema.safeParse({
    title: title,
    description: description,
    brand: brand,
    category: category,
    colors: colors,
    sizes: sizes,
    tags: tags,
    images: images,
    gender: gender,
    stock: stock,
    price: price,
    cost: cost,
    createdAt: createdAt,
  });

  //check for errors
  const { error: zodError } = result;
  if (zodError) {
    return { error: zodError.format() };
  }
  // Create a new Product in the database
  await dbConnect();
  const titleTag = generateUrlSafeTitle(title);
  const { error } = await Product.create({
    type: 'simple',
    title,
    titleTag,
    description,
    featured,
    brand,
    gender,
    category,
    colors,
    sizes,
    tags,
    images,
    stock,
    price,
    sale_price,
    sale_price_end_date,
    cost,
    createdAt,
    user,
  });
  if (error) throw Error(error);
  revalidatePath('/admin/productos');
  revalidatePath('/tienda');
}

export async function resendEmail(data) {
  let { email, gReCaptchaToken } = Object.fromEntries(data);
  const secretKey = process?.env?.RECAPTCHA_SECRET_KEY;

  //check for errors
  const { error: zodError } = VerifyEmailSchema.safeParse({
    email,
  });
  if (zodError) {
    return { error: zodError.format() };
  }

  const formData = `secret=${secretKey}&response=${gReCaptchaToken}`;
  let res;
  try {
    res = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  } catch (e) {
    console.log('recaptcha error:', e);
  }

  if (res && res.data?.success && res.data?.score > 0.5) {
    // Save data to the database from here
    try {
      await dbConnect();
      const user = await User.findOne({ email: email });
      if (!user) {
        return { error: { email: { _errors: ['Email does not exist'] } } };
      }
      if (user?.isActive === true) {
        return { error: { email: { _errors: ['Email is already verified'] } } };
      }
      if (user?._id) {
        try {
          const subject = 'Confirmar email';
          const body = `Por favor da click en confirmar email para verificar tu cuenta.`;
          const title = 'Completar registro';
          const greeting = `Saludos ${user?.name}`;
          const action = 'CONFIRMAR EMAIL';
          const bestRegards = 'Gracias por unirte a nuestro sitio.';
          const recipient_email = email;
          const sender_email = 'contacto@shopout.com.mx';
          const fromName = 'Shopout Mx';

          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              user: process.env.GOOGLE_MAIL,
              pass: process.env.GOOGLE_MAIL_PASS_ONE,
            },
          });

          try {
            // Verify your transporter
            //await transporter.verify();

            const mailOptions = {
              from: `"${fromName}" ${sender_email}`,
              to: recipient_email,
              subject,
              html: `
        <!DOCTYPE html>
        <html lang="es">
        <body>
        <p>${greeting}</p>
        <p>${title}</p>
        <div>${body}</div>
        <a href="${process.env.NEXTAUTH_URL}/exito?token=${user?.verificationToken}">${action}</a>
        <p>${bestRegards}</p>
        </body>
        
        </html>
        
        `,
            };
            await transporter.sendMail(mailOptions);

            return {
              error: {
                success: {
                  _errors: [
                    'El correo se envió exitosamente revisa tu bandeja de entrada y tu correo no deseado',
                  ],
                },
              },
            };
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          return { error: { email: { _errors: ['Error al enviar email'] } } };
        }
      }
    } catch (error) {
      console.log(error);
      throw Error(error);
    }
  } else {
    return {
      error: {
        email: { _errors: [`Failed Google Captcha Score: ${res.data?.score}`] },
      },
    };
  }
}

export async function resetAccountEmail(data) {
  let { email, gReCaptchaToken } = Object.fromEntries(data);
  const secretKey = process?.env?.RECAPTCHA_SECRET_KEY;

  //check for errors
  const { error: zodError } = VerifyEmailSchema.safeParse({
    email,
  });
  if (zodError) {
    return { error: zodError.format() };
  }

  const formData = `secret=${secretKey}&response=${gReCaptchaToken}`;
  let res;
  try {
    res = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  } catch (e) {
    console.log('recaptcha error:', e);
  }

  if (res && res.data?.success && res.data?.score > 0.5) {
    // Save data to the database from here
    try {
      await dbConnect();
      const user = await User.findOne({ email: email });
      if (!user) {
        return { error: { email: { _errors: ['El correo no existe'] } } };
      }
      if (user?.active === false) {
        return {
          error: { email: { _errors: ['El correo no esta verificado'] } },
        };
      }
      if (user?._id) {
        try {
          const subject = 'Desbloquear Cuenta Shopout Mx';
          const body = `Por favor da click en desbloquear para reactivar tu cuenta`;
          const title = 'Desbloquear Cuenta';
          const btnAction = 'DESBLOQUEAR';
          const greeting = `Saludos ${user?.name}`;
          const bestRegards =
            '¿Problemas? Ponte en contacto contacto@shopout.com.mx';
          const recipient_email = email;
          const sender_email = 'contacto@shopout.com.mx';
          const fromName = 'Shopout Mx';

          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              user: process.env.GOOGLE_MAIL,
              pass: process.env.GOOGLE_MAIL_PASS_ONE,
            },
          });

          const mailOption = {
            from: `"${fromName}" ${sender_email}`,
            to: recipient_email,
            subject,
            html: `
              <!DOCTYPE html>
              <html lang="es">
              <body>
              <p>${greeting}</p>
              <p>${title}</p>
              <div>${body}</div>
              <a href="${process.env.NEXTAUTH_URL}/reiniciar?token=${user?.verificationToken}">${btnAction}</a>
              <p>${bestRegards}</p>
              </body>
              
              </html>
              
              `,
          };

          await transporter.sendMail(mailOption);

          return {
            error: {
              success: {
                _errors: [
                  'El correo electrónico fue enviado exitosamente revisa tu bandeja de entrada y spam',
                ],
              },
            },
          };
        } catch (error) {
          return { error: { email: { _errors: ['Failed to send email'] } } };
        }
      }
    } catch (error) {
      if (error) throw Error(error);
    }
  } else {
    return {
      error: {
        email: { _errors: [`Failed Google Captcha Score: ${res.data?.score}`] },
      },
    };
  }
}
