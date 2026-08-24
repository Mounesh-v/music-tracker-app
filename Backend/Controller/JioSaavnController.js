import { SearchService, SongService, AlbumService, ArtistService } from "jiosaavn-sdk";

const searchService = new SearchService();
const songService = new SongService();
const albumService = new AlbumService();
const artistService = new ArtistService();

// ── Existing normalizeSong (kept for other endpoints) ──────────────
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
  previewUrl: song.downloadUrl?.find((d) => d.quality === "128kbps")?.url
    || song.downloadUrl?.[0]?.url
    || "",
  url: song.url || "",
  year: song.year || "",
  playCount: song.playCount || 0,
});

// ── Catalog normalizeSong (adds audioUrl + category) ───────────────
const normalizeSongForCatalog = (song, categories = []) => {
  const base = normalizeSong(song);
  return {
    ...base,
    audioUrl: base.previewUrl,
    category: categories,
  };
};

// ── In-memory catalog cache ────────────────────────────────────────
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

let catalogCache = {
  songs: [],
  createdAt: null,
};

let isGenerating = false;
let generationPromise = null;

// ── Search queries for diverse catalog ─────────────────────────────
const LANGUAGE_QUERIES = [
  { query: "telugu songs", language: "telugu" },
  { query: "kannada songs", language: "kannada" },
  { query: "tamil songs", language: "tamil" },
  { query: "hindi songs", language: "hindi" },
  { query: "malayalam songs", language: "malayalam" },
  { query: "punjabi songs", language: "punjabi" },
];

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

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function generateCatalog() {
  const seen = new Map();
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
      const result = await searchService.searchSongs({
        query: entry.query,
        page: 1,
        limit: 20,
      });

      for (const song of result.results) {
        if (seen.size >= 220) break;
        if (!song.id || seen.has(song.id)) continue;

        const existing = seen.get(song.id);
        const mergedCategories = [
          ...new Set([...(entry.categories || []), ...(existing?.category || [])]),
        ];

        seen.set(song.id, normalizeSongForCatalog(song, mergedCategories));
      }
    } catch {
      // Skip failed queries gracefully
    }
  }

  return [...seen.values()].slice(0, 200);
}

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

  if (isGenerating && generationPromise) {
    return generationPromise;
  }

  isGenerating = true;
  generationPromise = generateCatalog()
    .then((songs) => {
      catalogCache = { songs, createdAt: Date.now() };
      return songs;
    })
    .finally(() => {
      isGenerating = false;
      generationPromise = null;
    });

  return generationPromise;
}

// ── GET /api/music/discover ────────────────────────────────────────
export const discoverCatalog = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 20));
    const language = (req.query.language || "").trim();
    const category = (req.query.category || "").trim();
    const refresh = req.query.refresh === "true";

    const allSongs = await getCatalog(refresh);

    let filtered = allSongs;

    if (language && language !== "All") {
      filtered = filtered.filter(
        (s) => s.language.toLowerCase() === language.toLowerCase()
      );
    }

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

    const result = await searchService.searchSongs({
      query: q.trim(),
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      total: result.total,
      data: result.results.map(normalizeSong),
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
