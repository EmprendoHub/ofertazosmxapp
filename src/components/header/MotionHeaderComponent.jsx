"use client";
import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import MobileMenuComponent from "./MobileMenuComponent";
import WhiteLogoComponent from "../logos/WhiteLogoComponent";
import { useSession } from "next-auth/react";

const MotionHeaderComponent = () => {
  const [hidden, setHidden] = useState(true);
  const { scrollY } = useScroll();
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(false);
    } else {
      setHidden(true);
    }
  });

  return (
    <motion.div
      variants={{ hidden: { y: 0 }, visible: { y: "-110%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`${
        isLoggedIn ? "" : "hidden"
      } print:hidden flex flex-row justify-between header-class from bg-gradient-to-tr from-gray-100 to-gray-100 text-foreground text-xl sticky top-0 z-[50]  w-full mx-auto py-3  border-b shadow-lg px-10 maxmd:px-2`}
    >
      <WhiteLogoComponent className={"ml-5 mt-4 w-[200px] sm:w-[120px]"} />
      <MobileMenuComponent />
    </motion.div>
  );
};

export default MotionHeaderComponent;
