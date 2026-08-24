import { SongService, AlbumService, ArtistService } from "jiosaavn-sdk";
import forge from "node-forge";

const songService = new SongService();
const albumService = new AlbumService();
const artistService = new ArtistService();

// ── JioSaavn DES-ECB decryption (matches SDK internals) ──────────────
const DES_KEY = "38346591";

function decryptUrl(encryptedMediaUrl) {
  if (!encryptedMediaUrl) return "";
  try {
    const encrypted = forge.util.decode64(encryptedMediaUrl);
    const decipher = forge.cipher.createDecipher("DES-ECB", forge.util.createBuffer(DES_KEY));
    decipher.start({ iv: forge.util.createBuffer("00000000") });
    decipher.update(forge.util.createBuffer(encrypted));
    decipher.finish();
    return decipher.output.getBytes() || "";
  } catch (err) {
    console.error("decryptUrl failed:", err.message);
    return encryptedMediaUrl;
  }
}

// ── Direct JioSaavn API fetch (bypasses node-forge) ────────────────
const JIO_API = "https://www.jiosaavn.com/api.php";
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
];

async function jioFetch(__call, params = {}, timeoutMs = 10000) {
  const url = new URL(JIO_API);
  url.searchParams.append("__call", __call);
  url.searchParams.append("_format", "json");
  url.searchParams.append("_marker", "0");
  url.searchParams.append("api_version", "4");
  url.searchParams.append("ctx", "web6dot0");

  for (const [k, v] of Object.entries(params)) {
    url.searchParams.append(k, String(v));
  }

  const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": ua,
      },
      signal: controller.signal,
    });
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

