'use client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, tienda } from '@/redux/store';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/context/AuthContext';

const CustomSessionProvider = ({ children }) => {
  return (
    <Provider store={tienda}>
      <AuthProvider>
        <PersistGate persistor={persistor}>
          <SessionProvider>{children}</SessionProvider>
        </PersistGate>
      </AuthProvider>
    </Provider>
  );
};

export default CustomSessionProvider;
