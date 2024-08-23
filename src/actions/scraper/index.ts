"use server";

import { revalidatePath } from "next/cache";
import { scrapeAmazonProduct, scrapeMercadoLibreProduct } from "@/lib/scrarper";
import { connectToMongoDB } from "../../../utils/mongoose";
import Product from "@/lib/models/product.model";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "@/lib/utils";

export async function scraperAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    connectToMongoDB();
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
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        {
          price: scrapeProduct.currentPrice,
        },
      ];

      product = {
        ...scrapeProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
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
    connectToMongoDB();
    const product = await Product.findOne({ _id: productId });
    if (!product) return null;
    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  try {
    connectToMongoDB();
    const products = await Product.find();
    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectToMongoDB();
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
