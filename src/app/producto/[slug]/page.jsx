import ProductComponent from '@/components/products/ProductComponent';
import { getOneProduct } from '@/app/_actions';

const ProductDetailsPage = async ({ params }) => {
  const data = await getOneProduct(params.slug);
  const product = JSON.parse(data.product);
  const trendingProducts = JSON.parse(data?.trendingProducts);
  return (
    <>
      <ProductComponent product={product} trendingProducts={trendingProducts} />
    </>
  );
};

export default ProductDetailsPage;