// ── Normalize raw JioSaavn API song ────────────────────────────────
function normalizeRawSong(raw) {
  if (!raw || !raw.id) return null;

  const imageUrl = raw.image || "";
  const fixProtocol = (s) => (s || "").replace(/^http:\/\//, "https://");

  const artists =
    raw.more_info?.artistMap?.primary_artists?.map((a) => a.name) || [];
  const duration = raw.more_info?.duration ? Number(raw.more_info.duration) : 0;

  return {
    id: raw.id,
    title: raw.title || raw.song || "",
    artist: artists.length > 0 ? artists.join(", ") : "Unknown",
    album: raw.more_info?.album || "",
    image: fixProtocol(imageUrl),
    duration,
    language: raw.language || "",
    previewUrl: fixProtocol(decryptUrl(raw.more_info?.encrypted_media_url || "")),
    url: raw.perma_url || "",
    year: raw.year || "",
    playCount: raw.play_count ? Number(raw.play_count) : 0,
  };
}

// ── Existing normalizeSong (kept for SDK-based endpoints) ───────────
const normalizeSong = (song) => ({
  id: song.id,
  title: song.name,
  artist:
    song.artists?.primary?.map((a) => a.name).join(", ") || "Unknown",
  album: song.album?.name || "",
  image: song.image?.find((img) => img.quality === "500x500")?.url
    || song.image?.find((img) => img.quality === "150x150")?.url
    || "",
  duration: song.duration || 0,
  language: song.language || "",
  previewUrl: song.downloadUrl?.find((d) => d.quality === "96kbps")?.url
    || song.downloadUrl?.[0]?.url
    || "",
  url: song.url || "",
  year: song.year || "",
  playCount: song.playCount || 0,
});

// ── Catalog normalizeSong (adds audioUrl + category) ───────────────
const normalizeSongForCatalog = (raw, categories = []) => {
  const base = normalizeRawSong(raw);
  if (!base) return null;
  return {
    ...base,
    audioUrl: base.previewUrl,
    category: categories,
  };
};

// ── In-memory caches ───────────────────────────────────────────────
const CACHE_TTL_MS = 15 * 60 * 1000;

let catalogCache = { songs: [], createdAt: null };
let trendingCache = { songs: [], createdAt: null };
const languageCaches = new Map();

let isGeneratingCatalog = false;
let catalogGenPromise = null;
let isGeneratingTrending = false;
let trendingGenPromise = null;
const languageGenPromises = new Map();

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Direct search via raw API ───────────────────────────────────────
async function rawSearch(query, page = 1, limit = 20) {
  const data = await jioFetch("search.getResults", { q: query, p: page, n: limit });
  return {
    total: data.total || 0,
    results: (data.results || []).filter(Boolean),
  };
}

// ── Fetch trending songs directly ───────────────────────────────────
async function fetchTrendingSongs(limit = 50) {
  const data = await jioFetch("content.getTrending", { language: "all" });
  const items = Array.isArray(data) ? data : data?.results || data?.data || [];
  const songs = items.filter((item) => item?.id && item.type === "song");

  if (songs.length > 0) {
    return songs.slice(0, limit).map(normalizeRawSong).filter(Boolean);
  }

  const fallback = await rawSearch("trending songs", 1, limit);
  return fallback.results.map(normalizeRawSong).filter(Boolean);
}

// ── Fetch language songs via search (content.getTrending ignores language) ──
const LANGUAGE_SEARCH_QUERIES = {
  telugu: ["telugu hits", "telugusongs", "telugu film songs"],
  tamil: ["tamil hits", "tamil songs", "kollywood songs"],
  hindi: ["hindi hits", "bollywood songs", "hindi film songs"],
  kannada: ["kannada hits", "kannada songs", "sandalwood songs"],
  malayalam: ["malayalam hits", "malayalam songs", "mollywood songs"],
  punjabi: ["punjabi hits", "punjabi songs", "punjabi pop"],
};

async function fetchLanguageSongs(language, limit = 5) {
  const lang = language.toLowerCase();
  const queries = LANGUAGE_SEARCH_QUERIES[lang] || [`${lang} songs`];
  const seen = new Set();
  const results = [];

  for (const query of queries) {
    if (results.length >= limit) break;
    try {
      const data = await jioFetch("search.getResults", { q: query, p: 1, n: 20 });
      const songs = data?.results || [];
      for (const raw of songs) {
        if (results.length >= limit) break;
        if (!raw?.id || seen.has(raw.id)) continue;
        const songLang = (raw.language || "").toLowerCase();
        if (songLang !== lang) continue;
        seen.add(raw.id);
        const normalized = normalizeRawSong(raw);
        if (normalized) results.push(normalized);
      }
    } catch (err) {
      console.error(`Language search failed (${lang}/${query}):`, err.message);
    }
  }

  return results;
}

// ── Generate full catalog (with direct API fallback) ────────────────
async function generateCatalog() {
  const seen = new Map();

  const CATEGORY_QUERIES = [
    { query: "love songs", categories: ["Love"] },
    { query: "romantic songs", categories: ["Romantic"] },
    { query: "melody songs", categories: ["Melody"] },
    { query: "sad songs", categories: ["Sad"] },
    { query: "party songs", categories: ["Party"] },
    { query: "workout songs", categories: ["Workout"] },
    { query: "chill songs", categories: ["Chill"] },
    { query: "classical songs", categories: ["Classical"] },
    { query: "devotional songs", categories: ["Devotional"] },
    { query: "trending songs", categories: ["Trending"] },
  ];

  const ARTIST_QUERIES = [
    "Sid Sriram",
    "Anirudh Ravichander",
    "Devi Sri Prasad",
    "Arijit Singh",
    "A R Rahman",
    "Ilaiyaraaja",
    "Sonu Nigam",
  ];

  const LANGUAGE_QUERIES = [
    { query: "telugu songs", language: "telugu" },
    { query: "kannada songs", language: "kannada" },
    { query: "tamil songs", language: "tamil" },
    { query: "hindi songs", language: "hindi" },
    { query: "malayalam songs", language: "malayalam" },
    { query: "punjabi songs", language: "punjabi" },
  ];

  const allQueries = [
    ...shuffleArray(LANGUAGE_QUERIES).map((q) => ({
      ...q,
      categories: [],
    })),
    ...shuffleArray(CATEGORY_QUERIES),
    ...shuffleArray(ARTIST_QUERIES).map((q) => ({
      query: q,
      categories: ["Trending"],
    })),
  ];

  for (const entry of allQueries) {
    if (seen.size >= 220) break;

    try {
      const data = await jioFetch("search.getResults", {
        q: entry.query,
        p: 1,
        n: 20,
      });
      const songs = data?.results || [];

      for (const raw of songs) {
        if (seen.size >= 220) break;
        if (!raw?.id) continue;

        if (seen.has(raw.id)) {
          const existing = seen.get(raw.id);
          const merged = [
            ...new Set([...(entry.categories || []), ...(existing?.category || [])]),
          ];
          existing.category = merged;
        } else {
          const normalized = normalizeSongForCatalog(raw, entry.categories || []);
          if (normalized) seen.set(raw.id, normalized);
        }
      }
    } catch (err) {
      console.error("Catalog query failed:", entry.query, err.message);
    }
  }

  console.log(`Catalog generated: ${seen.size} songs`);
  return [...seen.values()].slice(0, 200);
}

// ── Catalog getter ──────────────────────────────────────────────────
async function getCatalog(forceRefresh = false) {
  const now = Date.now();

  if (
    !forceRefresh &&
    catalogCache.songs.length > 0 &&
    catalogCache.createdAt &&
    now - catalogCache.createdAt < CACHE_TTL_MS
  ) {
    return catalogCache.songs;
  }

  if (isGeneratingCatalog && catalogGenPromise) {
    return catalogGenPromise;
  }

  isGeneratingCatalog = true;
  catalogGenPromise = generateCatalog()
    .then((songs) => {
      catalogCache = { songs, createdAt: Date.now() };
      return songs;
    })
    .catch((err) => {
      console.error("Catalog generation failed:", err.message);
      return catalogCache.songs.length > 0 ? catalogCache.songs : [];
    })
    .finally(() => {
      isGeneratingCatalog = false;
      catalogGenPromise = null;
    });

  return catalogGenPromise;
}

// ── Trending getter ─────────────────────────────────────────────────
async function getTrending(forceRefresh = false) {
  const now = Date.now();

  if (
    !forceRefresh &&
    trendingCache.songs.length > 0 &&
    trendingCache.createdAt &&
    now - trendingCache.createdAt < CACHE_TTL_MS
  ) {
    return trendingCache.songs;
  }

  if (isGeneratingTrending && trendingGenPromise) {
    return trendingGenPromise;
  }

  isGeneratingTrending = true;
  trendingGenPromise = fetchTrendingSongs(50)
    .then((songs) => {
      trendingCache = { songs, createdAt: Date.now() };
      console.log(`Trending loaded: ${songs.length} songs`);
      return songs;
    })
    .catch((err) => {
      console.error("Trending fetch failed:", err.message);
      return trendingCache.songs.length > 0 ? trendingCache.songs : [];
    })
    .finally(() => {
      isGeneratingTrending = false;
      trendingGenPromise = null;
    });

  return trendingGenPromise;
}

// ── Language getter ─────────────────────────────────────────────────
async function getLanguageSongs(language, forceRefresh = false, limit = 5) {
  const cacheKey = `${language}_${limit}`;
  const cache = languageCaches.get(cacheKey) || { songs: [], createdAt: null };
  const now = Date.now();

  if (
    !forceRefresh &&
    cache.songs.length > 0 &&
    cache.createdAt &&
    now - cache.createdAt < CACHE_TTL_MS
  ) {
    return cache.songs;
  }

  if (languageGenPromises.has(cacheKey)) {
    return languageGenPromises.get(cacheKey);
  }

  const generationPromise = fetchLanguageSongs(language, limit)
    .then((songs) => {
      languageCaches.set(cacheKey, { songs, createdAt: Date.now() });
      console.log(`${language} songs loaded: ${songs.length}`);
      return songs;
    })
    .catch((err) => {
      console.error(`${language} fetch failed:`, err.message);
      return cache.songs.length > 0 ? cache.songs : [];
    })
    .finally(() => {
      languageGenPromises.delete(cacheKey);
    });

  languageGenPromises.set(cacheKey, generationPromise);
  return generationPromise;
}

// ── Warm all caches on startup ──────────────────────────────────────
export function warmCatalog() {
  getTrending(true).catch(() => {});
  ["telugu", "tamil", "hindi", "kannada", "malayalam", "punjabi"].forEach((lang) =>
    getLanguageSongs(lang, true, 5).catch(() => {})
  );
  getCatalog(true).catch(() => {});
}

// ── GET /api/music/trending-by-language ────────────────────────────
export const getTrendingByLanguage = async (req, res) => {
  try {
    const limit = Math.min(10, Math.max(1, Number(req.query.limit) || 5));
    const languages = ["telugu", "tamil", "hindi", "kannada", "malayalam", "punjabi"];

    const results = await Promise.all(
      languages.map(async (lang) => {
        try {
          const songs = await getLanguageSongs(lang, false, limit);
          return { language: lang, songs };
        } catch {
          return { language: lang, songs: [] };
        }
      })
    );

    res.status(200).json({
      success: true,
      languages: results,
    });
  } catch (error) {
    console.error("Trending by language error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to load trending by language",
      error: error.message,
    });
  }
};

