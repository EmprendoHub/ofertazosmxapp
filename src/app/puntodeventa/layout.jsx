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
            icon={<LuReceipt size={20} />}
            text={'POS'}
            active={
              pathname === '/puntodeventa/tienda' ||
              (pathname === '/puntodeventa/tienda' && true)
            }
            url={'/puntodeventa/tienda'}
          />
          <SideBarItem
            icon={<LiaCashRegisterSolid size={20} />}
            text={'Caja'}
            active={
              pathname === '/puntodeventa/carrito' ||
              (pathname === '/puntodeventa/carrito' && true)
            }
            url={'/puntodeventa/carrito'}
          />
          <SideBarItem
            icon={<TbScan size={20} />}
            text={'Scanner'}
            active={
              pathname === '/puntodeventa/qr/scanner' ||
              (pathname === '/puntodeventa/qr/scanner' && true)
            }
            url={'/puntodeventa/qr/scanner'}
          />
          <SideBarItem
            icon={<TbScan size={20} />}
            text={'Scanner ID'}
            active={
              pathname === '/puntodeventa/qr/idscanner' ||
              (pathname === '/puntodeventa/qr/idscanner' && true)
            }
            url={'/puntodeventa/qr/idscanner'}
          />
          <SideBarItem
            icon={<TbQrcode size={20} />}
            text={'Generar QRs'}
            active={
              pathname === '/puntodeventa/productos' ||
              (pathname === '/puntodeventa/productos' && true)
            }
            url={'/puntodeventa/productos'}
          />
        </BranchSidebar>
        <div className="relative w-full mb-5 ">{children}</div>
      </div>
    </div>
  );
}
