import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import Hero from "../components/Hero";
import Tracklist from "../components/Tracklist";
import SearchModule from "../components/SearchModule";
import SongCard from "../components/SongCard";
import ScrollRow from "../components/ScrollRow";
import Footer from "../components/Footer";
import { usePlayer } from "../Context/PlayerContext";
import api from "../Service/api";

const sectionFade = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const SongCardSkeleton = () => (
  <div className="shrink-0 w-[150px] md:w-[200px] snap-start rounded-2xl overflow-hidden bg-[#15171E] border border-white/[0.06]">
    <div className="w-full aspect-square bg-[#111318] animate-pulse" />
    <div className="p-3 md:p-4 space-y-2">
      <div className="h-3.5 bg-[#111318] rounded-lg w-3/4 animate-pulse" />
      <div className="h-3 bg-[#111318] rounded-lg w-1/2 animate-pulse" />
    </div>
  </div>
);

const SectionHeader = ({ eyebrow, title, viewAll }) => (
  <div className="flex items-end justify-between mb-4 md:mb-6">
    <div>
      {eyebrow && (
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5FD0B3] mb-1.5">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-lg md:text-2xl font-bold text-white">
        {title}
      </h2>
    </div>
    {viewAll && (
      <button className="text-xs font-medium text-[#9CA3AF] hover:text-[#5FD0B3] transition-colors">
        View All
      </button>
    )}
  </div>
);

const Home = () => {
  const { recentlyPlayed } = usePlayer();
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [telugu, setTelugu] = useState([]);
  const [teluguLoading, setTeluguLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setTrendingLoading(true);
        const res = await api.get("/music/discover?category=Trending&limit=12");
        setTrending(res.data?.songs || []);
      } catch {
        setTrending([]);
      } finally {
        setTrendingLoading(false);
      }
    };
    fetchTrending();
  }, []);

  useEffect(() => {
    const fetchTelugu = async () => {
      try {
        setTeluguLoading(true);
        const res = await api.get("/music/discover?language=telugu&limit=12");
        setTelugu(res.data?.songs || []);
      } catch {
        setTelugu([]);
      } finally {
        setTeluguLoading(false);
      }
    };
    fetchTelugu();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="px-4 md:px-6 lg:px-8 pt-4 md:pt-6 lg:pt-8">
        <div className="max-w-6xl mx-auto">
          <Hero />
        </div>
      </div>

      {recentlyPlayed.length > 0 && (
        <Motion.section
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="py-4 md:py-6 px-4 md:px-6 lg:px-8"
        >
          <div className="max-w-6xl mx-auto">
            <SectionHeader eyebrow="History" title="Recently Played" />
            <ScrollRow>
              {recentlyPlayed.map((song) => (
                <div key={song.id || song._id} className="shrink-0 w-[150px] md:w-[200px]">
                  <SongCard song={song} queue={recentlyPlayed} />
                </div>
              ))}
            </ScrollRow>
          </div>
        </Motion.section>
      )}

      <Motion.section
        variants={sectionFade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="py-4 md:py-6 px-4 md:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow="Charts" title="Trending Now" viewAll />
          {trendingLoading ? (
            <ScrollRow>
              {Array.from({ length: 6 }).map((_, i) => (
                <SongCardSkeleton key={i} />
              ))}
            </ScrollRow>
          ) : trending.length > 0 ? (
            <ScrollRow>
              {trending.map((song, index) => (
                <div
                  key={song.id || `trending-${index}`}
                  className="shrink-0 w-[150px] md:w-[200px]"
                >
                  <SongCard song={song} queue={trending} />
                </div>
              ))}
            </ScrollRow>
          ) : (
            <div className="flex items-center justify-center min-h-[160px] rounded-2xl border border-white/[0.06] bg-[#15171E] text-[#5C6370] text-sm">
              No trending tracks right now
            </div>
          )}
        </div>
      </Motion.section>

      <Motion.section
        variants={sectionFade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="py-4 md:py-6 px-4 md:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow="Regional" title="Popular in Telugu" viewAll />
          {teluguLoading ? (
            <ScrollRow>
              {Array.from({ length: 6 }).map((_, i) => (
                <SongCardSkeleton key={i} />
              ))}
            </ScrollRow>
          ) : telugu.length > 0 ? (
            <ScrollRow>
              {telugu.map((song, index) => (
                <div
                  key={song.id || `telugu-${index}`}
                  className="shrink-0 w-[150px] md:w-[200px]"
                >
                  <SongCard song={song} queue={telugu} />
                </div>
              ))}
            </ScrollRow>
          ) : (
            <div className="flex items-center justify-center min-h-[160px] rounded-2xl border border-white/[0.06] bg-[#15171E] text-[#5C6370] text-sm">
              No tracks available
            </div>
          )}
        </div>
      </Motion.section>

      <Motion.div
        variants={sectionFade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <Tracklist />
      </Motion.div>

      <Motion.div
        variants={sectionFade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <SearchModule />
      </Motion.div>

      <Footer />
    </div>
  );
};

export default Home;
