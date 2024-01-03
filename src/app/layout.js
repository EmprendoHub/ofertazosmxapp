import HeaderComponent from '@/components/header/HeaderComponent';
import CustomSessionProvider from './SessionProvider';
import './css/globals.css';
import FooterComponent from '@/components/footer/FooterComponent';
import BackToTopButton from '@/components/buttons/BackToTopButton';
import WhatsAppButton from '@/components/buttons/WhatsAppButton';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'Shopout Mx',
  description: 'Ropa y accesorios de marca',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`overflow-x-hidden`}>
        <CustomSessionProvider>
          <HeaderComponent />
          {children}
          {/* <FooterComponent /> */}
        </CustomSessionProvider>
        <BackToTopButton />
        <WhatsAppButton />
        <ToastContainer position="top-left" autoClose={1000} />
      </body>
    </html>
  );
}
