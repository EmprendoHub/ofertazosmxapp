'use client';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ViewPostDetails = ({ post }) => {
  const imageRef = useRef(null);

  return (
    <div className="container-class maxsm:py-8">
      <main className="bg-gray-100 flex  flex-col items-center justify-between">
        <div className="w-full mx-auto wrapper-class gap-5 bg-slate-100 text-black bg-opacity-80 p-4 rounded-lg">
          <div className="flex flex-row maxsm:flex-col-reverse items-start justify-start gap-x-5  maxmd:py-4 maxmd:px-5 maxsm:px-0">
            <div className="image-class w-1/2 maxsm:w-full flex flex-col items-end justify-end">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="p-2  max-h-[300px] relative"
              >
                <Image
                  ref={imageRef}
                  src={
                    post?.images[0]
                      ? post?.images[0].url
                      : '/images/shopout_clothing_placeholder.webp'
                  }
                  alt="post image"
                  className="rounded-lg object-cover ease-in-out duration-500"
                  width={800}
                  height={800}
                />
              </motion.div>
            </div>
            <div className="content-class w-1/2 maxsm:w-full h-full ">
              <div className="flex flex-col items-start justify-start pt-10 maxsm:pt-2 gap-y-10 w-[90%] maxmd:w-full p-5 pb-10">
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-7xl font-semibold font-EB_Garamond">
                    {post?.title}
                  </p>

                  <div>
                    <p className="text-xs font-normal text-gray-600">
                      {post?.summary}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className=" font-bodyFont content-class"
                >
                  {post?.content ? post?.content : ''}
                </motion.div>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="text-sm text-lightText flex flex-col"
                >
                  <span>
                    Categoría:{' '}
                    <span className="t font-bodyFont">{post?.category}</span>
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewPostDetails;
