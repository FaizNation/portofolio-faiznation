"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {


  useEffect(() => {
    // Add a small delay before signaling completion to ensure exit animation plays smoothly


    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2000)

    return () => {

      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ y: "-100%", transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <div className="relative w-full max-w-4xl px-4">
        <svg
          viewBox="0 0 398 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          {/* We will animate the paths. For the original fill="black" paths, we can use fill="white" for visibility on black bg 
              or keep them structurally but animate the stroke. 
              Checking the user's SVG, it has masks and paths. 
              The user's SVG has black fill. Since the background is black, we should make the logo white.
          */}

          <motion.path
            d="M31.248 2.63999V11.408H12.944V20.88H26.64V29.392H12.944V47.568H1.99998V2.63999H31.248ZM64.968 39.632H48.2L45.512 47.568H34.056L50.312 2.63999H62.984L79.24 47.568H67.656L64.968 39.632ZM62.152 31.184L56.584 14.736L51.08 31.184H62.152ZM95.1315 2.63999V47.568H84.1875V2.63999H95.1315ZM114.71 38.608H134.038V47.568H102.294V39.248L121.494 11.6H102.294V2.63999H134.038V10.96L114.71 38.608ZM194.942 47.568H183.998L165.694 19.856V47.568H154.75V2.63999H165.694L183.998 30.48V2.63999H194.942V47.568ZM230.843 39.632H214.075L211.387 47.568H199.931L216.187 2.63999H228.859L245.115 47.568H233.531L230.843 39.632ZM228.027 31.184L222.459 14.736L216.955 31.184H228.027ZM282.382 2.63999V11.408H270.478V47.568H259.534V11.408H247.63V2.63999H282.382ZM298.819 2.63999V47.568H287.875V2.63999H298.819ZM327.998 48.016C323.774 48.016 319.891 47.0347 316.35 45.072C312.851 43.1093 310.057 40.3787 307.966 36.88C305.918 33.3387 304.894 29.3707 304.894 24.976C304.894 20.5813 305.918 16.6347 307.966 13.136C310.057 9.63733 312.851 6.90666 316.35 4.94399C319.891 2.98133 323.774 1.99999 327.998 1.99999C332.222 1.99999 336.083 2.98133 339.582 4.94399C343.123 6.90666 345.897 9.63733 347.902 13.136C349.95 16.6347 350.974 20.5813 350.974 24.976C350.974 29.3707 349.95 33.3387 347.902 36.88C345.854 40.3787 343.081 43.1093 339.582 45.072C336.083 47.0347 332.222 48.016 327.998 48.016ZM327.998 38.032C331.582 38.032 334.441 36.8373 336.574 34.448C338.75 32.0587 339.838 28.9013 339.838 24.976C339.838 21.008 338.75 17.8507 336.574 15.504C334.441 13.1147 331.582 11.92 327.998 11.92C324.371 11.92 321.47 13.0933 319.294 15.44C317.161 17.7867 316.094 20.9653 316.094 24.976C316.094 28.944 317.161 32.1227 319.294 34.512C321.47 36.8587 324.371 38.032 327.998 38.032ZM397.254 47.568H386.31L368.006 19.856V47.568H357.062V2.63999H368.006L386.31 30.48V2.63999H397.254V47.568Z"
            stroke="white"
            strokeWidth="0.5"
            fill="transparent"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 0], opacity: 1 }}
            transition={{
              pathLength: { duration: 8, ease: "easeInOut", times: [0, 0.5, 1] },
              opacity: { duration: 0.5 },
            }}
          />
        </svg>
      </div>
    </motion.div>
  );
}

