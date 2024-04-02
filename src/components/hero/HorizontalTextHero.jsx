"use client";
import React from "react";
import ScrollTrigger from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const HorizontalTextHero = () => {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  const sliderContainer = useRef(null);

  let xPercent = 0;
  let direction = -1;

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Initialize animation only if the elements are available
    if (
      slider.current &&
      firstText.current &&
      secondText.current &&
      sliderContainer.current
    ) {
      // Animation Frame ID for cleanup
      let animationFrameId;

      // Corrected ScrollTrigger configuration
      gsap.to(slider.current, {
        scrollTrigger: {
          trigger: sliderContainer.current, // Correctly reference the `sliderContainer` ref
          start: "top top",
          end: "bottom bottom",
          scrub: 0.25,
          onUpdate: (self) => {
            direction = self.direction * -1;
          },
        },
        x: "-=300px",
      });

      // Animation function with safeguard checks
      const animation = () => {
        if (!firstText.current || !secondText.current) {
          // Early exit if refs are null
          return;
        }
        if (xPercent <= -100) {
          xPercent = 0;
        }
        if (xPercent > 0) {
          xPercent = -100;
        }
        gsap.set(firstText.current, { xPercent: xPercent });
        gsap.set(secondText.current, { xPercent: xPercent });
        xPercent += 0.07 * direction;
        animationFrameId = requestAnimationFrame(animation);
      };

      // Start the animation
      animationFrameId = requestAnimationFrame(animation);

      // Cleanup function to cancel the animation frame and kill GSAP animations
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }

        // Kill all ScrollTriggers to prevent leaks
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    }
  }, []); // Dependencies array is empty, meaning this effect runs once on mount

  const animation = () => {
    if (!firstText.current || !secondText.current) {
      // Optionally, stop animation or handle the case when elements are not available
      return;
    }

    if (xPercent <= -100) {
      xPercent = 0;
    }
    if (xPercent > 0) {
      xPercent = -100;
    }
    gsap.set(firstText.current, { xPercent: xPercent });
    gsap.set(secondText.current, { xPercent: xPercent });
    xPercent += 0.07 * direction;
    requestAnimationFrame(animation);
  };

  return (
    <motion.main
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9 }}
      ref={sliderContainer}
      className="relative flex items-center justify-center min-h-[95vh] overflow-hidden w-full mb-40"
    >
      <Image
        src={"/images/black-dress-expressing-true-exitement.jpg"}
        alt="main image"
        fill={true}
        objectFit="cover"
        className="grayscale"
      />
      {/* overlay */}
      <div className="min-h-[100%] absolute z-[1] min-w-[100%] top-0 left-0 bg-black opacity-30" />
      <div className="slider-container-class z-[5] absolute top-[calc(95vh_-_260px)] maxmd:top-[calc(95vh_-_150px)] p-5 ">
        <div
          ref={slider}
          className="slider font-EB_Garamond relative text-white flex whitespace-nowrap"
        >
          <p ref={firstText} className="m-0 text-[160px] maxmd:text-[80px]  ">
            <span className="mr-7">
              Explora para deslumbrar y transformar tu estilo -
            </span>
          </p>
          <p
            ref={secondText}
            className="m-0 text-[160px] maxmd:text-[80px] absolute left-full"
          >
            <span className="mr-7">
              Explora para deslumbrar y transformar tu estilo -
            </span>
          </p>
        </div>
      </div>
    </motion.main>
  );
};

export default HorizontalTextHero;
