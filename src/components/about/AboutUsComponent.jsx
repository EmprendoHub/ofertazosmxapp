"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionTextComponent from "../texts/SectionTextComponent";
import HeroTextComponent from "../texts/HeroTextComponent";
// Placeholder images
import InnerSectionTextComponent from "../texts/InnerSectionTextComponent";
import HeroColTextComponent from "../texts/HeroColTextComponent";

const AboutUsComponent = () => {
  return (
    <div>
      <section className="min-h-[700px] flex flex-row maxsm:flex-col justify-center items-center bg-[url('/images/shopout_about_us_cover.jpg')]  bg-cover bg-no-repeat bg-center bg-fixed grayscale">
        <div className='container mx-auto flex justify-center items-center text-center p-5 sm:py-20 text-white z-10'>
          <HeroColTextComponent
            pretitle={"Bienvenido a "}
            title={"Shopout MX,"}
            subtitle={"Tu destino exclusivo para la moda de lujo! "}
          />
        </div>
        {/* overlay */}
        <div className='min-h-[100%] absolute z-[1] min-w-[100%] top-0 left-0 bg-black bg-opacity-30' />
      </section>
      <section className='bg-gray-100 text-center py-12 my-20 w-[50%] maxmd:w-[90%] p-5 mx-auto'>
        <div className='container mx-auto'>
          <InnerSectionTextComponent
            title={"Experiencia Personalizada"}
            paraOne={
              "En Shopout MX, nos enorgullece ofrecer una experiencia de compra en línea única, donde la elegancia se encuentra con la conveniencia. Nos especializamos en llevar lo último de las marcas de lujo más codiciadas del mundo, como Gucci, Versace, Fendi y muchas más, directamente a tu puerta."
            }
          />
        </div>
      </section>
      <section className=' text-center py-12 my-20 w-[80%] maxsm:w-[95%] mx-auto'>
        <div className='container mx-auto'>
          <h3 className='text-4xl font-semibold font-EB_Garamond text-gray-800'>
            ¿Por qué elegirnos?
          </h3>
          <p className='text-gray-600 font-raleway'>
            {"En Shopout MX, nos dedicamos a brindar:"}
          </p>

          <div className='grid grid-cols-3 maxsm:grid-cols-1 gap-4 mt-5'>
            <div className='bg-white rounded-lg p-8 shadow-md'>
              <Image
                src={`/images/shopout_about_us_cover.jpg`}
                width={100}
                height={100}
                alt='Icon'
                className='mx-auto mb-4 w-15 h-15 rounded-full grayscale'
              />

              <InnerSectionTextComponent
                title='1. Autenticidad Garantizada: '
                paraOne={
                  "Cada producto que vendemos es auténtico y directamente adquirido de las casas de moda más prestigiosas del mundo. Puedes comprar con confianza, sabiendo que estás recibiendo productos genuinos y de alta calidad."
                }
              />
              <div className='mt-10' />
            </div>
            <div className='bg-white rounded-lg p-8 shadow-md'>
              <Image
                src={`/images/shopout_about_us_cover.jpg`}
                width={100}
                height={100}
                alt='Icon'
                className='mx-auto mb-4 w-15 h-15 rounded-full grayscale'
              />

              <InnerSectionTextComponent
                title='2. Variedad Exclusiva: '
                paraOne={
                  "Nuestra selección de marcas de lujo es cuidadosamente curada para ofrecer una variedad exclusiva de productos de moda. Desde elegantes bolsos hasta ropa de diseñador, tenemos todo lo que necesitas para expresar tu estilo único."
                }
              />
              <div className='mt-10' />
            </div>
            <div className='bg-white rounded-lg p-8 shadow-md'>
              <Image
                src={`/images/shopout_about_us_cover.jpg`}
                width={100}
                height={100}
                alt='Icon'
                className='mx-auto mb-4 w-15 h-15 rounded-full grayscale'
              />

              <InnerSectionTextComponent
                title='3. Atención Personalizada: '
                paraOne={
                  "En Shopout MX, valoramos a cada cliente y nos esforzamos por brindar un servicio personalizado. Nuestro equipo de atención al cliente está siempre dispuesto a ayudarte con cualquier pregunta o inquietud que puedas tener."
                }
              />
              <div className='mt-10' />
            </div>
          </div>
        </div>
      </section>
      <div className='flex flex-row w-[80%] maxmd:w-full maxmd:flex-col items-center mx-auto my-20 px-1'>
        <section className='text-center w-1/2 maxmd:w-full'>
          <div className='container mx-auto px-6 sm:px-3'>
            <SectionTextComponent
              title={" Nuestra Mision"}
              paraOne={
                "Nuestra misión es hacer que cada cliente se sienta como una estrella de la moda al proporcionar acceso a productos de alta calidad y estilo incomparable. "
              }
              paraTwo={
                "En Shopout MX, no solo vendemos ropa y accesorios de lujo, sino que también ofrecemos un servicio excepcional que eleva tu experiencia de compra a un nivel superior."
              }
              btnText={"Ponte en Contacto"}
              btnUrl={`/contacto`}
            />
          </div>
        </section>

        <section className=' text-center w-1/2 maxmd:w-full maxmd:mt-5'>
          {/* Image */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className='flex gap-x-4 mt-2 justify-center'
          >
            <div className='bg-white rounded-lg p-4 shadow-md'>
              <Image
                src='/images/shopout_about_us_cover.jpg'
                width={400}
                height={400}
                alt='Shoput MX'
                className='mx-auto mb-4 w-full h-full grayscale'
              />
            </div>
          </motion.div>
        </section>
      </div>

      <section
        className={`hero w-full h-[600px] bg-gray-100 text-center  bg-[url('/images/shopout_about_us_cover.jpg')]  bg-cover bg-no-repeat bg-center bg-fixed grayscale`}
      >
        <div className=' backdrop-brightness-50 w-full h-full items-center  justify-center flex px-40 maxmd:px-10 my-20'>
          <div className='container mx-auto'>
            <div className='container mx-auto text-white'>
              <HeroTextComponent
                title={"Únete a la experiencia de compra de lujo"}
                subtitle={"Descubre la moda de alta gama con solo un clic."}
                btnText={"Tienda en Linea"}
                btnUrl={`/tienda`}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsComponent;
