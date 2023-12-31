import Sidebar from "@/components/layout/AdminSidebar";

export default function UserLayout({ children }) {
  return (
    <>
      <section className='py-5 sm:py-7 bg-gray-200'>
        <div className='container  mx-auto px-4'>
          <h1 className='text-bold text-2xl text-black'>Panel de Control</h1>
        </div>
      </section>
      <section className='py-10  bg-slate-100 text-black'>
        <div className='container mx-auto px-4 maxsm:px-1'>
          <div className='flex flex-row maxmd:flex-col '>
            <Sidebar />
            <main className='w-4/5 maxmd:w-full px-4'>
              <article className='border border-gray-200 bg white shadow-md rounded mb-5 p-5'>
                {children}
              </article>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
