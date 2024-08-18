"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionTextComponent from "../texts/SectionTextComponent";
import HeroTextComponent from "../texts/HeroTextComponent";
// Placeholder images
import InnerSectionTextComponent from "../texts/InnerSectionTextComponent";
import HeroColTextComponent from "../texts/HeroColTextComponent";

const AboutUsComponent = ({ acerca }) => {
  return (
    <div>
      <section className="min-h-[700px] flex flex-row maxsm:flex-col justify-center items-center grayscale">
        <div className="container mx-auto flex justify-center items-center text-center p-5 sm:py-20 text-white z-10">
          <HeroColTextComponent
            pretitle={acerca?.preTitle}
            title={acerca?.mainTitle}
            subtitle={acerca?.subTitle}
          />
        </div>
        <Image
          className="rounded-md object-cover"
          src={acerca?.mainImage}
          fill={true}
          sizes="(max-width: 1080px) 100vw, (max-width: 1200px) 100vw, 33vw"
          alt="imagen de portada"
        />
        {/* overlay */}
        <div className="min-h-[100%] absolute z-[1] min-w-[100%] top-0 left-0 bg-black bg-opacity-30" />
      </section>
      <section className="bg-gray-100 text-center py-12 my-20 w-[50%] maxmd:w-[90%] p-5 mx-auto">
        <div className="container mx-auto">
          <InnerSectionTextComponent
            title={acerca?.sections[0].boxes[0].title}
            paraOne={acerca?.sections[0].boxes[0].paragraphs[0].text}
          />
        </div>
      </section>
      <section className=" text-center py-12 my-20 w-[80%] maxsm:w-[95%] mx-auto">
        <div className="container mx-auto">
          <h3 className="text-6xl font-semibold font-EB_Garamond text-gray-800 mb-5">
            {acerca?.sections[1].boxes[0].title}
          </h3>
          <p className="text-gray-600 font-raleway font-semibold">
            {acerca?.sections[1].boxes[0].subTitle}
          </p>

          <div className="grid grid-cols-3 maxsm:grid-cols-1 gap-4 mt-5">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <Image
                src={acerca?.sections[1].boxes[1].images[0].url}
                width={100}
                height={100}
                alt="Icon"
                className="mx-auto mb-4 w-20 h-20 rounded-full grayscale"
              />

              <InnerSectionTextComponent
                title={acerca?.sections[1].boxes[1].title}
                paraOne={acerca?.sections[1].boxes[1].paragraphs[0].text}
              />
              <div className="mt-10" />
            </div>
            <div className="bg-white rounded-lg p-8 shadow-md">
              <Image
                src={acerca?.sections[1].boxes[2].images[0].url}
                width={100}
                height={100}
                alt="Icon"
                className="mx-auto mb-4 w-20 h-20 rounded-full grayscale"
              />

              <InnerSectionTextComponent
                title={acerca?.sections[1].boxes[2].title}
                paraOne={acerca?.sections[1].boxes[2].paragraphs[0].text}
              />
              <div className="mt-10" />
            </div>
            <div className="bg-white rounded-lg p-8 shadow-md">
              <Image
                src={acerca?.sections[1].boxes[3].images[0].url}
                width={100}
                height={100}
                alt="Icon"
                className="mx-auto mb-4 w-20 h-20 rounded-full grayscale"
              />

              <InnerSectionTextComponent
                title={acerca?.sections[1].boxes[3].title}
                paraOne={acerca?.sections[1].boxes[3].paragraphs[0].text}
              />
              <div className="mt-10" />
            </div>
          </div>
        </div>
      </section>
      <div className="flex flex-row w-[80%] maxmd:w-full maxmd:flex-col items-center mx-auto my-20 px-1">
        <section className="text-center w-1/2 maxmd:w-full">
          <div className="container mx-auto px-6 sm:px-3">
            <SectionTextComponent
              title={acerca?.sections[2].boxes[0].title}
              paraOne={acerca?.sections[2].boxes[0].paragraphs[0].text}
              paraTwo={acerca?.sections[2].boxes[0].paragraphs[1].text}
              btnText={acerca?.sections[2].boxes[0].button}
              btnUrl={`/contacto`}
            />
          </div>
        </section>

        <section className=" text-center w-1/2 maxmd:w-full maxmd:mt-5">
          {/* Image */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="flex gap-x-4 mt-2 justify-center"
          >
            <div className="bg-white rounded-lg p-4 shadow-md">
              <Image
                src={acerca?.sections[2].boxes[0].images[0].url}
                width={400}
                height={400}
                alt="Ofertazos MX"
                className="mx-auto mb-4 w-full h-full grayscale"
              />
            </div>
          </motion.div>
        </section>
      </div>

      <section className="min-h-[700px] flex flex-row maxsm:flex-col justify-center items-center grayscale">
        <div className="container mx-auto flex justify-center items-center text-center p-5 sm:py-20 text-white z-10">
          <HeroTextComponent
            title={acerca?.sections[3].boxes[0].title}
            subtitle={acerca?.sections[3].boxes[0].subTitle}
            btnText={acerca?.sections[3].boxes[0].button}
            btnUrl={`/tienda`}
          />
        </div>
        <Image
          className="rounded-md object-cover"
          src={acerca?.sections[3].boxes[0].images[0].url}
          fill={true}
          sizes="(max-width: 1080px) 100vw, (max-width: 1200px) 100vw, 33vw"
          alt="imagen de portada"
        />
        {/* overlay */}
        <div className="min-h-[100%] absolute z-[1] min-w-[100%] top-0 left-0 bg-black bg-opacity-30" />
      </section>
    </div>
  );
};

export default AboutUsComponent;
