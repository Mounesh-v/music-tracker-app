import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const SectionHeader = ({ eyebrow, title, viewAll, onViewAll }) => (
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
      <button
        onClick={onViewAll}
        className="text-xs font-medium text-[#9CA3AF] hover:text-[#5FD0B3] transition-colors"
      >
        View All
      </button>
    )}
  </div>
);

const Home = () => {
  const { recentlyPlayed } = usePlayer();
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [regionalSongs, setRegionalSongs] = useState([]);
  const [regionalLoading, setRegionalLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setTrendingLoading(true);
        const res = await api.get("/music/trending?limit=50");
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
    const fetchRegional = async () => {
      try {
        setRegionalLoading(true);
        const res = await api.get("/music/trending-by-language?limit=5");
        setRegionalSongs(res.data?.languages || []);
      } catch {
        setRegionalSongs([]);
      } finally {
        setRegionalLoading(false);
      }
    };
    fetchRegional();
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
          <SectionHeader
            eyebrow="Charts"
            title="Trending Now"
            viewAll
            onViewAll={() => navigate("/view-all?title=Trending+Now&category=Trending")}
          />
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

      {regionalSongs.map(({ language, songs }) => {
        const title = `Trending in ${language.charAt(0).toUpperCase() + language.slice(1)}`;
        return (
          <Motion.section
            key={language}
            variants={sectionFade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="py-4 md:py-6 px-4 md:px-6 lg:px-8"
          >
            <div className="max-w-6xl mx-auto">
              <SectionHeader
                eyebrow="Regional Charts"
                title={title}
                viewAll
                onViewAll={() => navigate(`/view-all?title=${encodeURIComponent(title)}&language=${language}`)}
              />
              {regionalLoading ? (
                <ScrollRow>
                  {[0, 1].map((index) => <SongCardSkeleton key={index} />)}
                </ScrollRow>
              ) : songs.length > 0 ? (
                <ScrollRow>
                  {songs.map((song, index) => (
                    <div key={song.id || `${language}-${index}`} className="shrink-0 w-[150px] md:w-[200px]">
                      <SongCard song={song} queue={songs} />
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
        );
      })}

      <Footer />
    </div>
  );
};

export default Home;
