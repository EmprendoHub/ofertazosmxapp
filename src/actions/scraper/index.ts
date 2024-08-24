"use server";

import { revalidatePath } from "next/cache";
import { scrapeAmazonProduct, scrapeMercadoLibreProduct } from "@/lib/scrarper";
import Product from "@/backend/models/Product";
import dbConnect from "@/lib/db";

export async function scraperAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    dbConnect();
    let scrapeProduct;
    if (productUrl.toLowerCase().includes("amazon")) {
      scrapeProduct = await scrapeAmazonProduct(productUrl);
    } else {
      scrapeProduct = await scrapeMercadoLibreProduct(productUrl);
    }

    console.log(scrapeProduct, "scrapeProduct");

    if (!scrapeProduct) return;

    let product = scrapeProduct;
    // Check if product is in DB

    const existingProduct = await Product.findOne({
      ASIN: scrapeProduct.ASIN,
    });

    if (existingProduct) {
      product = {
        ...scrapeProduct,
      };
    }

    const newProduct = await Product.findOneAndUpdate(
      { ASIN: scrapeProduct.ASIN },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/product/${newProduct._id}`);
  } catch (error: any) {
    console.log(error);

    throw new Error(
      `Failed to created/up´dated product: ${productUrl} we got error: ${error.message}`
    );
  }
}

export async function getProductById(productId: string) {
  try {
    dbConnect();
    const product = await Product.findOne({ _id: productId });
    if (!product) return null;
    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  try {
    dbConnect();
    const products = await Product.find();
    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    dbConnect();
    const currentProduct = await Product.findById(productId);

    if (!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}
