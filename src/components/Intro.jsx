import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Intro({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    let value = 0;

    const interval = setInterval(() => {
      value += Math.floor(Math.random() * 8) + 3; // random cho giống loading thật
      if (value > 100) value = 100;

      setProgress(value);

      if (value === 100) {
        clearInterval(interval);

        setTimeout(() => {
          setShow(false);
          sessionStorage.setItem("seenIntro", "true");
          onFinish();
        }, 400);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* text */}
          <div className="text-gray-300 mb-4 tracking-widest text-sm">
            loading
          </div>

          {/* progress bar */}
          <div className="w-[300px] h-3 bg-white/10 rounded-full overflow-hidden relative">
            {/* glow nền */}
            <div className="absolute inset-0 rounded-full blur-md bg-blue-400/20" />

            {/* thanh chạy */}
            <motion.div
              className="h-full bg-blue-400 rounded-full shadow-[0_0_20px_#60a5fa]"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>

          {/* percent */}
          <div className="text-gray-300 mt-2 text-sm">
            {progress}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}