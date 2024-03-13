'use client';
import AdminSidebar, { SideBarItem } from '@/components/admin/AdminSidebar';
import { usePathname } from 'next/navigation';
import { TbDeviceIpadDollar, TbQrcode, TbScan } from 'react-icons/tb';
import { PiUserListLight } from 'react-icons/pi';
import { CiGrid31 } from 'react-icons/ci';
import { TfiDashboard } from 'react-icons/tfi';
import { MdOutlineContactMail, MdOutlinePostAdd } from 'react-icons/md';
import { LuReceipt } from 'react-icons/lu';
import {
  TbAffiliate,
  TbMessage2Question,
  TbLayoutGridAdd,
} from 'react-icons/tb';
import { LiaCashRegisterSolid, LiaStoreAltSolid } from 'react-icons/lia';
import { GiClothes } from 'react-icons/gi';

export default function UserLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="max-w-full pr-2">
      <div className="flex items-start w-full ">
        <AdminSidebar>
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
            alert
            dropdownItems={[
              {
                text: 'Todas',
                url: '/admin/blog',
                active: pathname === '/admin/blog' ?? true,
                icon: <CiGrid31 size={20} />,
              },
              {
                text: 'Nueva Publicación ',
                url: '/admin/blog/editor',
                active: pathname === '/admin/blog/editor' ?? true,
                icon: <MdOutlinePostAdd size={20} />,
              },
              // Add more dropdown items as needed
            ]}
          />

          <SideBarItem
            icon={<GiClothes size={20} />}
            text={'Productos'}
            active={
              pathname === '/admin/productos' ||
              (pathname === '/admin/productos/nuevo/variaciones' && true)
            }
            url={'/admin/productos'}
            alert
            dropdownItems={[
              {
                text: 'Todos',
                url: '/admin/productos',
                active: pathname === '/admin/productos' ?? true,
                icon: <GiClothes size={20} />,
              },
              {
                text: 'Nuevo Producto',
                url: '/admin/productos/nuevo/variaciones',
                active:
                  pathname === '/admin/productos/nuevo/variaciones' ?? true,
                icon: <TbLayoutGridAdd size={20} />,
              },
              // Add more dropdown items as needed
            ]}
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

          <hr className="my-3 maxmd:my-1" />
          <SideBarItem
            icon={<LuReceipt size={20} />}
            text={'POS'}
            active={
              pathname === '/admin/pos/productos' ||
              pathname === '/admin/pos/qr/scanner' ||
              pathname === 'admin/pos/tienda' ||
              (pathname === '/admin/pos/carrito' && true)
            }
            url={'/admin/pos/productos'}
            alert
            dropdownItems={[
              {
                text: 'Tienda',
                url: '/admin/pos/tienda',
                active: pathname === '/admin/pos/tienda' ?? true,
                icon: <LiaStoreAltSolid size={20} />,
              },
              {
                text: 'Caja',
                url: '/admin/pos/carrito',
                active: pathname === '/admin/pos/carrito' ?? true,
                icon: <LiaCashRegisterSolid size={20} />,
              },
              {
                text: 'Scanner',
                url: '/admin/pos/qr/scanner',
                active: pathname === '/admin/pos/qr/scanner' ?? true,
                icon: <TbScan size={20} />,
              },
              {
                text: 'Scanner ID',
                url: '/admin/pos/qr/idscanner',
                active: pathname === '/admin/pos/qr/idscanner' ?? true,
                icon: <TbScan size={20} />,
              },
              {
                text: 'Generar QRs`',
                url: '/admin/pos/productos',
                active: pathname === '/admin/pos/productos' ?? true,
                icon: <TbQrcode size={20} />,
              },
              // Add more dropdown items as needed
            ]}
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
        </AdminSidebar>
        <div className="relative w-full mb-5 ">{children}</div>
      </div>
    </div>
  );
}