// ── GET /api/music/trending ───────────────────────────────────────
export const getTrendingSongs = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const refresh = req.query.refresh === "true";
    const trending = await getTrending(refresh);
    const totalSongs = trending.length;
    const totalPages = Math.max(1, Math.ceil(totalSongs / limit));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * limit;

    res.status(200).json({
      success: true,
      songs: trending.slice(startIndex, startIndex + limit),
      pagination: {
        page: safePage,
        limit,
        totalSongs,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPreviousPage: safePage > 1,
      },
    });
  } catch (error) {
    console.error("Trending songs error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to load trending songs",
      error: error.message,
    });
  }
};

// ── GET /api/music/discover ────────────────────────────────────────
export const discoverCatalog = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 20));
    const language = (req.query.language || "").trim();
    const category = (req.query.category || "").trim();
    const refresh = req.query.refresh === "true";

    // Fast path: trending
    if (category && category.toLowerCase() === "trending") {
      const trending = await getTrending(refresh);
      const totalSongs = trending.length;
      const totalPages = Math.max(1, Math.ceil(totalSongs / limit));
      const safePage = Math.min(page, totalPages);
      const startIndex = (safePage - 1) * limit;
      const paginatedSongs = trending.slice(startIndex, startIndex + limit);

      return res.status(200).json({
        success: true,
        songs: paginatedSongs,
        pagination: {
          page: safePage,
          limit,
          totalSongs,
          totalPages,
          hasNextPage: safePage < totalPages,
          hasPreviousPage: safePage > 1,
        },
        filters: { language: "All", category },
      });
    }

    // Fast path: language-specific
    if (language && language !== "All") {
      const songs = await getLanguageSongs(language.toLowerCase(), refresh, 50);
      const totalSongs = songs.length;
      const totalPages = Math.max(1, Math.ceil(totalSongs / limit));
      const safePage = Math.min(page, totalPages);
      const startIndex = (safePage - 1) * limit;
      const paginatedSongs = songs.slice(startIndex, startIndex + limit);

      return res.status(200).json({
        success: true,
        songs: paginatedSongs,
        pagination: {
          page: safePage,
          limit,
          totalSongs,
          totalPages,
          hasNextPage: safePage < totalPages,
          hasPreviousPage: safePage > 1,
        },
        filters: { language, category: "All" },
      });
    }

    // General catalog path
    const allSongs = await getCatalog(refresh);
    let filtered = allSongs;

    if (category && category !== "All") {
      filtered = filtered.filter((s) =>
        s.category.some(
          (c) => c.toLowerCase() === category.toLowerCase()
        )
      );
    }

    const totalSongs = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalSongs / limit));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * limit;
    const paginatedSongs = filtered.slice(startIndex, startIndex + limit);

    res.status(200).json({
      success: true,
      songs: paginatedSongs,
      pagination: {
        page: safePage,
        limit,
        totalSongs,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPreviousPage: safePage > 1,
      },
      filters: {
        language: language || "All",
        category: category || "All",
      },
    });
  } catch (error) {
    console.error("Discover catalog error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to load catalog",
      error: error.message,
    });
  }
};

