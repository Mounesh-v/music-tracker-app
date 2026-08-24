import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars -- motion is used as <motion.div> JSX namespace
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, Check } from "lucide-react";

const TOTAL_DURATION = 4000;

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [zoomOut, setZoomOut] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      onComplete();
      return;
    }

    const zoomTimer = setTimeout(() => setZoomOut(true), 700);
    const introTimer = setTimeout(() => setIntroDone(true), 1500);

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / TOTAL_DURATION) * 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        // Completion beat: pulse + "Ready" label play out fully before unmounting
        setCompleting(true);
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 500);
        }, 1100);
      }
    }, 30);

    const handleSkip = () => {
      clearInterval(interval);
      clearTimeout(zoomTimer);
      clearTimeout(introTimer);
      setVisible(false);
      setTimeout(onComplete, 500);
    };

    window.addEventListener("keydown", handleSkip);
    window.addEventListener("click", handleSkip);

    return () => {
      clearInterval(interval);
      clearTimeout(zoomTimer);
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
          {/* Zoom-past radial glow (unrelated to completion, plays early) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={
              zoomOut
                ? { opacity: [0, 0.6, 0], scale: [0.5, 3.5, 5] }
                : { opacity: 0, scale: 0.5 }
            }
            transition={{ duration: 0.8, ease: "easeIn" }}
            className="absolute w-72 h-72 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(95,208,179,0.55) 0%, rgba(95,208,179,0) 70%)",
            }}
          />

          {/* Completion confirmation pulse — separate ring that bursts outward only when completing */}
          {completing && (
            <motion.div
              initial={{ opacity: 0.7, scale: 0.9 }}
              animate={{ opacity: 0, scale: 2.4 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="absolute w-24 h-24 rounded-full pointer-events-none border-2"
              style={{ borderColor: "#5FD0B3" }}
            />
          )}

          {/* Logo + wordmark */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={
              completing
                ? { scale: [1, 1.12, 1], opacity: 1 }
                : zoomOut
                ? { scale: 18, opacity: [1, 1, 0] }
                : { scale: 1, opacity: 1 }
            }
            transition={
              completing
                ? { duration: 0.5, times: [0, 0.4, 1], ease: "easeOut" }
                : zoomOut
                ? { duration: 0.8, times: [0, 0.5, 1], ease: [0.6, 0, 0.9, 0.2] }
                : { duration: 0.5, ease: "easeOut" }
            }
            className="flex flex-col items-center"
          >
            <motion.div
              animate={
                completing
                  ? { boxShadow: "0 0 0 8px rgba(95,208,179,0)" }
                  : {}
              }
              className="w-20 h-20 rounded-3xl bg-[#5FD0B3] flex items-center justify-center mb-6 shadow-lg shadow-[#5FD0B3]/20 relative"
            >
              <AnimatePresence mode="wait">
                {completing ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <Check className="w-10 h-10 text-[#080D12]" strokeWidth={2.5} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="headphones"
                    initial={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Headphones className="w-10 h-10 text-[#080D12]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
              <span className="text-white">Vibe</span>
              <span className="text-[#5FD0B3]">Tune</span>
            </h1>
          </motion.div>

          {/* Tagline + waveform + progress */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={
              completing
                ? { opacity: [1, 1, 0], y: [0, 0, -10], filter: ["blur(0px)", "blur(0px)", "blur(4px)"] }
                : { opacity: introDone ? 1 : 0, y: introDone ? 0 : 8 }
            }
            transition={
              completing
                ? { duration: 0.8, times: [0, 0.4, 1], ease: "easeIn" }
                : { duration: 0.5, ease: "easeOut" }
            }
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
                  animate={
                    completing
                      ? { height: 4 }
                      : { height: [8, 20 + Math.random() * 12, 8] }
                  }
                  transition={
                    completing
                      ? { duration: 0.3 }
                      : {
                          duration: 0.8 + Math.random() * 0.4,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: "easeInOut",
                        }
                  }
                />
              ))}
            </div>

            <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "#5FD0B3" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <div className="h-4 mt-2 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {!completing ? (
                  <motion.p
                    key="pct"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="font-mono text-[10px] text-[#5C6370]"
                  >
                    {Math.floor(progress)}%
                  </motion.p>
                ) : (
                  <motion.p
                    key="ready"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="font-mono text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: "#5FD0B3" }}
                  >
                    Ready
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}