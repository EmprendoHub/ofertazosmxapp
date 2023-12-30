import React from 'react';
import { IoMdPhonePortrait, IoMdAt, IoMdLocate } from 'react-icons/io';

const IconListSectionComponent = ({
  mainTitle,
  textTitleOne,
  textTitleTwo,
  textTitleThree,
  textOne,
  textTwo,
  textThree,
  linkOne,
  linkTwo,
  linkThree,
  linkOneText,
  linkTwoText,
  linkThreeText,
}) => {
  return (
    <div className="relative h-full">
      <div className="mt-34 flex flex-row md:flex-col-reverse mx-auto my-14 w-[80%] md:w-[95%] relative items-center">
        <div className="flex flex-col w-full">
          <h2 className="text-3xl font-semibold text-gray-800 font-playfair-display mb-6">
            {mainTitle}
          </h2>
          <div className="flex flex-row gap-x-5 my-3">
            <div className="flex justify-center items-center w-[60px] h-[60px] p-2 rounded-full">
              <IoMdPhonePortrait className="w-[30px] h-[30px] text-gray-700" />
            </div>
            <div className="flex-col w-3/4">
              <div className="font-playfair-display text-2xl">
                {textTitleOne}
              </div>
              <div className="text-xs">{textOne}</div>
              <a href={linkOne} className="sm:text-sm font-bold">
                {linkOneText}
              </a>
            </div>
          </div>
          <div className="flex flex-row gap-x-5 my-3">
            <div className="flex justify-center items-center w-[60px] h-[60px]  p-2 rounded-full">
              <IoMdAt className="w-[30px] h-[30px] text-gray-700" />
            </div>
            <div className="flex-col w-3/4">
              <div className="font-playfair-display text-2xl">
                {textTitleTwo}
              </div>
              <div className="text-xs">{textTwo}</div>
              <a href={linkTwo} className="sm:text-sm font-bold">
                {linkTwoText}
              </a>
            </div>
          </div>
          <div className="flex flex-row gap-x-5 my-3">
            <div className="flex justify-center items-center w-[60px] h-[60px]  p-2 rounded-full">
              <IoMdLocate className="w-[30px] h-[30px] text-gray-700" />
            </div>
            <div className="flex-col w-3/4">
              <div className="font-playfair-display text-2xl">
                {textTitleThree}
              </div>
              <div className="text-xs">{textThree}</div>
              <a href={linkThree} className="sm:text-sm font-bold">
                {linkThreeText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconListSectionComponent;
