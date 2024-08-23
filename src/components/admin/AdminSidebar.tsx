"use client";
import Image from "next/image";
import Link from "next/link";
import React, { createContext, useContext, useState } from "react";
import { BsChevronBarLeft, BsChevronBarRight } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { UrlObject } from "url";

export interface SidebarContextType {
  expandSidebar: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const backdropVariants = {
  animate: { opacity: 1, scale: 1 },
  initial: { opacity: 0, scale: 0.5 },
  duration: { duration: 1.5 },
};

const AdminSidebar = ({ children }: { children: any }) => {
  const [expandSidebar, setExpandSidebar] = useState(false);
  let user: any;
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  if (isLoggedIn) {
    user = session?.user;
  }
  return (
    <aside className="h-screen print:hidden ">
      <nav className="h-full flex flex-col bg-background border-r border-r-foreground shadow-sm">
        <div className="p-4 maxmd:pl-3 pb-2 flex justify-between maxmd:justify-center items-center">
          <Image
            alt="image"
            src={"/images/horizontal_logo.png"}
            width={500}
            height={500}
            className={`overflow-hidden transition-all ease-in-out ${
              expandSidebar ? "w-36 h-auto  maxmd:w-36 maxmd:ml-1" : "w-0 h-0"
            }`}
          />
          <button
            onClick={() => setExpandSidebar((currentState) => !currentState)}
            className="p-1.5 rounded-lg text-foreground"
          >
            {expandSidebar ? (
              <BsChevronBarLeft size={20} />
            ) : (
              <BsChevronBarRight size={20} />
            )}
          </button>
        </div>

        <SidebarContext.Provider value={{ expandSidebar }}>
          <ul className="flex-1 ">{children}</ul>
        </SidebarContext.Provider>
        {/* user avatar */}
        <div
          onClick={() => setExpandSidebar((currentState) => !currentState)}
          className="border-t flex p-1 "
        >
          <Image
            alt={user?.name ? user?.name : "avatar"}
            src={user?.image ? user?.image : "/images/avatar_placeholder.jpg"}
            width={500}
            height={500}
            className="w-10 h-10 rounded-full cursor-pointer"
          />

          <div
            className={`flex items-center overflow-hidden transition-all ease-in-out  ${
              expandSidebar ? "w-full ml-3 maxmd:ml-1" : "w-0"
            }`}
          >
            <div className="leading-4 w-full">
              <div className="flex items-center">
                <h4 className="font-semibold text-xs leading-4 text-wrap w-2/3 ">
                  {" "}
                  {user?.name}
                </h4>
                <div
                  className=" text-red-800 hover:bg-red-100 hover:text-white-500 rounded-md cursor-pointer"
                  onClick={() => signOut()}
                >
                  <div
                    className={`${
                      expandSidebar ? "group absolute w-32" : "w-0"
                    }`}
                  >
                    <FiLogOut />
                    <span className="absolute -top-10 scale-0 transition-all rounded bg-black p-2 text-xs text-white group-hover:scale-100 z-50">
                      Cerrar Session!
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-600">
                {user?.email.substring(0, 15)}...
              </span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;

export function SideBarItem({
  icon,
  text,
  active,
  alert,
  url,
  dropdownItems,
}: {
  icon: any;
  text: string;
  active: any;
  alert: any;
  url: string;
  dropdownItems: any;
}) {
  const { expandSidebar }: any = useContext(SidebarContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(""); // Track the hovered item by its index
  const router = useRouter();

  const handleDropdownToggle = () => {
    if (dropdownItems) {
      setDropdownOpen(!dropdownOpen);
    } else {
      router.push(url);
    }
  };

  return (
    <li
      className={`relative flex flex-col items-center py-2 pl-2 pr-3 maxmd:pr-1 my-1 font-medium rounded-md cursor-pointer gap-x-1 transition-colors ${
        active === "true" ? " text-primary" : "hover:bg-primary text-gray-600"
      }`}
      onClick={handleDropdownToggle}
      onMouseEnter={() => setHoveredIndex("main")} // Set hoveredIndex to 'main' for the main item
      onMouseLeave={() => setHoveredIndex("")} // Reset on mouse leave
    >
      <div className="flex ">
        {icon}
        <span
          className={`flex justify-between items-center overflow-hidden transition-all ease-in-out ${
            expandSidebar ? " w-36 ml-2  maxmd:w-36 maxmd:ml-1" : "w-0"
          }`}
        >
          {text}
        </span>
      </div>

      {/* Conditional rendering for main item hover text */}
      {!expandSidebar && hoveredIndex === "main" && (
        <div className="absolute z-50 left-full rounded-md px-2 py-1 ml-0 bg-indigo-100 text-primary text-sm opacity-100 min-w-[250px]">
          {text}
        </div>
      )}

      {dropdownOpen && dropdownItems && (
        <motion.ul
          variants={{
            animate: { opacity: 1, scale: 1 },
            initial: { opacity: 0, scale: 0.5 },
          }}
          transition={{ duration: 0.5 }}
          initial="initial"
          animate="animate"
          className="relative flex flex-col gap-1 mt-1 w-full bg-background"
        >
          {dropdownItems.map(
            (
              item: {
                url: string;
                active: string;
                icon: any;
                text: string;
              },
              index: number
            ) => (
              <Link href={item.url} key={index} className="min-w-full">
                <li
                  className={`p-2 cursor-pointer flex items-center justify-center rounded-md ${
                    item.active === "true"
                      ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-primary"
                      : "hover:bg-indigo-50 text-gray-600 bg-opacity-0"
                  }`}
                  onMouseEnter={() => setHoveredIndex(index.toString())} // Set hoveredIndex to the current item's index
                  onMouseLeave={() => setHoveredIndex("")} // Reset on mouse leave
                >
                  {item.icon && item.icon}
                  <span
                    className={`flex justify-between items-center overflow-hidden transition-all ease-in-out ${
                      expandSidebar
                        ? " w-36 ml-2  maxmd:w-36 maxmd:ml-1"
                        : "w-0"
                    }`}
                  >
                    {item.text}
                  </span>
                  {/* Conditional rendering for dropdown item hover text */}
                  {!expandSidebar && hoveredIndex === index.toString() && (
                    <div className="absolute z-50 left-full rounded-md px-2 py-1 ml-0 bg-indigo-100 text-primary text-sm opacity-100 min-w-[250px]">
                      {item.text}
                    </div>
                  )}
                </li>
              </Link>
            )
          )}
        </motion.ul>
      )}
    </li>
  );
}
