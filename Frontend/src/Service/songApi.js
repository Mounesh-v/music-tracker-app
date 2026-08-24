import api from "./api";

export const searchSongs = async (query, page = 1, limit = 10) => {
  const res = await api.get(
    `/music/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
  );
  return res.data;
};

export const getSongById = async (id) => {
  const res = await api.get(`/music/song/${encodeURIComponent(id)}`);
  return res.data;
};

export const getAlbumById = async (id) => {
  const res = await api.get(`/music/album/${encodeURIComponent(id)}`);
  return res.data;
};

export const getArtistById = async (id, page = 1) => {
  const res = await api.get(
    `/music/artist/${encodeURIComponent(id)}?page=${page}`
  );
  return res.data;
};
