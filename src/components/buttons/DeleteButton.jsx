import React from 'react';
import { useConfirmationModalContext } from '../modals/modalConfirmationContext';
import Image from 'next/image';

const DeleteButton = ({ children, className, product, onClick }) => {
  const modalContext = useConfirmationModalContext();

  const handleOnClick = async (event) => {
    const result = await modalContext.showConfirmation(
      <div className=" flex flex-col items-center justify-center">
        <h2 className="text-2xl mb-5">Confirmar Borrado!</h2>
        <div className="border-red-800 border-2 p-3">
          <p className=" flex flex-col items-center justify-center">
            ¿Estás seguro(a) de que quieres eliminar?
            <br />
            <strong>
              {product.title} - {product._id}
            </strong>
            de la base de datos?
          </p>
          <Image
            alt="delete"
            width="100"
            height={100}
            style={{ display: 'block', margin: '0 auto' }}
            src="/images/Danger-Sign-PNG-Transparent.png"
          />
        </div>
      </div>
    );
    result && onClick && onClick(event);
  };

  return (
    <button className={className} onClick={handleOnClick}>
      {children}
    </button>
  );
};

export default DeleteButton;
