'use server';
import Address from '@/backend/models/Address';
import dbConnect from '@/lib/db';
import { getServerSession } from 'next-auth';
import { options } from './api/auth/[...nextauth]/options';
import {
  AddressEntrySchema,
  ClientPasswordUpdateSchema,
  ClientUpdateSchema,
  PageEntrySchema,
  PageUpdateSchema,
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
import { cstDateTime, generateUrlSafeTitle } from '@/backend/helpers';
import Order from '@/backend/models/Order';
import APIPostsFilters from '@/lib/APIPostsFilters';
import APIFilters from '@/lib/APIFilters';
import APIOrderFilters from '@/lib/APIOrderFilters';
import APIClientFilters from '@/lib/APIClientFilters';
import APIAffiliateFilters from '@/lib/APIAffiliateFilters';
import Page from '@/backend/models/Page';
import mongoose from 'mongoose';

// Function to get the document count for all from the previous month
const getDocumentCountPreviousMonth = async (model) => {
  const now = new Date();
  const firstDayOfPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );
  const lastDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  try {
    const documentCount = await model.countDocuments(
      {
        createdAt: {
          $gte: firstDayOfPreviousMonth,
          $lte: lastDayOfPreviousMonth,
        },
      },
      {
        published: { $ne: 'false' },
      }
    );

    return documentCount;
  } catch (error) {
    console.error('Error counting documents from the previous month:', error);
    throw error;
  }
};

// Function to get the document count for all orders from the previous month
const getClientCountPreviousMonth = async () => {
  const now = new Date();
  const firstDayOfPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );
  const lastDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  try {
    const clientCount = await User.countDocuments(
      {
        createdAt: {
          $gte: firstDayOfPreviousMonth,
          $lte: lastDayOfPreviousMonth,
        },
      },
      { role: 'cliente' }
    );

    return clientCount;
  } catch (error) {
    console.error('Error counting clients from the previous month:', error);
    throw error;
  }
};

