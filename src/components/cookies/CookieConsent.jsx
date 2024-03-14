'use client';
import { setCookie, hasCookie } from 'cookies-next';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const CookieConsentComp = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // If no consent cookie is present, show the consent popup
    if (!hasCookie('consent')) {
      setShowConsent(true);
    }
  }, []);

  const acceptConsent = () => {
    // When user accepts the consent, hide the popup and set a consent cookie
    setShowConsent(false);
    setCookie('consent', 'true');
  };

  if (!showConsent) {
    return null;
  }
  return (
    <div className="backdrop fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-[555]">
      <div className="ml-0 fixed bottom-1/4 maxsm:bottom-5 left-1/2 maxmd:left-1/3 w-full maxsm:w-[95%] maxmd:w-[97%] maxlg:w-1/2 maxxl:w-1/3 max-w-2xl py-16 p-8 m-4 flex flex-col items-center justify-center transform -translate-x-1/2 maxmd:-translate-x-1/3  bg-secondary-gradient text-black z-[888] mx-auto shadow-lg rounded-md ">
        <div className="bg-black min-h-12 absolute w-full top-0 left-0 z-[889] rounded-t-md " />
        <Image
          src={'/images/cookies_use_exercise.webp'}
          alt="Usamos Cookies"
          width={250}
          height={250}
          className="-mt-20 z-[890]"
        />
        <div className="flex flex-col items-center justify-center text-center ">
          <p>
            Utilizamos cookies para mejorar su experiencia. Utilizamos algunos{' '}
            <strong>paquetes de análisis estándar</strong> para comprender el
            comportamiento general del usuario, de modo que podamos descubrir
            cómo mejorar nuestro contenido. Al utilizar este sitio de forma
            continua, usted acepta dicho uso.
          </p>
          <div className="flex mt-2">
            <button
              onClick={acceptConsent}
              className="bg-black text-white text-lg px-6 py-2 rounded mr-2 tracking-wide mt-5"
            >
              Continuar
            </button>
          </div>
          <div onClick={acceptConsent} className="mt-3 text-sm tracking-wider">
            <Link href={'/politica'}>
              <p>Leer Mas...</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentComp;
