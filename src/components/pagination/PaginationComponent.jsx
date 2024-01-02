'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
  FiChevronsLeft,
} from 'react-icons/fi';

const PaginationControllerComponent = ({
  totalProductCount,
  hasNextPage,
  hasPrevPage,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchParamsCopy = {};
  searchParams.forEach((value, key) => {
    searchParamsCopy[key] = value;
  });

  const removeFields = ['per_page', 'page'];
  removeFields.forEach((el) => delete searchParamsCopy[el]);

  const prevSearchParams =
    `/tienda?` + new URLSearchParams(searchParamsCopy).toString();
  const page = searchParams.get('page') ?? '1';
  const per_page = searchParams.get('per_page') ?? '10';

  return (
    <div className="py-8 paginate-container flex mx-auto item text-center flex-row justify-center gap-x-5 sm:gap-x-2 items-center">
      <button
        className="bg-black disabled:bg-slate-300 text-white p-2 rounded-full text-xl"
        onClick={() => {
          router.push(`${prevSearchParams}&page=1&per_page=${per_page}`);
        }}
        disabled={!hasPrevPage}
      >
        <FiChevronsLeft />
      </button>
      <button
        className="bg-black disabled:bg-slate-300 text-white p-2 rounded-full text-xl"
        onClick={() => {
          router.push(
            `${prevSearchParams}&page=${Number(page) - 1}&per_page=${per_page}`
          );
        }}
        disabled={!hasPrevPage}
      >
        <FiChevronLeft />
      </button>

      <div className="font-semibold text-lg sm:text-sm">
        {page} / {Math.ceil(totalProductCount / Number(per_page))}
      </div>

      <button
        className="bg-black text-xl text-white p-2 rounded-full disabled:bg-slate-300"
        onClick={() => {
          router.push(
            `${prevSearchParams}&page=${Number(page) + 1}&per_page=${per_page}`
          );
        }}
        disabled={!hasNextPage}
      >
        <FiChevronRight />
      </button>
      <button
        className="bg-black disabled:bg-slate-300 text-white p-2  rounded-full text-xl"
        onClick={() => {
          router.push(
            `${prevSearchParams}&page=${Math.ceil(
              totalProductCount / Number(per_page)
            )}&per_page=${per_page}`
          );
        }}
        disabled={!hasNextPage}
      >
        <FiChevronsRight />
      </button>
    </div>
  );
};

export default PaginationControllerComponent;