export async function payPOSDrawer(data) {
  const session = await getServerSession(options);
  try {
    let { items, payType, amountReceived } = Object.fromEntries(data);

    await dbConnect();
    const userId = session?.user._id;
    items = JSON.parse(items);
    const branchInfo = 'Sucursal Sahuayo';
    const ship_cost = 0;
    const date = cstDateTime();
    const paymentInfo = {
      id: 'paid',
      status: 'paid',
      amountPaid: amountReceived,
      taxPaid: 0,
      paymentIntent: 'paid',
    };

    const cartItems = [];
    await Promise.all(
      items?.map(async (item) => {
        const variationId = item._id.toString();
        const product = await Product.findOne({
          'variations._id': variationId,
        });

        const variation = product.variations.find((variation) =>
          variation._id.equals(variationId)
        );
        // Check if there is enough stock
        if (variation.stock < item.quantity) {
          console.log('Este producto no cuenta con existencias');
          return {
            error: {
              title: { _errors: ['Este producto no cuenta con existencias'] },
            },
          };
        } else {
          cartItems.push({
            product: product._id,
            variation: variationId,
            name: item.title,
            color: item.color,
            size: item.size,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          });
        }
      })
    );
    let orderData = {
      user: userId,
      ship_cost,
      createdAt: date,
      branch: branchInfo,
      paymentInfo,
      orderItems: cartItems,
      orderStatus: 'Entregado',
      layaway: false,
      affiliateId: '',
    };
    let newOrder = await new Order(orderData);
    await newOrder.save();
    newOrder = JSON.stringify(newOrder);

    return { newOrder: newOrder };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getDashboard() {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let orders;
    let affiliates;
    let products;
    let clients;
    let posts;

    if (session) {
      if (session?.user?.role === 'manager') {
        orders = await Order.find({ orderStatus: { $ne: 'Cancelado' } })
          .sort({ createdAt: -1 }) // Sort in descending order of creation date
          .limit(5);
        affiliates = await Affiliate.find({ published: { $ne: 'false' } })
          .sort({ createdAt: -1 }) // Sort in descending order of creation date
          .limit(5);
        products = await Product.find({ published: { $ne: 'false' } })
          .sort({ createdAt: -1 }) // Sort in descending order of creation date
          .limit(5);
        clients = await User.find({ role: 'cliente' })
          .sort({ createdAt: -1 }) // Sort in descending order of creation date
          .limit(5);
        posts = await Post.find({ published: { $ne: 'false' } })
          .sort({ createdAt: -1 }) // Sort in descending order of creation date
          .limit(5);
      }
    }

    const totalOrderCount = await Order.countDocuments({
      orderStatus: { $ne: 'Cancelado' },
    });
    const totalAffiliateCount = await Affiliate.countDocuments({
      published: { $ne: 'false' },
    });
    const totalProductCount = await Product.countDocuments({
      published: { $ne: 'false' },
    });
    const totalClientCount = await User.countDocuments({ role: 'cliente' });
    const totalPostCount = await Post.countDocuments({
      published: { $ne: 'false' },
    });

    const orderCountPreviousMonth = await getDocumentCountPreviousMonth(Order);
    const affiliateCountPreviousMonth = await getDocumentCountPreviousMonth(
      Affiliate
    );
    const postCountPreviousMonth = await getDocumentCountPreviousMonth(Post);
    const clientCountPreviousMonth = await getClientCountPreviousMonth();

    orders = JSON.stringify(orders);
    affiliates = JSON.stringify(affiliates);
    products = JSON.stringify(products);
    clients = JSON.stringify(clients);
    posts = JSON.stringify(posts);

    return {
      orders: orders,
      affiliates: affiliates,
      products: products,
      clients: clients,
      posts: posts,
      totalOrderCount: totalOrderCount,
      orderCountPreviousMonth: orderCountPreviousMonth,
      totalAffiliateCount: totalAffiliateCount,
      affiliateCountPreviousMonth: affiliateCountPreviousMonth,
      totalProductCount: totalProductCount,
      totalClientCount: totalClientCount,
      clientCountPreviousMonth: clientCountPreviousMonth,
      totalPostCount: totalPostCount,
      postCountPreviousMonth: postCountPreviousMonth,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getOnePost(slug) {
  try {
    await dbConnect();

    let post = await Post.findOne({ slug: slug });
    const postCategory = post.category;
    // Find products matching any of the tag values
    let trendingProducts = await Product.find({
      'tags.value': postCategory,
    }).limit(4);

    // convert to string
    post = JSON.stringify(post);
    trendingProducts = JSON.stringify(trendingProducts);

    return { post: post, trendingProducts: trendingProducts };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getOnePage(category) {
  try {
    await dbConnect();
    let page = await Page.findOne({ category: category });
    // convert to string
    page = JSON.stringify(page);

    return { page: page };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function addNewPage(data) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };
  let {
    category,
    preTitle,
    mainTitle,
    subTitle,
    mainImage,
    sections,
    createdAt,
  } = Object.fromEntries(data);

  sections = JSON.parse(sections);
  createdAt = new Date(createdAt);
  // validate form data
  const result = PageEntrySchema.safeParse({
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
  const slug = generateUrlSafeTitle(mainTitle);

  const slugExists = await Page.findOne({ slug: slug });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ['Este Titulo de Pagina ya esta en uso'] },
      },
    };
  }
  const { error } = await Page.create({
    category,
    preTitle,
    mainTitle,
    subTitle,
    slug,
    mainImage,
    sections,
    createdAt,
    published: true,
    authorId: { _id: session?.user._id },
  });
  if (error) throw Error(error);
  revalidatePath('/');
}

export async function updatePage(data) {
  const session = await getServerSession(options);
  let {
    _id,
    category,
    preTitle,
    mainTitle,
    subTitle,
    mainImage,
    sections,
    createdAt,
  } = Object.fromEntries(data);
  sections = JSON.parse(sections);
  const updatedAt = new Date(createdAt);
  // validate form data
  const result = PageUpdateSchema.safeParse({
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
  const slug = generateUrlSafeTitle(mainTitle);
  const slugExists = await Page.findOne({
    slug: slug,
    _id: { $ne: _id },
  });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ['Este Titulo de Pagina ya esta en uso'] },
      },
    };
  }
  const { error } = await Page.updateOne(
    { _id },
    {
      category,
      preTitle,
      mainTitle,
      subTitle,
      slug,
      mainImage,
      sections,
      updatedAt,
      published: true,
      authorId: { _id: session?.user._id },
    }
  );
  if (error) throw Error(error);
  revalidatePath('/');
}

export async function getAllPost(searchQuery) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let postQuery;
    if (session) {
      if (session?.user?.role === 'manager') {
        postQuery = Post.find();
      }
    } else {
      postQuery = Post.find({ published: true });
    }

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = 10;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get('page')) || 1;
    // total number of documents in database
    const itemCount = await Post.countDocuments();
    // Extract all possible categories
    const allCategories = await Post.distinct('category');

    // Apply search Filters
    const apiPostFilters = new APIPostsFilters(postQuery, searchParams)
      .searchAllFields()
      .filter();

    let postsData = await apiPostFilters.query;

    const filteredPostsCount = postsData.length;

    // Pagination filter
    apiPostFilters.pagination(resPerPage, page);
    postsData = await apiPostFilters.query.clone();
    // If you want a new sorted array without modifying the original one, use slice
    // const sortedObj1 = obj1
    //   .slice()
    //   .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // descending order
    // descending order
    let sortedPosts = postsData
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    sortedPosts = JSON.stringify(sortedPosts);

    return {
      posts: sortedPosts,
      itemCount: itemCount,
      filteredPostsCount: filteredPostsCount,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getOneOrder(id) {
  const session = await getServerSession(options);

  try {
    await dbConnect();

    let order = await Order.findOne({ _id: id });
    let deliveryAddress = await Address.findOne(order.shippingInfo);

    // convert to string
    order = JSON.stringify(order);
    deliveryAddress = JSON.stringify(deliveryAddress);
    return { order: order, deliveryAddress: deliveryAddress };
    // return { product };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllOrder(searchQuery) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let orderQuery;
    if (session?.user?.role === 'manager') {
      orderQuery = Order.find({ orderStatus: { $ne: 'Cancelado' } });
    } else if (session?.user?.role === 'afiliado') {
      const affiliate = await Affiliate.findOne({ user: session?.user?._id });
      orderQuery = Order.find({
        affiliateId: affiliate?._id.toString(),
        orderStatus: { $ne: 'Cancelado' },
      });
    } else {
      orderQuery = Order.find({
        user: session?.user?._id,
        orderStatus: { $ne: 'Cancelado' },
      });
    }

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get('perpage')) || 5;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get('page')) || 1;
    // Apply descending order based on a specific field (e.g., createdAt)
    orderQuery = orderQuery.sort({ createdAt: -1 });
    const totalOrderCount = await Order.countDocuments();

    // Apply search Filters including order_id and orderStatus
    const apiOrderFilters = new APIOrderFilters(orderQuery, searchParams)
      .searchAllFields()
      .filter();
    let ordersData = await apiOrderFilters.query;

    const itemCount = ordersData.length;
    apiOrderFilters.pagination(resPerPage, page);
    ordersData = await apiOrderFilters.query.clone();

    // await Promise.all(
    //   ordersData.map(async (order) => {
    //     let shippingInfo = await Address.findOne({
    //       _id: order.shippingInfo,
    //     });
    //     let user = await User.findOne({ _id: order.user });
    //     order.shippingInfo = shippingInfo;
    //     order.user = user;
    //   })
    // );

    // ordersData = await ordersData
    //   .slice()
    //   .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    let orders = JSON.stringify(ordersData);

    return {
      orders: orders,
      totalOrderCount: totalOrderCount,
      itemCount: itemCount,
      resPerPage: resPerPage,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getOneProduct(slug, id) {
  const session = await getServerSession(options);

  try {
    await dbConnect();
    let product;
    if (id) {
      product = await Product.findOne({ _id: id });
    } else {
      product = await Product.findOne({ slug: slug });
    }

    let trendingProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);
    // convert to string
    product = JSON.stringify(product);
    trendingProducts = JSON.stringify(trendingProducts);
    return { product: product, trendingProducts: trendingProducts };
    // return { product };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getOnePOSProduct(variationId) {
  const session = await getServerSession(options);

  try {
    await dbConnect();
    // Find the product that contains the variation with the specified variation ID
    let product = await Product.findOne({ 'variations._id': variationId });

    if (product) {
      // Find the variation within the variations array
      let variation = product.variations.find(
        (variation) => variation._id.toString() === variationId
      );
      // Update the stock of the variation
      variation.stock -= 1; // Example stock update

      // Save the product to persist the changes
      await product.save();
      // convert to string
      product = JSON.stringify(product);
      variation = JSON.stringify(variation);
      console.log('Variation stock updated successfully');
      return { product: product, variation: variation };
    } else {
      console.log('Product not found');
      throw Error('Product not found');
    }
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllPOSProduct() {
  try {
    await dbConnect();
    // Find the product that contains the variation with the specified variation ID
    let products = await Product.find({});

    if (products) {
      products = JSON.stringify(products);
      return { products: products };
    } else {
      console.log('Product not found');
      throw Error('Product not found');
    }
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllProduct(searchQuery) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let productQuery;
    if (session) {
      if (session?.user?.role === 'manager') {
        productQuery = Product.find();
      }
    } else {
      productQuery = Product.find({ published: true });
    }

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get('perpage')) || 5;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get('page')) || 1;
    // total number of documents in database
    const productsCount = await Product.countDocuments();
    // Extract all possible categories
    let allCategories = await Product.distinct('category');
    // Extract all possible categories
    let allBrands = await Product.distinct('brand');
    // Apply search Filters
    const apiProductFilters = new APIFilters(productQuery, searchParams)
      .searchAllFields()
      .filter();

    let productsData = await apiProductFilters.query;

    const filteredProductsCount = productsData.length;

    apiProductFilters.pagination(resPerPage, page);
    productsData = await apiProductFilters.query.clone();

    // If you want a new sorted array without modifying the original one, use slice
    // const sortedObj1 = obj1
    //   .slice()
    //   .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // descending order
    // descending order
    let sortedProducts = productsData
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    sortedProducts = JSON.stringify(sortedProducts);
    allCategories = JSON.stringify(allCategories);
    allBrands = JSON.stringify(allBrands);

    return {
      products: sortedProducts,
      productsCount: productsCount,
      filteredProductsCount: filteredProductsCount,
      allCategories: allCategories,
      allBrands: allBrands,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllUserOrder(searchQuery, id) {
  const session = await getServerSession(options);

  try {
    await dbConnect();
    const session = await getServerSession(options);
    let orderQuery;
    if (session?.user?.role === 'manager') {
      orderQuery = Order.find({ orderStatus: { $ne: 'Cancelado' } });
    } else if (session?.user?.role === 'afiliado') {
      const affiliate = await Affiliate.findOne({ user: session?.user?._id });
      orderQuery = Order.find({
        affiliateId: affiliate?._id.toString(),
        orderStatus: { $ne: 'Cancelado' },
      });
    } else {
      orderQuery = Order.find({
        user: session?.user?._id,
        orderStatus: { $ne: 'Cancelado' },
      });
    }
    let client = await User.findOne({ _id: id });

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get('perpage')) || 5;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get('page')) || 1;
    // Apply descending order based on a specific field (e.g., createdAt)
    orderQuery = orderQuery.sort({ createdAt: -1 });
    const totalOrderCount = await Order.countDocuments();

    // Apply search Filters including order_id and orderStatus
    const apiOrderFilters = new APIOrderFilters(orderQuery, searchParams)
      .searchAllFields()
      .filter();
    let ordersData = await apiOrderFilters.query;

    const itemCount = ordersData.length;
    apiOrderFilters.pagination(resPerPage, page);
    ordersData = await apiOrderFilters.query.clone();

    // await Promise.all(
    //   ordersData.map(async (order) => {
    //     let shippingInfo = await Address.findOne({
    //       _id: order.shippingInfo,
    //     });
    //     let user = await User.findOne({ _id: order.user });
    //     order.shippingInfo = shippingInfo;
    //     order.user = user;
    //   })
    // );

    // ordersData = await ordersData
    //   .slice()
    //   .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    let orders = JSON.stringify(ordersData);
    client = JSON.stringify(client);

    return {
      orders: orders,
      client: client,
      totalOrderCount: totalOrderCount,
      itemCount: itemCount,
      resPerPage: resPerPage,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllClient(searchQuery) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let clientQuery;

    if (session) {
      if (session?.user?.role === 'manager') {
        clientQuery = User.find({ role: 'cliente' });
      }
    }

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get('perpage')) || 5;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get('page')) || 1;
    // total number of documents in database
    const clientsCount = await User.countDocuments();
    // Extract all possible categories
    // Apply search Filters
    const apiClientFilters = new APIClientFilters(clientQuery, searchParams)
      .searchAllFields()
      .filter();

    let clientsData = await apiClientFilters.query;

    const filteredClientsCount = clientsData.length;

    apiClientFilters.pagination(resPerPage, page);
    clientsData = await apiClientFilters.query.clone();

    // If you want a new sorted array without modifying the original one, use slice
    // const sortedObj1 = obj1
    //   .slice()
    //   .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // descending order
    // descending order
    let sortedClients = clientsData
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    let clients = JSON.stringify(sortedClients);

    return {
      clients: clients,
      clientsCount: clientsCount,
      filteredClientsCount: filteredClientsCount,
      resPerPage: resPerPage,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

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

export async function getAllAffiliate(searchQuery) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let affiliateQuery;

    if (session) {
      if (session?.user?.role === 'manager') {
        affiliateQuery = Affiliate.find({});
      }
    }

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get('perpage')) || 5;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get('page')) || 1;
    // total number of documents in database
    const affiliatesCount = await Affiliate.countDocuments();
    // Extract all possible categories
    // Apply search Filters
    const apiAffiliateFilters = new APIAffiliateFilters(
      affiliateQuery,
      searchParams
    )
      .searchAllFields()
      .filter();

    let affiliatesData = await apiAffiliateFilters.query;

    const filteredAffiliatesCount = affiliatesData.length;

    apiAffiliateFilters.pagination(resPerPage, page);
    affiliatesData = await apiAffiliateFilters.query.clone();

    // If you want a new sorted array without modifying the original one, use slice
    // const sortedObj1 = obj1
    //   .slice()
    //   .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // descending order
    // descending order
    let sortedAffiliates = affiliatesData
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    let affiliates = JSON.stringify(sortedAffiliates);

    return {
      affiliates: affiliates,
      affiliatesCount: affiliatesCount,
      filteredAffiliatesCount: filteredAffiliatesCount,
      resPerPage: resPerPage,
    };
  } catch (error) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllAffiliateOrder(searchQuery, id) {
  const session = await getServerSession(options);

  try {
    await dbConnect();
    const session = await getServerSession(options);
    let orderQuery;
    let affiliate;
    if (session) {
      orderQuery = Order.find({
        affiliateId: id,
        orderStatus: { $ne: 'Cancelado' },
      });
      affiliate = await Affiliate.findOne({ _id: id });
    }

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get('perpage')) || 5;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get('page')) || 1;
    // Apply descending order based on a specific field (e.g., createdAt)
    orderQuery = orderQuery.sort({ createdAt: -1 });
    const totalOrderCount = await Order.countDocuments();

    // Apply search Filters including order_id and orderStatus
    const apiOrderFilters = new APIOrderFilters(orderQuery, searchParams)
      .searchAllFields()
      .filter();
    let ordersData = await apiOrderFilters.query;

    const itemCount = ordersData.length;
    apiOrderFilters.pagination(resPerPage, page);
    ordersData = await apiOrderFilters.query.clone();

    // await Promise.all(
    //   ordersData.map(async (order) => {
    //     let shippingInfo = await Address.findOne({
    //       _id: order.shippingInfo,
    //     });
    //     let user = await User.findOne({ _id: order.user });
    //     order.shippingInfo = shippingInfo;
    //     order.user = user;
    //   })
    // );

    // ordersData = await ordersData
    //   .slice()
    //   .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    let orders = JSON.stringify(ordersData);
    affiliate = JSON.stringify(affiliate);

    return {
      orders: orders,
      affiliate: affiliate,
      totalOrderCount: totalOrderCount,
      itemCount: itemCount,
      resPerPage: resPerPage,
    };
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
  const slug = generateUrlSafeTitle(mainTitle);

  const slugExists = await Post.findOne({ slug: slug });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ['Este Titulo de publicación ya esta en uso'] },
      },
    };
  }
  const { error } = await Post.create({
    category,
    mainTitle,
    slug,
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
  const slug = generateUrlSafeTitle(mainTitle);
  const slugExists = await Post.findOne({ slug: slug, _id: { $ne: _id } });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ['Este Titulo de publicación ya esta en uso'] },
      },
    };
  }
  const { error } = await Post.updateOne(
    { _id },
    {
      category,
      mainTitle,
      slug,
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
  const slug = generateUrlSafeTitle(title);

  const slugExists = await Product.findOne({ slug: slug });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ['Este Titulo de producto ya esta en uso'] },
      },
    };
  }
  const { error } = await Product.create({
    type: 'variation',
    title,
    slug,
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

  const slug = generateUrlSafeTitle(title);
  const slugExists = await Product.findOne({ slug: slug, _id: { $ne: _id } });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ['Este Titulo de producto ya esta en uso'] },
      },
    };
  }
  const { error } = await Product.updateOne(
    { _id },
    {
      type: 'variation',
      title,
      slug,
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
  const slug = generateUrlSafeTitle(title);
  const slugExists = await Post.findOne({ slug: slug });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ['Este Titulo de producto ya esta en uso'] },
      },
    };
  }
  const { error } = await Product.create({
    type: 'simple',
    title,
    slug,
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
