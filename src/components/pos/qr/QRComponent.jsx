'use client';
import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { usePathname, useRouter } from 'next/navigation';

const QRComponent = () => {
  const [scanResult, setScanResult] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 500,
        height: 500,
      },
      fps: 5,
    });

    scanner.render(success, error);

    function success(result) {
      setScanResult(result);
      scanner.clear();
    }
    function error(err) {
      console.warn(err);
    }
  }, []);

  useEffect(() => {
    if (scanResult) {
      if (pathname.includes('admin')) {
        router.push(`/admin/pos/scan/${scanResult}`);
      } else {
        router.push(`/puntodeventa/scan/${scanResult}`);
      }
    }
  }, [scanResult]);

  return (
    <div className="container flex flex-col h-screen items-center justify-start mt-10  mx-auto">
      <div className=" flex flex-row w-full items-center justify-center">
        <h2 className="p-8 bg-slate-300 text-slate-600 text-center w-full uppercase font-semibold tracking-wide text-2xl font-sans">
          Scanner códigos QR
        </h2>
      </div>

      <div className=" flex flex-row  items-start justify-center text-center mt-8 gap-5 px-10">
        <div className="card w-full">
          <hr className="border border-slate-300 my-3" />
          {scanResult && scanResult !== null ? (
            <div>
              Success:{' '}
              <a
                href={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/${scanResult}`}
              >{`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/${scanResult}`}</a>
            </div>
          ) : (
            <div id="reader" className="w-[500px] min-h-[500px]"></div>
          )}
          <div className="card-footer">
            <h4 className="text-xl"> Resultado Webcam:</h4>
            <p>{scanResult}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRComponent;
