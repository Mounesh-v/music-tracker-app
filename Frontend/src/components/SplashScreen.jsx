import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars -- motion is used as <motion.div> JSX namespace
import { motion, AnimatePresence } from "framer-motion";
import { Headphones } from "lucide-react";

const TOTAL_DURATION = 4000;

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      onComplete();
      return;
    }

    const alreadyShown = sessionStorage.getItem("vibetune-splash");
    if (alreadyShown) {
      onComplete();
      return;
    }

    sessionStorage.setItem("vibetune-splash", "true");

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / TOTAL_DURATION) * 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 500);
        }, 300);
      }
    }, 30);

    const handleSkip = () => {
      clearInterval(interval);
      setVisible(false);
      setTimeout(onComplete, 500);
    };

    window.addEventListener("keydown", handleSkip);
    window.addEventListener("click", handleSkip);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleSkip);
      window.removeEventListener("click", handleSkip);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: "#080D12" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-[#5FD0B3] flex items-center justify-center mb-6 shadow-lg shadow-[#5FD0B3]/20">
              <Headphones className="w-10 h-10 text-[#080D12]" />
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
              <span className="text-white">Vibe</span>
              <span className="text-[#5FD0B3]">Tune</span>
            </h1>
            <p className="text-sm text-[#9CA3AF] mb-10">
              Vibe with Your Favorite Songs
            </p>

            <div className="flex items-end gap-[3px] h-8 mb-10">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  className="w-[3px] rounded-full"
                  style={{ background: "#5FD0B3" }}
                  animate={{
                    height: [8, 20 + Math.random() * 12, 8],
                  }}
                  transition={{
                    duration: 0.8 + Math.random() * 0.4,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "#5FD0B3", width: `${progress}%` }}
              />
            </div>
            <p className="font-mono text-[10px] text-[#5C6370] mt-2">
              {Math.floor(progress)}%
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
