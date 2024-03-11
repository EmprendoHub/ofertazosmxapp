'use client';
import BranchSidebar, { SideBarItem } from '@/components/pos/POSSidebar';
import { usePathname } from 'next/navigation';
import { TbDeviceIpadDollar, TbQrcode, TbScan } from 'react-icons/tb';
import { PiUserListLight } from 'react-icons/pi';
import { CiGrid31 } from 'react-icons/ci';
import { TfiDashboard } from 'react-icons/tfi';
import { MdOutlineContactMail, MdOutlinePostAdd } from 'react-icons/md';
import { LuReceipt } from 'react-icons/lu';
import { TbMessage2Question, TbLayoutGridAdd } from 'react-icons/tb';
import { LiaCashRegisterSolid, LiaStoreAltSolid } from 'react-icons/lia';
import { GiClothes } from 'react-icons/gi';

export default function UserLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="max-w-full pr-2">
      <div className="flex items-start w-full ">
        <BranchSidebar>
          <SideBarItem
            icon={<TfiDashboard size={20} />}
            text={'Tablero'}
            active={pathname === '/puntodeventa' ?? true}
            url={'/puntodeventa'}
          />
          <SideBarItem
            icon={<TbDeviceIpadDollar size={20} />}
            text={'Pedidos'}
            active={pathname === '/puntodeventa/pedidos' ?? true}
            url={'/puntodeventa/pedidos'}
          />
          <SideBarItem
            icon={<CiGrid31 size={20} />}
            text={'Publicaciones'}
            active={pathname === '/puntodeventa/blog' ?? true}
            url={'/puntodeventa/blog'}
            alert
            dropdownItems={[
              {
                text: 'Todas',
                url: '/puntodeventa/blog',
                active: pathname === '/puntodeventa/blog' ?? true,
                icon: <CiGrid31 size={20} />,
              },
              {
                text: 'Nueva Publicación ',
                url: '/puntodeventa/blog/editor',
                active: pathname === '/puntodeventa/blog/editor' ?? true,
                icon: <MdOutlinePostAdd size={20} />,
              },
              // Add more dropdown items as needed
            ]}
          />

          <SideBarItem
            icon={<GiClothes size={20} />}
            text={'Productos'}
            active={
              pathname === '/puntodeventa/productos' ||
              (pathname === '/puntodeventa/productos/nuevo/variaciones' && true)
            }
            url={'/puntodeventa/productos'}
            alert
            dropdownItems={[
              {
                text: 'Todos',
                url: '/puntodeventa/productos',
                active: pathname === '/puntodeventa/productos' ?? true,
                icon: <GiClothes size={20} />,
              },
              {
                text: 'Nuevo Producto',
                url: '/puntodeventa/productos/nuevo/variaciones',
                active:
                  pathname === '/puntodeventa/productos/nuevo/variaciones' ??
                  true,
                icon: <TbLayoutGridAdd size={20} />,
              },
              // Add more dropdown items as needed
            ]}
          />

          <hr className="my-3 maxmd:my-1" />
          <SideBarItem
            icon={<LuReceipt size={20} />}
            text={'POS'}
            active={
              pathname === '/puntodeventa/productos' ||
              pathname === '/puntodeventa/qr/scanner' ||
              pathname === 'puntodeventa/tienda' ||
              (pathname === '/puntodeventa/carrito' && true)
            }
            url={'/puntodeventa/productos'}
            alert
            dropdownItems={[
              {
                text: 'Tienda',
                url: '/puntodeventa/tienda',
                active: pathname === '/puntodeventa/tienda' ?? true,
                icon: <LiaStoreAltSolid size={20} />,
              },
              {
                text: 'Caja',
                url: '/puntodeventa/carrito',
                active: pathname === '/puntodeventa/carrito' ?? true,
                icon: <LiaCashRegisterSolid size={20} />,
              },
              {
                text: 'Scanner',
                url: '/puntodeventa/qr/scanner',
                active: pathname === '/puntodeventa/qr/scanner' ?? true,
                icon: <TbScan size={20} />,
              },
              {
                text: 'Generar QRs`',
                url: '/puntodeventa/productos',
                active: pathname === '/puntodeventa/productos' ?? true,
                icon: <TbQrcode size={20} />,
              },
              // Add more dropdown items as needed
            ]}
          />
        </BranchSidebar>
        <div className="relative w-full mb-5 ">{children}</div>
      </div>
    </div>
  );
}
