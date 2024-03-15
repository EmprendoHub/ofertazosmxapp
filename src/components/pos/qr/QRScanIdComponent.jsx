'use client';
import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { usePathname, useRouter } from 'next/navigation';
import './qrstyles.css';

const QRScanIdComponent = () => {
  const [scanResult, setScanResult] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 500,
        height: 500,
      },
      fps: 10,
    });

    scanner.render(success, error);

    function success(result) {
      const parts = result.split('-');
      const variationId = parts[0];
      setScanResult(variationId);
      scanner.clear();
    }
    function error(err) {
      console.warn(err);
    }
  }, []);

  useEffect(() => {
    if (scanResult) {
      if (pathname.includes('admin')) {
        router.push(`/admin/pos/scanid/${scanResult}`);
      } else {
        router.push(`/puntodeventa/scanid/${scanResult}`);
      }
    }
  }, [scanResult]);

  return (
    <div className="container flex flex-col h-screen items-center justify-start mt-2  mx-auto">
      <div className=" flex flex-row w-full items-center justify-center">
        <h2 className=" text-slate-700 text-center w-full uppercase font-semibold tracking-wide text-2xl font-EB_Garamond">
          Scanner
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
            <div
              id="reader"
              className="w-[500px] min-h-[500px] maxsm:w-[200px] maxsm:h-[250px]"
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanIdComponent;
