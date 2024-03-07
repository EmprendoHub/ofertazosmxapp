import Image from 'next/image';

const WhiteLogoComponent = ({ className }) => {
  return (
    <div className="p-3 maxsm:p-1 pl-5 relative flex flex-col items-center justify-center max-w-fit">
      <h1 className="flex font-black font-EB_Garamond text-[1.5rem] maxmd:text-[1rem] leading-none">
        SHOPOUT
      </h1>
      <div className="flex flex-row items-center justify-center ">
        <div className="text-xs">----</div>
        <p className="text-[1rem] maxmd:text-[0.5rem] leading-none font-EB_Garamond">
          MX
        </p>
        <div className="text-xs">----</div>
      </div>
    </div>
  );
};

export default WhiteLogoComponent;
