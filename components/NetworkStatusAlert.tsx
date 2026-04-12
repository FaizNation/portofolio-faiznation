"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";

export default function NetworkStatusAlert() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    // Check initial status only on client
    setIsOnline(typeof window !== "undefined" ? navigator.onLine : true);

    const handleOnline = () => {
      setIsOnline(true);
      setShowBackOnline(true);
      setTimeout(() => setShowBackOnline(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBackOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: 100, opacity: 0, x: "-50%" }}
          animate={{ y: 0, opacity: 1, x: "-50%" }}
          exit={{ y: 100, opacity: 0, x: "-50%" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-1/2 transform z-[100] flex items-center gap-3 bg-red-600/95 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl border border-red-500/50"
        >
          <WifiOff className="w-5 h-5" />
          <span className="font-medium text-sm">You are currently offline</span>
        </motion.div>
      )}

      {isOnline && showBackOnline && (
        <motion.div
          initial={{ y: 100, opacity: 0, x: "-50%" }}
          animate={{ y: 0, opacity: 1, x: "-50%" }}
          exit={{ y: 100, opacity: 0, x: "-50%" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-1/2 transform z-[100] flex items-center gap-3 bg-green-600/95 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl border border-green-500/50"
        >
          <Wifi className="w-5 h-5" />
          <span className="font-medium text-sm">Back online!</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
