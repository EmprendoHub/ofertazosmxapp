import StoreHeroComponent from '@/components/hero/StoreHeroComponent';
import ListProducts from '@/components/products/ListProducts';
import { getCookiesName } from '@/backend/helpers';
import { cookies } from 'next/headers';
import axios from 'axios';

export const metadata = {
  title: 'Tienda Shopout Mx',
  description:
    'Ven y explora nuestra tienda en linea y descubre modelos exclusivos de marcas de alta gama.',
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
    const { data } = await axios.get(
      URL,
      {
        headers: {
          Cookie: currentCookies,
          perPage: perPage,
        },
      },
      { cache: 'no-cache' }
    );

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
  const page = searchParams['page'] ?? '1';
  const per_page = 10;
  const start = (Number(page) - 1) * Number(per_page); // 0, 5, 10 ...
  const end = start + Number(per_page); // 5, 10, 15 ...
  const productsData = await getAllProducts(
    searchParams,
    currentCookies,
    per_page
  );
  const products = productsData?.products.products;
  const allBrands = productsData?.allBrands;
  const allCategories = productsData?.allCategories;
  const filteredProductsCount = productsData?.filteredProductsCount;
  return (
    <>
      <StoreHeroComponent />
      <ListProducts
        products={products}
        allBrands={allBrands}
        allCategories={allCategories}
        filteredProductsCount={filteredProductsCount}
        per_page={per_page}
        start={start}
        end={end}
      />
    </>
  );
};

export default TiendaPage;
