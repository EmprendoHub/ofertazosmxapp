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

export const metadata = {
  title: 'Shopout Mx',
  description: 'Ropa y accesorios de marca',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(options);
  return (
    <html lang="en">
      <body className={`overflow-x-hidden max-w-full`}>
        <CustomSessionProvider>
          <HeaderComponent />
          {children}
          {/* <FooterComponent /> */}
        </CustomSessionProvider>
        <BackToTopButton />
        {session && session?.user?.role === 'manager' ? '' : <WhatsAppButton />}
        <ToastContainer position="top-left" autoClose={1000} />
      </body>
    </html>
  );
}
