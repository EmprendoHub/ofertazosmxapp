'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
  FiChevronsLeft,
} from 'react-icons/fi';

const AdminPagination = ({
  totalItemCount,
  hasNextPage,
  hasPrevPage,
  perPage,
}) => {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ?? '1';
  const per_page = searchParams.get('per_page') ?? perPage;

  const baseUrl = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${path}`;

  const searchParamsCopy = {};
  searchParams.forEach((value, key) => {
    searchParamsCopy[key] = value;
  });

  const removeFields = ['per_page', 'page'];
  removeFields.forEach((el) => delete searchParamsCopy[el]);

  const prevSearchParams =
    `${baseUrl}?` + new URLSearchParams(searchParamsCopy).toString();

  return (
    <div className="py-8 paginate-container flex mx-auto item text-center flex-row justify-center gap-x-5 sm:gap-x-2 items-center">
      <button
        className="bg-black disabled:bg-slate-300 text-white p-2 rounded-full text-xl"
        onClick={() => {
          router.push(
            `${prevSearchParams}&page=1&per_page=${per_page}`,
            undefined,
            { shallow: true }
          );
        }}
        disabled={!hasPrevPage}
      >
        <FiChevronsLeft />
      </button>
      <button
        className="bg-black disabled:bg-slate-300 text-white p-2 rounded-full text-xl"
        onClick={() => {
          router.push(
            `${prevSearchParams}&page=${Number(page) - 1}&per_page=${per_page}`,
            undefined,
            { shallow: true }
          );
        }}
        disabled={!hasPrevPage}
      >
        <FiChevronLeft />
      </button>

      <div className="font-semibold text-lg sm:text-sm">
        {page} / {Math.ceil(totalItemCount / Number(per_page))}
      </div>

      <button
        className="bg-black text-xl text-white p-2 rounded-full disabled:bg-slate-300"
        onClick={() => {
          const nextPageLink = `${prevSearchParams}&page=${
            Number(page) + 1
          }&per_page=${per_page}`;
          router.push(nextPageLink, undefined, { shallow: true });
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
              totalItemCount / Number(per_page)
            )}&per_page=${per_page}`,
            undefined,
            { shallow: true }
          );
        }}
        disabled={!hasNextPage}
      >
        <FiChevronsRight />
      </button>
    </div>
  );
};

export default AdminPagination;
