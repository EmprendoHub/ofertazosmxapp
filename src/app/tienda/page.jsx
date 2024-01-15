import StoreHeroComponent from '@/components/hero/StoreHeroComponent';
import ListProducts from '@/components/products/ListProducts';
import { getCookiesName } from '@/backend/helpers';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'Tienda en linea Shopout Mx',
  description:
    'Ven y explora nuestra tienda en linea y descubre modelos exclusivos de marcas de alta gama.',
};

const getProducts = async (searchParams) => {
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
  try {
    const res = await fetch(URL, { next: { revalidate: 120 } });
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
  return (
    <>
      <StoreHeroComponent />
      <ListProducts
        searchParams={searchParams}
        currentCookies={currentCookies}
      />
    </>
  );
};

export default TiendaPage;
