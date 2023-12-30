import React from "react";
import ImageStoreMotion from "../motions/ImageStoreMotion";

const StoreHeroComponent = () => {
  return (
    <div
      className={`max-w-full min-h-[400px] relative justify-center items-center maxmd:mx-0 mx-24`}
    >
      <ImageStoreMotion
        imgSrc={"/images/stylish-high-heels.jpg"}
        className={"grayscale  bottom-0 z-10 object-fit"}
      />
    </div>
  );
};

export default StoreHeroComponent;
