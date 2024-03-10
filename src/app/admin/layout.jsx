'use client';
import Sidebar, { SideBarItem } from '@/components/admin/Sidebar';
import { usePathname } from 'next/navigation';
import { TbDeviceIpadDollar, TbQrcode, TbScan } from 'react-icons/tb';
import { PiUserListLight } from 'react-icons/pi';
import { CiGrid31 } from 'react-icons/ci';
import { TfiDashboard } from 'react-icons/tfi';
import { MdOutlineContactMail, MdOutlinePostAdd } from 'react-icons/md';
import {
  TbAffiliate,
  TbMessage2Question,
  TbLayoutGridAdd,
} from 'react-icons/tb';
import { GiClothes } from 'react-icons/gi';

export default function UserLayout({ children }) {
  const pathname = usePathname();
  return (
    <>
      <section className="py-5 font-EB_Garamond bg-gray-200 print:hidden ">
        <div className="flex flex-row gap-3 items-center  mx-auto px-10">
          <h1 className="flex text-bold text-2xl  maxsm:text-lg text-black font-EB_Garamond">
            Panel de Control
          </h1>
        </div>
      </section>
      <div className="mx-auto">
        <div className="flex items-start">
          <Sidebar>
            <SideBarItem
              icon={<TfiDashboard size={20} />}
              text={'Tablero'}
              active={pathname === '/admin' ?? true}
              url={'/admin'}
            />
            <SideBarItem
              icon={<TbDeviceIpadDollar size={20} />}
              text={'Pedidos'}
              active={pathname === '/admin/pedidos' ?? true}
              url={'/admin/pedidos'}
            />
            <SideBarItem
              icon={<CiGrid31 size={20} />}
              text={'Publicaciones'}
              active={pathname === '/admin/blog' ?? true}
              url={'/admin/blog'}
            />
            <SideBarItem
              icon={<MdOutlinePostAdd size={20} />}
              text={'Nueva Publicación '}
              active={pathname === '/admin/blog/editor' ?? true}
              url={'/admin/blog/editor'}
            />
            <SideBarItem
              icon={<GiClothes size={20} />}
              text={'Productos'}
              active={pathname === '/admin/productos' ?? true}
              url={'/admin/productos'}
            />
            <SideBarItem
              icon={<TbLayoutGridAdd size={20} />}
              text={'Nuevo Producto'}
              active={pathname === '/admin/productos/nuevo/variaciones' ?? true}
              url={'/admin/productos/nuevo/variaciones'}
            />
            <SideBarItem
              icon={<PiUserListLight size={20} />}
              text={'Clientes'}
              active={pathname === '/admin/clientes' ?? true}
              url={'/admin/clientes'}
            />
            {/* <SideBarItem
              icon={<TbAffiliate size={20} />}
              text={'Afiliados'}
              active={pathname === '/admin/asociados' ?? true}
              url={'/admin/asociados'}
            /> */}

            <hr className="my-3" />

            <SideBarItem
              icon={<TbScan size={20} />}
              text={'Scanner'}
              active={pathname === '/admin/pos/qr/scanner' ?? true}
              url={'/admin/pos/qr/scanner'}
            />
            <SideBarItem
              icon={<TbQrcode size={20} />}
              text={`Generar QR's`}
              active={pathname === '/admin/pos/productos' ?? true}
              url={'/admin/pos/productos'}
            />
            <SideBarItem
              icon={<TbMessage2Question size={20} />}
              text={'Editar Nosotros'}
              active={pathname === '/admin/config/nosotros' ?? true}
              url={'/admin/config/nosotros'}
            />
            <SideBarItem
              icon={<MdOutlineContactMail size={20} />}
              text={'Editar Contacto'}
              active={pathname === '/admin/config/contacto' ?? true}
              url={'/admin/config/contacto'}
            />
          </Sidebar>
          <main className="w-full pr-4 ">
            <article className="w-full mb-5 ">{children}</article>
          </main>
        </div>
      </div>
    </>
  );
}
