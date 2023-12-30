import React from 'react';
import LotteryCard from './LotteryCard';

const ListLotteries = async ({ lotteries }) => {
  return (
    <section className="flex flex-col items-center justify-center py-12 mx-auto px-20 maxmd:px-5 lg:px-5 mb-40 w-full">
      <h2 className="pb-5  text-3xl">Lista de productos Activos</h2>
      <div className=" mx-auto flex justify-center items-center w-full">
        <div className="flex maxmd:flex-col flex-row  w-[90%]">
          <div className=" w-full justify-center items-center gap-x-5">
            <main className=" grid grid-cols-4 lg:grid-cols-3 maxmd:grid-cols-2 sm:grid-cols-1 gap-8 ">
              {lotteries?.map((lottery, index) => (
                <LotteryCard lottery={lottery} key={index} />
              ))}
            </main>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListLotteries;
