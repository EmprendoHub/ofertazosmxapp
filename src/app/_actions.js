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
} from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import Post from '@/backend/models/Post';
import Product from '@/backend/models/Product';
import User from '@/backend/models/User';
import Affiliate from '@/backend/models/Affiliate';
import bcrypt from 'bcrypt';

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
        console.log({ error: CustomZodError });
        return { error: CustomZodError };
      }
    }

    if (client?.phone != phone) {
      const phoneExist = await User.find({ phone: phone });
      console.log(phoneExist);
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
  const { error } = await Product.create({
    title,
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
