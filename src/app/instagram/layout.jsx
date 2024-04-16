"use client";
import BranchSidebar, { SideBarItem } from "@/components/pos/BranchSidebar";
import { usePathname } from "next/navigation";
import {
  TbClothesRack,
  TbDeviceIpadDollar,
  TbQrcode,
  TbScan,
} from "react-icons/tb";
import { TfiDashboard } from "react-icons/tfi";
import { LuReceipt } from "react-icons/lu";
import { LiaCashRegisterSolid } from "react-icons/lia";

export default function UserLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="max-w-full pr-2">
      <div className="flex items-start w-full ">
        <BranchSidebar>
          <SideBarItem
            icon={<TfiDashboard size={20} />}
            text={"Tablero"}
            active={pathname === "/instagram" ?? true}
            url={"/instagram"}
          />
          <SideBarItem
            icon={<TbClothesRack size={20} />}
            text={"Productos"}
            active={pathname === "/instagram/productos" ?? true}
            url={"/instagram/productos"}
          />
          <SideBarItem
            icon={<TbDeviceIpadDollar size={20} />}
            text={"Pedidos"}
            active={pathname === "/instagram/pedidos" ?? true}
            url={"/instagram/pedidos"}
          />

          <SideBarItem
            icon={<LuReceipt size={20} />}
            text={"POS"}
            active={
              pathname === "/instagram/tienda" ||
              (pathname === "/instagram/tienda" && true)
            }
            url={"/instagram/tienda"}
          />

          <SideBarItem
            icon={<LiaCashRegisterSolid size={20} />}
            text={"Caja"}
            active={
              pathname === "/instagram/carrito" ||
              (pathname === "/instagram/carrito" && true)
            }
            url={"/instagram/carrito"}
          />
          <SideBarItem
            icon={<TbScan size={20} />}
            text={"Scanner"}
            active={
              pathname === "/instagram/qr/scanner" ||
              (pathname === "/instagram/qr/scanner" && true)
            }
            url={"/instagram/qr/scanner"}
          />
          <SideBarItem
            icon={<TbScan size={20} />}
            text={"Scanner ID"}
            active={
              pathname === "/instagram/qr/idscanner" ||
              (pathname === "/instagram/qr/idscanner" && true)
            }
            url={"/instagram/qr/idscanner"}
          />
          <SideBarItem
            icon={<TbQrcode size={20} />}
            text={"Generar QRs"}
            active={
              pathname === "/instagram/seleccionar" ||
              (pathname === "/instagram/seleccionar" && true)
            }
            url={"/instagram/seleccionar"}
          />
        </BranchSidebar>
        <div className="relative w-full mb-5 ">{children}</div>
      </div>
    </div>
  );
}
