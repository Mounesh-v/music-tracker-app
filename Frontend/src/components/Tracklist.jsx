import ScrollRow from "./ScrollRow";
import { motion as Motion } from "framer-motion";

const sectionFade = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const EXPERIENCES = [
  {
    title: "Late Night Vibes",
    subtitle: "Chill beats for the night",
    gradient: "from-[#1a1a2e] to-[#16213e]",
  },
  {
    title: "Workout Energy",
    subtitle: "High tempo motivation",
    gradient: "from-[#1a2e1a] to-[#0f3d0f]",
  },
  {
    title: "Romantic Melodies",
    subtitle: "Songs for the heart",
    gradient: "from-[#2e1a2e] to-[#3e1625]",
  },
  {
    title: "Party Starters",
    subtitle: "Get the vibe going",
    gradient: "from-[#2e2a1a] to-[#3e3516]",
  },
];

export default function Tracklist() {
  return (
    <section className="py-6 md:py-10 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 md:mb-6">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5FD0B3] mb-1.5">
            Experiences
          </p>
          <h2 className="font-display text-lg md:text-2xl font-bold text-white">
            Curated For You
          </h2>
        </div>

        <ScrollRow>
          {EXPERIENCES.map((exp) => (
            <Motion.div
              key={exp.title}
              variants={sectionFade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="shrink-0 w-[220px] md:w-[260px] snap-start"
            >
              <div
                className={`relative rounded-2xl overflow-hidden p-5 md:p-6 h-[140px] md:h-[160px] bg-gradient-to-br ${exp.gradient} border border-white/[0.06] cursor-pointer hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1`}
              >
                <p className="font-display text-base md:text-lg font-bold text-white mb-1">
                  {exp.title}
                </p>
                <p className="text-xs text-[#9CA3AF]">
                  {exp.subtitle}
                </p>
                <div
                  className="absolute bottom-4 right-4 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  style={{ background: "#5FD0B3", color: "#080D12" }}
                >
                  <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </Motion.div>
          ))}
        </ScrollRow>
      </div>
    </section>
  );
}
