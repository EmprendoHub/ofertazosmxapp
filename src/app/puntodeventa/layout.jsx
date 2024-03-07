import POSSidebar from '@/components/pos/POSSidebar';

export default function UserLayout({ children }) {
  return (
    <>
      <section className="py-5 font-EB_Garamond bg-gray-200 print:hidden">
        <div className="flex flex-row gap-3 items-center  mx-auto px-10">
          <div className="relative flex ">
            <POSSidebar />
          </div>
          <h1 className="flex text-bold text-2xl  maxsm:text-lg text-black font-EB_Garamond">
            Panel de Control
          </h1>
        </div>
      </section>
      <section className=" maxsm:py-2  print:p-0  bg-slate-100 text-black">
        <div className=" mx-auto px-4 maxsm:px-1  print:m-0">
          <div className="flex flex-row maxmd:flex-col ">
            <main className="w-full px-4 maxsm:px-0 print:m-0">
              <article className="border border-gray-200 bg white shadow-md rounded mb-5 px-5 maxmd:px-3 print:p-0">
                {children}
              </article>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
