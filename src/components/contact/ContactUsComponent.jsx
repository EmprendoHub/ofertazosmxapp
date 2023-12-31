import React from "react";
import BoxesSectionTitle from "../texts/BoxesSectionTitle";
import Image from "next/image";
import EmailForm from "../forms/EmailForm";

const ContactUsComponent = () => {
  //email js service Ids
  const templateid = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const serviceid = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const publickey = process.env.REACT_APP_EMAILJS_PUB_KEY;
  return (
    <div className='flex flex-row maxmd:flex-col py-20 w-[90%] justify-center items-center mx-auto'>
      <div className='w-full maxmd:w-full z-10  maxmd:px-5 maxsm:px-1'>
        <div className=' pb-20 w-full'>
          <h2>
            <BoxesSectionTitle
              className='mb-5 text-3xl'
              title={"Envía un mensaje"}
              subtitle={"Mándanos un mensaje y en corto nos comunicaremos"}
            />
          </h2>
          <EmailForm
            templateID={templateid}
            serviceID={serviceid}
            publicKEY={publickey}
          />
        </div>
      </div>
      <div className='w-1/2 maxmd:w-full z-10 justify-center mx-auto items-center flex'>
        <Image
          src={"/images/shopout_about_us_cover.jpg"}
          width={1000}
          height={100}
          alt='Contactar al equipo de Shopout MX'
          className='grayscale'
        />
      </div>
    </div>
  );
};

export default ContactUsComponent;
