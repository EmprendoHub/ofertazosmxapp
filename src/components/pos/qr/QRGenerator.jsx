'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import qrcode from 'qrcode';

const QRGenerator = ({ products }) => {
  const [imageQR, setImageQR] = useState([]);
  const print = () => window.print();
  useEffect(() => {
    products.forEach(async (product) => {
      product.variations.forEach(async (variation) => {
        const id = variation._id;
        const image = await qrcode.toDataURL(id);
        if (variation.stock > 1) {
          for (let i = 1; i < variation.stock; i++) {
            setImageQR((prevImageQrs) => {
              const newQr = {
                id: id,
                qr: image,
                title: variation.title,
                size: variation.size,
                color: variation.color,
                stock: variation.stock,
                amount: `${i}/${variation.stock}`,
              };
              return [...prevImageQrs, newQr];
            });
          }
        }

        setImageQR((prevImageQrs) => {
          const newQr = {
            id: id,
            qr: image,
            title: variation.title,
            size: variation.size,
            color: variation.color,
            stock: variation.stock,
            amount: `${variation.stock}/${variation.stock}`,
          };
          return [...prevImageQrs, newQr];
        });
      });
    });
  }, []);

  return (
    <div className="container flex flex-col h-screen items-center justify-start mt-10 print:mt-0 print:mx-0 mx-auto">
      <div className=" flex flex-row w-full items-center justify-center print:hidden">
        <h2 className="p-8 bg-slate-300 text-slate-600 text-center w-full uppercase font-semibold tracking-wide text-2xl font-sans">
          Generador de códigos QR
        </h2>
      </div>
      <button className="printButton  print:hidden" onClick={print}>
        Imprimir QR&apos;s
      </button>
      <div className=" text-center mt-8 print:mt-0  w-full">
        <div className="card w-full">
          <hr className="border border-slate-300 my-3" />
          <div className="card-body w-full relative flex flex-wrap text-sm">
            {imageQR.length > 0 &&
              imageQR.map((item, index) => (
                <div key={index}>
                  <Image
                    src={item.qr}
                    alt="qr code img here"
                    width={150}
                    height={150}
                    className="mx-auto text-center object-cover w-full h-auto"
                  />
                  <p className="break-words w-[80%] mx-auto text-sm">
                    {item.amount}
                  </p>
                  <p className="break-words w-[80%] mx-auto text-sm">
                    {item.title.substring(0, 13)}...
                  </p>
                  <p className="break-words w-[80%] mx-auto text-sm">
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
