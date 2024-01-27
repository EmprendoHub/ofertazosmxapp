'use server';
import Address from '@/backend/models/Address';
import dbConnect from '@/lib/db';
import { getServerSession } from 'next-auth';
import { options } from './api/auth/[...nextauth]/options';
import { AddressEntrySchema, PostEntrySchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import Post from '@/backend/models/Post';

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

export async function addPost(data) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };
  let { title, category, images, summary, content, createdAt } =
    Object.fromEntries(data);
  images = JSON.parse(images);

  createdAt = new Date(createdAt);
  // validate form data
  const result = PostEntrySchema.safeParse({
    title: title,
    category: category,
    mainImage: images[0],
    images: images,
    summary: summary,
    content: content,
    createdAt: createdAt,
  });
  const { error: zodError } = result;
  if (zodError) {
    return { error: zodError.format() };
  }

  //check for errors
  await dbConnect();
  const { error } = await Post.create({
    title,
    category,
    mainImage: images[0],
    images,
    summary,
    content,
    createdAt,
    published: true,
    authorId: { _id: session?.user._id },
  });
  if (error) throw Error(error);
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}
