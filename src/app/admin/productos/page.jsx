import React from "react";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import AllProductsComponent from "@/components/products/AllProductsComponent";

const getProducts = async () => {
  const session = await getServerSession(options);
  const URL = `${process.env.NEXTAUTH_URL}/api/products`;
  const res = await fetch(
    URL,
    { cache: "no-cache" },
    {
      headers: {
        "X-Mysession-Key": JSON.stringify(session),
      },
    }
  );
  const data = await res.json();
  return data.products;
};

const ProfilePage = async () => {
  const products = await getProducts();
  return <AllProductsComponent products={products} />;
};

export default ProfilePage;
