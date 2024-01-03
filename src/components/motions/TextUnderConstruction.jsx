'use client';
import { motion } from 'framer-motion';

const TextUnderConstruction = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`${className} `}>
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className=" w-full text-center leading-none font-EB_Garamond text-[16rem] maxmd:text-[12rem] maxsm:text-[8rem]"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-slate-100 text-center font-raleway text-[8rem] maxmd:text-[6rem] maxsm:text-[4rem] w-full pb-10 "
      >
        {subtitle}
      </motion.p>
    </div>
  );
};

export default TextUnderConstruction;
