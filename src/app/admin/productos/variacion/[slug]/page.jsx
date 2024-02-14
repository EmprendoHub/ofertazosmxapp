import EditVariationProduct from '@/components/admin/EditVariationProduct';
import { getOneProduct } from '@/app/_actions';

const ProductDetailsPage = async ({ params }) => {
  const data = await getOneProduct(params.slug);
  const product = JSON.parse(data.product);

  return <EditVariationProduct product={product} />;
};

export default ProductDetailsPage;
