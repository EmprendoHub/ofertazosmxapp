import HeaderComponent from '@/components/header/HeaderComponent';
import CustomSessionProvider from './SessionProvider';
import './css/globals.css';
import FooterComponent from '@/components/footer/FooterComponent';
import BackToTopButton from '@/components/buttons/BackToTopButton';
import WhatsAppButton from '@/components/buttons/WhatsAppButton';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getServerSession } from 'next-auth';
import { options } from './api/auth/[...nextauth]/options';
import CookieConsentComp from '@/components/cookies/CookieConsent';
import { getCookiesName } from '@/backend/helpers';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'Shopout Mx',
  description: 'Ropa y accesorios de marca',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(options);
  //set cookies
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);
  const cookie = `${cookieName}=${nextAuthSessionToken?.value}`;
  return (
    <html lang="en">
      <body className={`overflow-x-hidden max-w-full`}>
        <CustomSessionProvider>
          <HeaderComponent cookie={cookie} />
          {children}
          {/* <FooterComponent /> */}
        </CustomSessionProvider>
        <BackToTopButton />
        {session && session?.user?.role === 'manager' ? '' : <WhatsAppButton />}
        <CookieConsentComp />
        <ToastContainer position="top-left" autoClose={1000} />
      </body>
    </html>
  );
}
