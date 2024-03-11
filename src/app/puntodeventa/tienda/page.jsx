import { getCookiesName } from '@/backend/helpers';
import { cookies } from 'next/headers';
import ServerPagination from '@/components/pagination/ServerPagination';
import ListPOSProducts from '@/components/products/ListPOSProducts';

export const metadata = {
  title: 'POS Shopout Mx',
  description: 'Punto de Venta Shopout Mx',
};

const getAllProducts = async (searchParams, currentCookies, perPage) => {
  try {
    const urlParams = {
      keyword: searchParams.keyword,
      page: searchParams.page,
      category: searchParams.category,
      brand: searchParams.brand,
      'rating[gte]': searchParams.rating,
      'price[lte]': searchParams.max,
      'price[gte]': searchParams.min,
    };
    // Filter out undefined values
    const filteredUrlParams = Object.fromEntries(
      Object.entries(urlParams).filter(([key, value]) => value !== undefined)
    );

    const searchQuery = new URLSearchParams(filteredUrlParams).toString();
    const URL = `${process.env.NEXTAUTH_URL}/api/products?${searchQuery}`;
    const res = await fetch(URL, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: currentCookies,
        perPage: perPage,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const TiendaPage = async ({ searchParams }) => {
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  let nextAuthSessionToken = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;

  const per_page = 10;
  const data = await getAllProducts(searchParams, currentCookies, per_page);

  //pagination
  let page = parseInt(searchParams.page, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = 10;
  const itemCount = data?.productsCount;
  const totalPages = Math.ceil(data.filteredProductsCount / perPage);
  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;
  const isPageOutOfRange = page > totalPages;
  const pageNumbers = [];
  const offsetNumber = 1;
  const products = data?.products.products;
  const allBrands = data?.allBrands;
  const allCategories = data?.allCategories;
  const filteredProductsCount = data?.filteredProductsCount;
  const search =
    typeof searchParams.search === 'string' ? searchParams.search : undefined;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      {/* <StoreHeroComponent /> */}
      <ListPOSProducts
        products={products}
        allBrands={allBrands}
        allCategories={allCategories}
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