// ── Existing search endpoint ───────────────────────────────────────
export const searchSongs = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query (q) is required",
      });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await jioFetch("search.getResults", {
      q: q.trim(),
      p: page,
      n: limit,
    });

    const songs = (data.results || []).map(normalizeRawSong).filter(Boolean);

    res.status(200).json({
      success: true,
      total: data.total || 0,
      data: songs,
    });
  } catch (error) {
    console.error("JioSaavn search error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to search songs",
      error: error.message,
    });
  }
};

export const getSongById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Song ID is required",
      });
    }

    const songs = await songService.getSongByIds({ songIds: id });

    res.status(200).json({
      success: true,
      data: songs.map(normalizeSong),
    });
  } catch (error) {
    console.error("JioSaavn song error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get song",
      error: error.message,
    });
  }
};

export const getAlbumById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Album ID is required",
      });
    }

    const album = await albumService.getAlbumById(id);

    const normalizedAlbum = {
      id: album.id,
      name: album.name,
      year: album.year,
      language: album.language,
      playCount: album.playCount,
      description: album.description,
      songCount: album.songCount,
      image: album.image?.find((img) => img.quality === "500x500")?.url
        || album.image?.[0]?.url
        || "",
      artists: album.artists?.primary?.map((a) => a.name).join(", ") || "Unknown",
      songs: (album.songs || []).map(normalizeSong),
    };

    res.status(200).json({
      success: true,
      data: normalizedAlbum,
    });
  } catch (error) {
    console.error("JioSaavn album error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get album",
      error: error.message,
    });
  }
};

export const getArtistById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Artist ID is required",
      });
    }

    const page = Number(req.query.page) || 1;
    const sortBy = req.query.sortBy || "popularity";
    const sortOrder = req.query.sortOrder || "desc";

    const result = await artistService.getArtistSongs({
      artistId: id,
      page,
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      success: true,
      total: result.total,
      data: result.songs.map(normalizeSong),
    });
  } catch (error) {
    console.error("JioSaavn artist error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get artist songs",
      error: error.message,
    });
  }
};
