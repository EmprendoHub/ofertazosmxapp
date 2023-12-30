import React from "react";
import ContactUsComponent from "./ContactUsComponent";
import IconListSectionComponent from "./IconListSectionComponent";
import HeroColTextComponent from "../texts/HeroColTextComponent";

const ContactComponent = () => {
  return (
    <>
      <div>
        <section className="min-h-[700px] flex flex-row maxsm:flex-col justify-center items-center bg-[url('/images/medium-shot-woman-wardrobe-renovation.jpg')]  bg-cover bg-no-repeat bg-center bg-fixed grayscale">
          <div className='container mx-auto flex justify-center items-center text-center p-5 sm:py-20 text-white z-10'>
            <HeroColTextComponent
              pretitle={"Bienvenido a Shopout MX"}
              title={"CONTACTO"}
              subtitle={"Tu destino exclusivo para la moda de lujo! "}
            />
          </div>
          {/* overlay */}
          <div className='min-h-[100%] absolute z-[1] min-w-[100%] top-0 left-0 bg-black bg-opacity-30' />
        </section>

        <section className='bg-white py-12 px-20 sm:px-5'>
          <div className='w-full flex flex-row maxmd:flex-col justify-center items-center'>
            <div className='w-1/3 pl-20 maxmd:pl-0 text-lg text-gray-600 '>
              <IconListSectionComponent
                mainTitle={"Información de Contacto"}
                textTitleOne={"Teléfono"}
                textOne={"Platiquemos marca ahora mismo"}
                linkOne={"tel:523531332430"}
                linkOneText={"(+52)353-133-2430"}
                textTitleTwo={"Correo Electrónico"}
                textTwo={"Manda un mensaje para resolver tus dudas"}
                linkTwo={"mailto:contacto@shopout.com.mx"}
                linkTwoText={"contacto@shopout.com.mx"}
                textTitleThree={"Oficinas"}
                textThree={"No contamos con existencias en oficinas"}
                linkThree={
                  "https://www.google.com/maps/dir//36.1584611,-115.140488/@36.158461,-115.140488,15z?hl=en-MX"
                }
                linkThreeText={
                  "Juan Escutia 25, Sahuayo de Morelos, Michoacan 59053"
                }
              />
            </div>

            <div className='w-2/3 pb-10 pl-20 sm:pl-10  flex flex-col justify-start items-start'>
              <h3 className='pb-4 font-playfair-display text-xl'>
                {"Ubicación Oficinas"}
              </h3>
              <div className='w-[100%] px-3map-class'>
                <iframe
                  className='border-none grayscale'
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3747.8420733851167!2d-102.7274978!3d20.057056599999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842efcb2dbd40ac5%3A0x197c824b03a2d9a5!2sJuan%20Escutia%2025%2C%20Centro%20Cuatro%2C%2059000%20Sahuayo%20de%20Morelos%2C%20Mich.!5e0!3m2!1ses-419!2smx!4v1703971976010!5m2!1ses-419!2smx'
                  width='100%'
                  height='450'
                  allowFullScreen=''
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        <ContactUsComponent />
      </div>
    </>
  );
};

export default ContactComponent;
