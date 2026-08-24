import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars -- motion is used as <motion.div> JSX namespace
import { motion, AnimatePresence } from "framer-motion";
import { Headphones } from "lucide-react";

const TOTAL_DURATION = 4000;

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [introDone, setIntroDone] = useState(false);

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

    const introTimer = setTimeout(() => setIntroDone(true), 1400);

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
      clearTimeout(introTimer);
      setVisible(false);
      setTimeout(onComplete, 500);
    };

    window.addEventListener("keydown", handleSkip);
    window.addEventListener("click", handleSkip);

    return () => {
      clearInterval(interval);
      clearTimeout(introTimer);
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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#080D12" }}
        >
          {/* Radial flash burst behind the logo at impact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 0.5, 0], scale: [0.3, 2.2, 2.8] }}
            transition={{ duration: 0.9, times: [0, 0.4, 1], delay: 0.55, ease: "easeOut" }}
            className="absolute w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(95,208,179,0.6) 0%, rgba(95,208,179,0) 70%)",
            }}
          />

          {/* Logo + wordmark: flies out from deep in the screen toward the viewer, then settles */}
          <motion.div
            initial={{ scale: 6, opacity: 0, z: -800 }}
            animate={
              introDone
                ? { scale: 1, opacity: 1 }
                : { scale: [6, 0.85, 1], opacity: [0, 1, 1] }
            }
            transition={
              introDone
                ? { duration: 0.4, ease: "easeOut" }
                : { duration: 1.1, times: [0, 0.75, 1], ease: [0.16, 1, 0.3, 1] }
            }
            style={{ perspective: 1000 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={
                !introDone
                  ? { filter: ["blur(8px)", "blur(0px)", "blur(0px)"] }
                  : { filter: "blur(0px)" }
              }
              transition={{ duration: 1.1, times: [0, 0.75, 1] }}
              className="w-20 h-20 rounded-3xl bg-[#5FD0B3] flex items-center justify-center mb-6 shadow-lg shadow-[#5FD0B3]/20"
            >
              <Headphones className="w-10 h-10 text-[#080D12]" />
            </motion.div>

            <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
              <span className="text-white">Vibe</span>
              <span className="text-[#5FD0B3]">Tune</span>
            </h1>
          </motion.div>

          {/* Tagline + waveform + progress: fade in only once the impact has landed */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: introDone ? 1 : 0, y: introDone ? 0 : 8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
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