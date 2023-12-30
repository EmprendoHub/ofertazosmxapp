'use client';

import Image from 'next/image';
import { IoIosStar, IoMdHeart, IoMdCart } from 'react-icons/io';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormattedPrice from '@/helpers/FormattedPrice';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/shoppingSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LotteryCard = ({ lottery }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const startArray = Array.from(
    { length: lottery?.opportunity },
    (_, index) => (
      <span key={index} className="text-yellow-500">
        <IoIosStar />
      </span>
    )
  );

  return (
    <div className="w-full  overflow-hidden ">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.0 }}
        className="border-[1px] border-blue-400 rounded-lg bg-slate-100 text-black"
      >
        <Link href={`/producto/${lottery._id}`}>
          <div className="w-full h-[300px] group overflow-hidden relative">
            <Image
              src={lottery?.images[0] ?? '/images/vw_GTI_2024_2.jpg'}
              alt="product image"
              className="w-full h-full object-cover group-hover:scale-110 duration-200 rounded-t-lg"
              width={500}
              height={500}
            />
          </div>
        </Link>
        <div className=" px-4 py-4 flex flex-col rounded-b-lg">
          {/* star icons
            <div className="flex items-center gap-x-1">{startArray}</div> */}
          <p className=" tracking-widest">{lottery?.name}</p>

          <div className="flex items-center justify-between my-5">
            {/* add to cart button */}
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.9 }}
              className="bg-blue-600 px-4 py-2 text-sm flex flex-row justify-between gap-x-2 items-center tracking-wide rounded-full text-slate-100 hover:bg-black hover: duration-500"
              onClick={() =>
                dispatch(addToCart(lottery)) &&
                toast.success(
                  `${lottery?.name.substring(0, 15)} se agrego al carrito!`,
                  {
                    position: toast.POSITION.TOP_CENTER,
                    className: 'foo-bar',
                    theme: 'dark',
                    transition: Bounce,
                  }
                ) &&
                router.push('/carrito')
              }
            >
              Agregar a carrito
              <IoMdCart className="" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LotteryCard;
