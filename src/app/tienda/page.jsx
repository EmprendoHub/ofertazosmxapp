import StoreHeroComponent from '@/components/hero/StoreHeroComponent';
import ListProducts from '@/components/products/ListProducts';
import { getCookiesName } from '@/backend/helpers';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'Tienda en linea Shopout Mx',
  description:
    'Ven y explora nuestra tienda en linea y descubre modelos exclusivos de marcas de alta gama.',
};

const TiendaPage = async ({ searchParams }) => {
  const nextCookies = cookies();
  console.log(nextCookies);
  const cookieName = getCookiesName();
  let nextAuthSessionToken = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;
  console.log(currentCookies);
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
