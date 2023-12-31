"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoMdCart } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { BsBookmarks } from "react-icons/bs";
import { GiTakeMyMoney } from "react-icons/gi";
import { useSession, signOut } from "next-auth/react";
import { useSelector } from "react-redux";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import { useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";

const CustomLink = ({ href, title, className = "" }) => {
  const router = useRouter();

  return (
    <Link href={href} className={`${className} relative group`}>
      {title}
      <span
        className={`h-[1px] inline-block bg-gradient-to-r from-amber-200 to-amber-500 group-hover:w-full transition-[width] ease duration-300 absolute left-0 bottom-0 ${
          router.asPath === href ? "w-full" : "w-0"
        }`}
      >
        &nbsp;
      </span>
    </Link>
  );
};

const MiniMenuComponent = () => {
  const { data: session } = useSession();
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    if (session) {
      setUser(session?.user);
    }
  }, [session, setUser]);

  const isLoggedIn = Boolean(session?.user);

  const { productsData, orderData } = useSelector((state) => state.compras);

  const [totalAmt, setTotalAmt] = useState(0);

  useEffect(() => {
    let amt = 0;
    productsData.map((item) => {
      amt += item.price * item.quantity;
      return;
    });
    setTotalAmt(amt);
  }, [productsData]);

  return (
    <div className='self-stretch flex flex-row px-1 box-border items-center justify-start  mx-auto relative'>
      <nav className=' m-0 flex-1  flex flex-row pr-5 items-center  justify-end gap-x-7 font-poppins text-sm tracking-widest'>
        {/* Login/Register */}
        {!session && (
          <Link
            href={"/iniciar"}
            className='maxmd:hidden cursor-pointer flex justify-center items-center gap-x-1'
          >
            <AiOutlineUser className='text-xl text-black hover:scale-110 ease-in-out duration-300' />
          </Link>
        )}
        {/* Admin */}
        {isLoggedIn && session?.user.role === "manager" ? (
          <Link href={"/admin"}>
            <div className='bg-gray-100 hover:bg-slate-100 rounded-full text-slate-800 hover:text-black flex items-center justify-center gap-x-1 px-1 py-1.5 border-[1px]  border-gray-100 hover:border-black ease-in-out duration-300 cursor-pointer'>
              <GiTakeMyMoney className='text-xl' />
              <p className='text-sm maxsm:hidden'>Admin</p>
            </div>
          </Link>
        ) : (
          ""
        )}
        {/* Cart Button */}
        <Link href={"/carrito"}>
          <div className='bg-gray-100 hover:bg-slate-100 rounded-full text-slate-800 hover:text-black flex items-center justify-center gap-x-1 px-1 py-1.5 border-[1px]  border-gray-100 hover:border-slate-600 ease-in-out duration-300 cursor-pointer'>
            <IoMdCart className='text-xl' />
            <p className='text-sm maxsm:hidden'>
              <FormattedPrice amount={totalAmt ? totalAmt : 0} />
            </p>
            <span className='bg-white text-black rounded-full font-bold text-xs relative -right-2 -top-2 flex items-center justify-center w-4 h-5 shadow-xl '>
              {productsData ? productsData?.length : 0}
            </span>
          </div>
        </Link>
        {/*  Order Button */}
        {/* {orderData?.order && orderData?.order.length > 0 && session && (
          <Link
            href={'/perfil/pedidos'}
            className="flex justify-center items-center gap-x-2"
          >
            <BsBookmarks />
            <p className="text-sm font-semibold">Ordenes</p>
          </Link>
        )} */}

        {/** Logout Button */}
        {isLoggedIn && (
          <div
            onClick={() => signOut()}
            className='maxmd:hidden cursor-pointer flex justify-center items-center gap-x-1 '
          >
            <FiLogOut className='text-xl flex text-black' />
          </div>
        )}
      </nav>
    </div>
  );
};

export default MiniMenuComponent;
