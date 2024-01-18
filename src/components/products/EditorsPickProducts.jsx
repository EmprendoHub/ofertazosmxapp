import React from 'react';
import EditorsSlider from './EditorsSlider';
import SectionTitle from '../texts/SectionTitle';

const fetchDetails = async () => {
  try {
    const URL_ALL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/productstrend`;
    const res_all = await fetch(URL_ALL, { cache: 'no-store' });
    const data_trending = await res_all.json();
    //let sliced_products = data_trending.products.slice(0, 50)
    let sliced_products = data_trending.products.map((product) => {
      return {
        _id: product._id,
        title: product.title,
        description: product.description,
        category: product.category,
        brand: product.brand,
        featured: product.featured,
        price: product.price,
        salesPrice: product.sale_price,
        images: product.images,
        sizes: product.sizes,
        rating: product.rating,
        quantity: product.quantity,
        sku: product.sku,
      };
    });
    return sliced_products;
  } catch (error) {
    console.log(error);
  }
};

const EditorsPickProducts = async () => {
  const allProducts = await fetchDetails();

  return (
    <>
      <div className="mx-auto flex flex-col justify-center items-center my-40 relative">
        <SectionTitle
          className="pb-10 text-5xl maxmd:text-3xl text-center"
          title={'Selección del Editor'}
          subtitle={
            'Descubre una selección excepcional de categorías cuidadosamente curadas que resaltan la sofisticación en cada detalle. Desde prendas de alta costura hasta accesorios que complementan tu estilo único, sumérgete en un mundo de opciones premium que elevan tu experiencia de moda a nuevas alturas.'
          }
        />
        <EditorsSlider allProducts={allProducts} />;
      </div>
    </>
  );
};

export default EditorsPickProducts;
