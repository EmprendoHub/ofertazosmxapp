'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { createContext, useContext, useState } from 'react';
import { BsChevronBarLeft, BsChevronBarRight } from 'react-icons/bs';
import { FiMoreVertical, FiLogOut } from 'react-icons/fi';
import { signOut } from 'next-auth/react';
import AuthContext from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const SidebarContext = createContext();

const Sidebar = ({ children }) => {
  const [expandSidebar, setExpandSidebar] = useState(true);
  const { user } = useContext(AuthContext);
  return (
    <aside className="h-screen print:hidden ">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 maxmd:p-2 pb-2 flex justify-between maxmd:justify-center items-center">
          <Image
            alt="image"
            src={'/images/Main_shopout_logo.webp'}
            width={500}
            height={500}
            className={`overflow-hidden transition-all ease-in-out ${
              expandSidebar ? 'w-36 h-auto  maxmd:w-36 maxmd:ml-1' : 'w-0 h-0'
            }`}
          />
          <button
            onClick={() => setExpandSidebar((currentState) => !currentState)}
            className="p-1.5 rounded-lg bg-gray-50"
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
        <div className="border-t flex p-3 ">
          <Image
            alt={user?.name ? user?.name : 'avatar'}
            src={user?.image ? user?.image : '/images/avatar_placeholder.jpg'}
            width={500}
            height={500}
            className="w-10 h-10 rounded-full"
          />

          <div
            className={`flex justify-between items-center overflow-hidden transition-all ease-in-out  ${
              expandSidebar ? 'w-36 ml-3 maxmd:w-36 maxmd:ml-1' : 'w-0'
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold"> {user?.name}</h4>
              <span className="text-xs text-gray-600">{user?.email}</span>
            </div>
            {/* <FiMoreVertical size={20} /> */}
            <div
              className="block px-3 py-2 text-red-800 hover:bg-red-100 hover:text-white-500 rounded-md cursor-pointer"
              onClick={() => signOut()}
            >
              <FiLogOut />
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

export function SideBarItem({ icon, text, active, alert, url, dropdownItems }) {
  const { expandSidebar } = useContext(SidebarContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleDropdownToggle = () => {
    if (dropdownItems) {
      setDropdownOpen(!dropdownOpen);
    } else {
      // If no dropdown items, navigate to the URL directly
      router.push(url);
    }
  };

  return (
    <li
      className={`relative flex items-center py-2 px-3 maxmd:pr-1 my-1 font-medium rounded-md cursor-pointer gap-x-1 transition-colors group ${
        active
          ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
          : 'hover:bg-indigo-50 text-gray-600'
      }`}
      onClick={handleDropdownToggle}
    >
      <div className="flex ">
        {icon}
        <span
          className={`flex justify-between items-center overflow-hidden transition-all ease-in-out  ${
            expandSidebar ? ' w-36 ml-2  maxmd:w-36 maxmd:ml-1' : 'w-0'
          }`}
        >
          {text}
        </span>

        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 bg-indigo-400 rounded-full ${
              expandSidebar ? '' : 'top-2'
            }`}
          />
        )}
      </div>

      {/* Render dropdown items if dropdown is open */}
      {dropdownOpen && dropdownItems && (
        <ul className="absolute z-[666] top-full left-0 mt-1 w-full bg-white shadow-md rounded-md">
          {dropdownItems.map((item, index) => (
            <Link href={item.url} key={index}>
              <li
                className={`py-2 px-3 hover:bg-gray-100 cursor-pointer flex items-center ${
                  item.active
                    ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
                    : 'hover:bg-indigo-50 text-gray-600'
                }`}
              >
                {item.icon && item.icon}
                <span
                  className={`flex justify-between items-center overflow-hidden transition-all ease-in-out  ${
                    expandSidebar ? ' w-36 ml-2  maxmd:w-36 maxmd:ml-1' : 'w-0'
                  }`}
                >
                  {item.text}
                </span>
                {!expandSidebar && (
                  <div className="absolute z-50 left-full rounded-md px-2 py-1 ml-0 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
                    {item.text}
                  </div>
                )}
              </li>
            </Link>
          ))}
        </ul>
      )}

      {!expandSidebar && (
        <div className="absolute z-50 left-full rounded-md px-2 py-1 ml-0 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
          {text}
        </div>
      )}
    </li>
  );
}
