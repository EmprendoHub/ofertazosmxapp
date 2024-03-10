'use client';
import { addToPOSCart } from '@/redux/shoppingSlice';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

const POSScannerComponent = ({ product, variation }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  useEffect(() => {
    if (variation?.stock > 0) {
      dispatch(addToPOSCart(variation));
      if (pathname.includes('admin')) {
        router.push('/admin/pos/carrito');
      } else {
        router.push('/puntodeventa/carrito');
      }
    } else {
      Swal.fire({
        title: '¡Sin Existencias!',
        text: 'Este producto se vendió en la tienda en linea.',
        icon: 'error',
        confirmButtonColor: '#008000',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/puntodeventa/pedidos');
        }
      });
    }
  }, [product]);

  return (
    <div className="flex items-center justify-center h-screen">Cargando...</div>
  );
};

export default POSScannerComponent;
