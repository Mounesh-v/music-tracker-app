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


export const likeSong = async (songId) => {
  const response = await api.post(`/users/like/${songId}`);
  return response.data;
};

export const unlikeSong = async (songId) => {
  const response = await api.delete(`/users/liked-songs/${songId}`);
  return response.data;
};

export const getLikedSongs = async () => {
  const response = await api.get("/users/liked-songs");
  return response.data;
};

export const getSongsByIds = async (ids) => {
  if (!ids || ids.length === 0) return { data: [] };
  const response = await api.get(`/music/songs?ids=${ids.join(",")}`);
  return response.data;
};

export const createPlaylist = async (name, description = "") => {
  const response = await api.post("/playlists", { name, description });
  return response.data;
};

export const getUserPlaylists = async () => {
  const response = await api.get("/playlists");
  return response.data;
};

export const getPlaylistById = async (id) => {
  const response = await api.get(`/playlists/${id}`);
  return response.data;
};

export const updatePlaylist = async (id, data) => {
  const response = await api.put(`/playlists/${id}`, data);
  return response.data;
};

export const deletePlaylist = async (id) => {
  const response = await api.delete(`/playlists/${id}`);
  return response.data;
};

export const addSongToPlaylist = async (playlistId, songId) => {
  const response = await api.post(`/playlists/${playlistId}/songs/${songId}`);
  return response.data;
};

export const removeSongFromPlaylist = async (playlistId, songId) => {
  const response = await api.delete(`/playlists/${playlistId}/songs/${songId}`);
  return response.data;
};
