import ServerPagination from '@/components/pagination/ServerPagination';
import ListPOSProducts from '@/components/products/ListPOSProducts';
import { getAllPOSProduct } from '@/app/_actions';

export const metadata = {
  title: 'Tienda Shopout Mx',
  description:
    'Ven y explora nuestra tienda en linea y descubre modelos exclusivos de marcas de alta gama.',
};

const TiendaPage = async ({ searchParams }) => {
  const data = await getAllPOSProduct(searchParams);
  //pagination
  let page = parseInt(searchParams.page, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = 10;
  const totalPages = Math.ceil(data.filteredProductsCount / perPage);
  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;
  const isPageOutOfRange = page > totalPages;
  const pageNumbers = [];
  const offsetNumber = 1;
  const products = JSON.parse(data?.products);
  const filteredProductsCount = data?.filteredProductsCount;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <ListPOSProducts
        products={products}
        filteredProductsCount={filteredProductsCount}
      />
      <ServerPagination
        isPageOutOfRange={isPageOutOfRange}
        page={page}
        pageNumbers={pageNumbers}
        prevPage={prevPage}
        nextPage={nextPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default TiendaPage;
