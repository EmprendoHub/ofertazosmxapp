import Sidebar from "@/components/layout/Sidebar";

export default function UserLayout({ children }) {
  return (
    <>
      <section className='py-5 sm:py-7 bg-gray-200'>
        <div className='container  mx-auto px-4'>
          <h1 className='text-bold text-2xl text-black'>Panel de Control</h1>
        </div>
      </section>
      <section className='py-10  bg-slate-100 text-black'>
        <div className='container mx-auto px-4'>
          <div className='flex maxmd:flex-col flex-row '>
            <Sidebar />
            <main className='w-4/5 maxmd:w-full px-4'>
              <article className='border border-gray-200 bg white shadow-md rounded mb-5 '>
                {children}
              </article>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
