import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import api from "../Service/api";
import { useLoginPopup } from "./LoginPopupContext";

const PlayerContext = createContext(null);

const STORAGE_KEY = "music_player_state";
const RECENTLY_KEY = "music_recently_played";
const MAX_RECENT = 20;

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return {
        currentTrack: data.currentTrack || null,
        progress: data.progress || 0,
      };
    }
  } catch { /* ignore */ }
  return { currentTrack: null, progress: 0 };
}

function persistState(track, progress) {
  try {
    if (track) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentTrack: track,
        progress: Math.floor(progress || 0),
      }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch { /* ignore */ }
}

function loadRecentlyPlayed() {
  try {
    const raw = localStorage.getItem(RECENTLY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function persistRecentlyPlayed(tracks) {
  try {
    localStorage.setItem(RECENTLY_KEY, JSON.stringify(tracks));
  } catch { /* ignore */ }
}

function getTrackId(track) {
  return track?.id || track?._id || track?.trackId || track?.isrc || "";
}

function getTrackLanguage(track) {
  if (typeof track?.language === "string") return track.language.toLowerCase();
  if (Array.isArray(track?.language)) return track.language[0]?.toLowerCase() || "";
  return "";
}

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const restoredRef = useRef(false);
  const { openLogin } = useLoginPopup();

  const persisted = loadPersistedState();
  const [currentTrack, setCurrentTrack] = useState(persisted.currentTrack);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(persisted.progress);
  const [duration, setDuration] = useState(0);

  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("off");

  const [recentlyPlayed, setRecentlyPlayed] = useState(loadRecentlyPlayed);

  const currentTrackRef = useRef(currentTrack);
  const queueRef = useRef(queue);
  const isPlayingRef = useRef(isPlaying);
  const shuffleRef = useRef(shuffle);
  const repeatRef = useRef(repeat);
  const queueIndexRef = useRef(-1);

  useEffect(() => { currentTrackRef.current = currentTrack; }, [currentTrack]);
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { shuffleRef.current = shuffle; }, [shuffle]);
  useEffect(() => { repeatRef.current = repeat; }, [repeat]);

  const addToRecentlyPlayed = useCallback((track) => {
    const trackId = track?.id || track?._id;
    if (!trackId) return;
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((t) => (t.id || t._id) !== trackId);
      const updated = [{ ...track }, ...filtered].slice(0, MAX_RECENT);
      persistRecentlyPlayed(updated);
      return updated;
    });
  }, []);

  // Restore track on mount
  useEffect(() => {
    if (!currentTrack || restoredRef.current) return;
    restoredRef.current = true;

    // Block restore if not logged in
    try {
      const stored = localStorage.getItem("user");
      if (!stored) {
        setCurrentTrack(null);
        setProgress(0);
        return;
      }
    } catch {
      setCurrentTrack(null);
      setProgress(0);
      return;
    }

    const audio = audioRef.current;
    const src = getAudioUrl(currentTrack);
    if (!src) return;

    audio.src = src;
    audio.load();

    const onLoaded = () => {
      const savedTime = persisted.progress || 0;
      if (savedTime > 0 && savedTime < audio.duration) {
        audio.currentTime = savedTime;
      }
      setDuration(audio.duration || 0);
      setProgress(audio.currentTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    persistState(currentTrack, progress);
  }, [currentTrack, progress]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlayingRef.current && audioRef.current.currentTime > 0) {
        setProgress(audioRef.current.currentTime);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  function getAudioUrl(track) {
    let raw =
      track?.audioUrl ||
      track?.previewUrl ||
      track?.preview_url ||
      null;

    if (!raw && track?.downloadUrl) {
      if (typeof track.downloadUrl === "string") {
        raw = track.downloadUrl;
      } else if (Array.isArray(track.downloadUrl)) {
        const match = track.downloadUrl.find((d) => d.quality === "128kbps" || d.quality === "96kbps") || track.downloadUrl[0];
        if (match?.url) raw = match.url;
      } else if (track.downloadUrl.url) {
        raw = track.downloadUrl.url;
      }
    }

    if (!raw) return null;

    if (raw.includes("saavncdn.com") || raw.includes("jiosaavn.com") || raw.includes("jjstudio")) {
      return `/api/music/proxy-audio?url=${encodeURIComponent(raw)}`;
    }

    return raw;
  }

  const playTrack = useCallback((track) => {
    const audio = audioRef.current;
    const src = getAudioUrl(track);

    if (!src) {
      console.error("No playable audio URL found for:", track?.title || track?.name || track);
      return;
    }

    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    audio.src = src;

    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Audio playback failed:", error.message, "URL:", src);
        setIsPlaying(false);
      });
  }, []);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // Attach audio listeners once
  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleError = () => {
      const audio = audioRef.current;
      const errCode = audio.error?.code;
      const errMsg = audio.error?.message;
      console.error("Audio error:", { code: errCode, message: errMsg, src: audio.src });
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  // Smooth progress via requestAnimationFrame
  useEffect(() => {
    const audio = audioRef.current;
    let rafId;

    const tick = () => {
      if (audio && !audio.paused && !audio.ended) {
        setProgress(audio.currentTime);
        if (audio.duration && audio.duration !== duration) {
          setDuration(audio.duration);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    if (isPlaying) {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update queueIndexRef whenever currentTrack changes
  useEffect(() => {
    const idx = queue.findIndex(
      (t) => getTrackId(t) === getTrackId(currentTrack)
    );
    queueIndexRef.current = idx;
  }, [currentTrack, queue]);

  // Pre-fetch more songs of same language when track changes
  useEffect(() => {
    if (!currentTrack) return;
    const lang = getTrackLanguage(currentTrack);
    if (!lang) return;

    let cancelled = false;

    const fetchExtra = async () => {
      try {
        const res = await api.get(
          `/music/discover?language=${encodeURIComponent(lang)}&limit=40`
        );
        if (cancelled) return;
        const newSongs = res.data?.songs || [];
        const curQueue = queueRef.current;
        const existingIds = new Set(curQueue.map((s) => getTrackId(s)));
        const fresh = newSongs.filter((s) => !existingIds.has(getTrackId(s)));

        if (fresh.length > 0 && !cancelled) {
          setQueue((prev) => [...prev, ...fresh]);
        }
      } catch {
        // silent fail
      }
    };

    fetchExtra();
    return () => { cancelled = true; };
  }, [currentTrack]);

  // Pick next same-language track: prefer different category, else random
  function pickNextTrack() {
    const track = currentTrackRef.current;
    const curQueue = queueRef.current;
    if (!track || curQueue.length === 0) return null;

    const lang = getTrackLanguage(track);
    const curId = getTrackId(track);
    const curCategories = Array.isArray(track.category) ? track.category : [];

    // Same-language songs, excluding current track
    const sameLang = lang
      ? curQueue.filter((t) => getTrackLanguage(t) === lang && getTrackId(t) !== curId)
      : curQueue.filter((t) => getTrackId(t) !== curId);

    if (sameLang.length === 0) return null;

    // Prefer different category
    if (curCategories.length > 0) {
      const diffCat = sameLang.filter((t) => {
        const cats = Array.isArray(t.category) ? t.category : [];
        return cats.length > 0 && !cats.some((c) => curCategories.includes(c));
      });
      if (diffCat.length > 0) {
        return diffCat[Math.floor(Math.random() * diffCat.length)];
      }
    }

    // Random from same language
    return sameLang[Math.floor(Math.random() * sameLang.length)];
  }

  const play = useCallback(
    (track, trackQueue = []) => {
      try {
        const stored = localStorage.getItem("user");
        if (!stored) {
          openLogin("Vibe with your favorite songs — login to start listening.");
          return;
        }
      } catch {
        openLogin("Vibe with your favorite songs — login to start listening.");
        return;
      }

      const fullQueue = trackQueue.length > 0 ? trackQueue : [track];

      setCurrentTrack(track);
      setQueue(fullQueue);
      setProgress(0);

      addToRecentlyPlayed(track);
      playTrack(track);
    },
    [playTrack, addToRecentlyPlayed, openLogin]
  );

  const pause = useCallback(() => {
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    audio.src = "";
    setCurrentTrack(null);
    setQueue([]);
    setProgress(0);
    setDuration(0);
    setIsPlaying(false);
    queueIndexRef.current = -1;
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const resume = useCallback(() => {
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((error) => console.error("Resume failed:", error));
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio.src || audio.error) return;
    if (isPlayingRef.current) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error("Resume failed:", error));
    }
  }, []);

  const next = useCallback(() => {
    const nextTrack = pickNextTrack();
    if (nextTrack) {
      setCurrentTrack(nextTrack);
      setProgress(0);
      playTrack(nextTrack);
    } else {
      setIsPlaying(false);
    }
  }, [playTrack]);

  const previous = useCallback(() => {
    const audio = audioRef.current;

    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      setProgress(0);
      return;
    }

    const curQueue = queueRef.current;
    if (curQueue.length === 0) return;

    const idx = queueIndexRef.current;
    let prevIdx = idx - 1;

    if (prevIdx < 0) {
      if (repeatRef.current === "all") {
        prevIdx = curQueue.length - 1;
      } else {
        audio.currentTime = 0;
        setProgress(0);
        return;
      }
    }

    const track = curQueue[prevIdx];
    setCurrentTrack(track);
    setProgress(0);
    queueIndexRef.current = prevIdx;
    playTrack(track);
  }, [playTrack]);

  // Attach ended listener once
  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      if (repeatRef.current === "one") {
        audio.currentTime = 0;
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
        return;
      }

      const nextTrack = pickNextTrack();
      if (nextTrack) {
        setCurrentTrack(nextTrack);
        setProgress(0);
        playTrack(nextTrack);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [playTrack]);

  const seek = useCallback((time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  }, []);

  const changeVolume = useCallback((vol) => {
    audioRef.current.volume = vol;
    setVolume(vol);
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeat((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        queue,
        isPlaying,
        volume,
        progress,
        duration,
        shuffle,
        repeat,
        recentlyPlayed,

        play,
        pause,
        stop,
        resume,
        togglePlay,
        next,
        previous,
        seek,
        changeVolume,
        toggleShuffle,
        toggleRepeat,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error(
      "usePlayer must be used within a PlayerProvider"
    );
  }

  return context;
};
