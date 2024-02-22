'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import qrcode from 'qrcode';

const QRGenerator = ({ products }) => {
  const [imageQR, setImageQR] = useState([]);
  useEffect(() => {
    products.forEach(async (product) => {
      product.variations.forEach(async (variation) => {
        const id = variation._id;
        const image = await qrcode.toDataURL(id);

        setImageQR((prevImageQrs) => {
          const newQr = {
            id: id,
            qr: image,
            title: variation.title,
            size: variation.size,
            color: variation.color,
            stock: variation.stock,
          };
          return [...prevImageQrs, newQr];
        });
      });
    });
  }, []);

  return (
    <div className="container flex flex-col h-screen items-center justify-start mt-10  mx-auto">
      <div className=" flex flex-row w-full items-center justify-center">
        <h2 className="p-8 bg-slate-300 text-slate-600 text-center w-full uppercase font-semibold tracking-wide text-2xl font-sans">
          Generador de códigos QR
        </h2>
      </div>

      <div className=" flex flex-row flex-wrap  items-start justify-center text-center mt-8 gap-5 px-10 w-full">
        <div className="card w-full">
          <div className="card-header">
            <h3 className="badges bg-slate-500 text-slate-300 p-5">
              Código QR
            </h3>
          </div>
          <hr className="border border-slate-300 my-3" />
          <div className="card-body w-full flex flex-wrap">
            {imageQR.length > 0 &&
              imageQR.map((item, index) => (
                <div key={index}>
                  <Image
                    src={item.qr}
                    alt="qr code img here"
                    width={250}
                    height={250}
                  />
                  <p>{item.stock}</p>
                  <p>{item.title}</p>
                  <p>{item.id}</p>
                  <p>
                    {item.size} / {item.color}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
