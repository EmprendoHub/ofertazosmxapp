"use client";

import { getCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";

const MercadoLibreProducto = () => {
  const accessToken = getCookie("mercadotoken");
  const [listing, setListing]: any = useState(null);
  // Usage
  const itemData = {
    title: "Item de test - No Ofertar",
    category_id: "MLM3530",
    price: 350,
    currency_id: "MXN",
    available_quantity: 10,
    buying_mode: "buy_it_now",
    condition: "new",
    listing_type_id: "gold_special",
    sale_terms: [
      {
        id: "WARRANTY_TYPE",
        value_name: "Garantía del vendedor",
      },
      {
        id: "WARRANTY_TIME",
        value_name: "90 días",
      },
    ],
    pictures: [
      {
        source:
          "http://mla-s2-p.mlstatic.com/968521-MLA20805195516_072016-O.jpg",
      },
    ],
    attributes: [
      {
        id: "BRAND",
        value_name: "Marca del producto",
      },
      {
        id: "EAN",
        value_name: "7898095297749",
      },
    ],
  };
  const createItem = async () => {
    try {
      const response = await fetch("https://api.mercadolibre.com/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: "Item de test Tres - No Ofertar",
          category_id: "MLM3530",
          price: 299,
          currency_id: "MXN",
          available_quantity: 50,
          buying_mode: "buy_it_now",
          condition: "new",
          listing_type_id: "gold_special",
          sale_terms: [
            {
              id: "WARRANTY_TYPE",
              value_name: "Garantía del vendedor",
            },
            {
              id: "WARRANTY_TIME",
              value_name: "15 días",
            },
          ],
          pictures: [
            {
              source:
                "http://mla-s2-p.mlstatic.com/968521-MLA20805195516_072016-O.jpg",
            },
          ],
          attributes: [
            {
              id: "BRAND",
              value_name: "Marca del producto",
            },
          ],
        }),
      });

      if (!response.ok) {
        console.log(await response.json(), "response");
        throw new Error("Failed to create item");
      }

      const data = await response.json();
      console.log("Item created:", data);
      setListing(data);
    } catch (error) {
      console.error("Error creating item:", error);
      throw error;
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Image
        src={"/icons/mercadolibre-svgrepo-com.svg"}
        alt="MercadoLibre"
        width={200}
        height={200}
        className="w-[80px] h-[80px}"
      />
      <div className="flex flex-col items-center justify-center">
        <p>{itemData.title}</p>
        <p>{itemData.category_id}</p>
        <p>{itemData.price}</p>
      </div>
      <Button onClick={createItem} size={"sm"}>
        Add new Listing
      </Button>
      {listing && <p>Listing ID: {listing.id}</p>}
    </div>
  );
};

export default MercadoLibreProducto;
