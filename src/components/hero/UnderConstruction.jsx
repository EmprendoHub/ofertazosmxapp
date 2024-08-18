import React from "react";
import ImageOpacityMotion from "../motions/ImageOpacityMotion";
import TextUnderConstruction from "../motions/TextUnderConstruction";

const UnderConstruction = () => {
  return (
    <div
      className={`min-w-full min-h-[900px] maxmd:min-h-[700px] maxsm:min-h-[500px] relative flex flex-col justify-center items-center `}
    >
      <div className="z-20 w-full">
        <TextUnderConstruction
          title={"Ofertazos MX"}
          subtitle={"¡Muy Pronto...!"}
        />
      </div>
      <ImageOpacityMotion
        imgSrc={"/images/main_stylish_model.png"}
        imgWidth={650}
        imgHeight={650}
        className={"grayscale absolute bottom-0 z-10"}
      />

      <div className="h-full flex flex-wrap bg-gray-300 w-1/2 absolute bottom-0 right-0 z-0" />
      {/* overlay */}
      <div className="min-h-[100%] absolute z-[1] min-w-[100%] top-0 left-0 bg-black bg-opacity-30" />
    </div>
  );
};

export default UnderConstruction;
