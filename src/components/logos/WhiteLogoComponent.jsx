import Link from 'next/link';
import Image from 'next/image';

const WhiteLogoComponent = ({ className }) => {
  return (
    <Link href={`/`}>
      <div className="p-3 hover:scale-75 ease-in-out duration-300 pl-5 relative flex flex-col items-center justify-center max-w-fit">
        <h1 className="flex font-black font-EB_Garamond text-[1.5rem] leading-none">
          SHOPOUT
        </h1>
        <div className="flex flex-row items-center justify-center ">
          <div className="text-xs">--------</div>
          <p className="text-[1rem] leading-none font-EB_Garamond"> MX </p>
          <div className="text-xs">--------</div>
        </div>
      </div>
    </Link>
  );
};

export default WhiteLogoComponent;
