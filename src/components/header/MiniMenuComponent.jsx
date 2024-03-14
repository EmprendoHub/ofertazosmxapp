'use client';
import React, { useContext } from 'react';
import Link from 'next/link';
import { IoMdCart, IoMdHeart } from 'react-icons/io';
import { AiOutlineUser, AiOutlineMail } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import { useSession, signOut } from 'next-auth/react';
import { useSelector } from 'react-redux';
import FormattedPrice from '@/backend/helpers/FormattedPrice';
import { useState, useEffect } from 'react';
import AuthContext from '@/context/AuthContext';
import Image from 'next/image';
import { IoQrCode } from 'react-icons/io5';

const MiniMenuComponent = () => {
  const { data: session } = useSession();
  const { setUser } = useContext(AuthContext);
  useEffect(() => {
    if (session) {
      setUser(session?.user);
    }
  }, [session, setUser]);

  const isLoggedIn = Boolean(session?.user);

  const { productsData, favoritesData, emailListData, qrListData } =
    useSelector((state) => state.compras);

  const [totalCartAmt, setTotalCartAmt] = useState(0);

  useEffect(() => {
    let amt = 0;
    productsData.map((item) => {
      amt += item.price * item.quantity;
      return;
    });
    setTotalCartAmt(amt);
  }, [productsData]);

  return (
    <div className="self-stretch flex flex-row px-1 box-border items-center justify-start  mx-auto relative">
      <nav className=" m-0 flex-1  flex flex-row pr-5 items-center  justify-end gap-x-3 font-poppins text-sm tracking-widest">
        {/* Login/Register */}
        {!session && (
          <Link
            href={'/iniciar'}
            className="maxmd:hidden cursor-pointer flex justify-center items-center gap-x-1"
          >
            <AiOutlineUser className="text-xl text-black hover:scale-110 ease-in-out duration-300" />
          </Link>
        )}
        {/* Admin */}
        {isLoggedIn && session?.user.role === 'manager' ? (
          <>
            <Link href={'/admin'}>
              {session?.user?.image ? (
                <Image
                  className="w-8 h-8 rounded-full "
                  src={
                    session?.user?.image ? session?.user?.image : '/next.svg'
                  }
                  alt={session?.user?.name ? session?.user?.name : 'avatar'}
                  width={50}
                  height={50}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center uppercase text-xl font-EB_Garamond">
                  {session?.user?.email.substring(0, 1)}
                </div>
              )}
            </Link>
          </>
        ) : session?.user?.role === 'sucursal' ? (
          <>
            <Link href={'/puntodeventa'}>
              {session?.user?.image ? (
                <Image
                  className="w-8 h-8 rounded-full "
                  src={
                    session?.user?.image ? session?.user?.image : '/next.svg'
                  }
                  alt={session?.user?.name ? session?.user?.name : 'avatar'}
                  width={50}
                  height={50}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center uppercase text-xl font-EB_Garamond">
                  {session?.user?.email.substring(0, 1)}
                </div>
              )}
            </Link>
          </>
        ) : (
          <>
            <Link href={'/perfil'}>
              {session?.user?.image ? (
                <Image
                  className="w-8 h-8 rounded-full "
                  src={
                    session?.user?.image ? session?.user?.image : '/next.svg'
                  }
                  alt={session?.user?.name ? session?.user?.name : 'avatar'}
                  width={50}
                  height={50}
                />
              ) : (
                <div className="w-8 h-8 rounded-full  bg-black text-white flex items-center justify-center uppercase text-xl font-EB_Garamond">
                  {session?.user?.email.substring(0, 1)}
                </div>
              )}
            </Link>
          </>
        )}

        {/* Cart Button */}
        {isLoggedIn &&
        session?.user.role != 'manager' &&
        session?.user?.role != 'sucursal' ? (
          <div className="flex items-center gap-x-3">
            <Link href={'/carrito'}>
              <div className="bg-gray-100 rounded-full text-slate-800  flex items-center justify-center  cursor-pointer">
                <IoMdCart className="text-xl" />
                <span className="bg-white text-black rounded-full font-bold text-xs relative  -top-2 flex items-center justify-center w-4 h-5 shadow-xl ">
                  {productsData ? productsData?.length : 0}
                </span>
              </div>
            </Link>
          </div>
        ) : (
          ''
        )}
        {isLoggedIn && session.user.role === 'sucursal' ? (
          <Link href={'/puntodeventa/qr/generador'}>
            <div className="  flex items-center justify-center  ease-in-out duration-300 cursor-pointer">
              <IoQrCode className="text-xl" />
              <span className="bg-white text-black rounded-full font-bold text-xs relative  -top-2 flex items-center justify-center w-4 h-5 shadow-xl ">
                {qrListData ? qrListData?.length : 0}
              </span>
            </div>
          </Link>
        ) : (
          <Link href={'/perfil/favoritos'}>
            <div className="  flex items-center justify-center  ease-in-out duration-300 cursor-pointer">
              <IoMdHeart className="text-xl" />
              <span className="bg-white text-black rounded-full font-bold text-xs relative  -top-2 flex items-center justify-center w-4 h-5 shadow-xl ">
                {favoritesData ? favoritesData?.length : 0}
              </span>
            </div>
          </Link>
        )}
        {/*  Emails Button */}
        {isLoggedIn && session?.user.role === 'manager' ? (
          <Link href={'/admin/correos'}>
            <div className="bg-gray-100 hover:bg-slate-100 rounded-full text-slate-800 hover:text-black relative flex items-center justify-center gap-x-1  border-[1px]  border-gray-100  ease-in-out duration-300 cursor-pointer">
              <AiOutlineMail className="text-2xl absolute" />
              <span className="bg-white text-black rounded-full font-bold text-xs relative -right-2 -top-2 flex items-center justify-center w-3 h-3 shadow-xl ">
                {emailListData ? emailListData?.length : 0}
              </span>
            </div>
          </Link>
        ) : (
          ''
        )}

        {/** Logout Button */}
        {isLoggedIn && (
          <div
            onClick={() => signOut()}
            className="maxmd:hidden cursor-pointer flex justify-center items-center gap-x-1 "
          >
            <FiLogOut className="text-xl flex text-black" />
          </div>
        )}
      </nav>
    </div>
  );
};

export default MiniMenuComponent;
