import ProductComponent from '@/components/products/ProductComponent';
import { getOneProduct } from '@/app/_actions';
import ProductDetailsComponent from '@/components/products/ProductDetailsComponent';

export async function generateMetadata({ params }, parent) {
  // fetch data
  const data = await getOneProduct(params.slug);
  const product = JSON.parse(data.product);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [`${product.variations[0].image}`, ...previousImages],
    },
  };
}

const ProductDetailsPage = async ({ params }) => {
  const data = await getOneProduct(params.slug);
  const product = JSON.parse(data.product);
  const trendingProducts = JSON.parse(data?.trendingProducts);
  return (
    <>
      <ProductDetailsComponent
        product={product}
        trendingProducts={trendingProducts}
      />
    </>
  );
};

export default ProductDetailsPage;
