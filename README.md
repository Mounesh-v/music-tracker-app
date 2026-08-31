# VibeTune

A modern music streaming web application built with React, Node.js, Express, and MongoDB. VibeTune provides a Spotify-like experience with music discovery, search, playback, playlists, and liked songs — powered by JioSaavn's music catalog.

> This application is an independent project created for educational and portfolio purposes. It is not affiliated with, endorsed by, sponsored by, or officially connected with JioSaavn or any of its parent companies or partners.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Frontend Routes](#frontend-routes)
- [Architecture](#architecture)
- [How Songs Are Fetched](#how-songs-are-fetched)
- [Audio Playback](#audio-playback)
- [Data Models](#data-models)
- [License](#license)

---

## Features

- **Music Discovery** — Trending songs, category-based browsing, language-specific recommendations
- **Search** — Real-time song, artist, and album search powered by JioSaavn
- **Music Player** — Full-featured player with play/pause, seek, shuffle, repeat, volume control
- **Now Playing Modal** — Full-screen player view with album art and controls
- **Liked Songs** — Like/unlike songs with persistent storage
- **Playlists** — Create, manage, and add songs to custom playlists
- **Recently Played** — Auto-tracked listening history persisted in localStorage
- **User Authentication** — JWT-based signup/login with protected routes
- **User Profiles** — Profile management with avatar and bio
- **Responsive Design** — Mobile-first UI with separate mobile and desktop layouts
- **Audio Proxy** — Backend proxy for streaming JioSaavn audio with proper headers
- **Splash Screen** — Animated loading screen on app launch

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 19 | UI library |
| Vite 6 | Build tool and dev server |
| React Router 7 | Client-side routing |
| Tailwind CSS 4 | Utility-first styling |
| Axios | HTTP client |
| Lucide React | Icon library |
| Framer Motion | Animations |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express 5 | Web framework |
| MongoDB + Mongoose | Database and ODM |
| JioSaavn SDK | Music data and streaming |
| bcryptjs | Password hashing |
| JSON Web Token | Authentication |
| node-forge | DES-ECB URL decryption |

---

## Project Structure

```
New_Music/
├── Backend/
│   ├── Config/
│   │   └── db.js                    # MongoDB connection with caching
│   ├── Controller/
│   │   ├── JioSaavnController.js    # Music search, catalog, streaming
│   │   ├── User.js                  # Auth, profile, liked songs
│   │   ├── PlaylistController.js    # CRUD for playlists
│   │   ├── SongsController.js       # Local song management
│   │   └── AlbumController.js       # Album operations
│   ├── MiddleWare/
│   │   └── authMiddleware.js        # JWT verification middleware
│   ├── Model/
│   │   ├── User.js                  # User schema with likedSongs
│   │   ├── Playlist.js              # Playlist schema with songs array
│   │   ├── Songs.js                 # Local songs schema
│   │   └── Album.js                 # Album schema
│   ├── Routes/
│   │   ├── UserRoutes.js            # /api/users/*
│   │   ├── JioSaavnRoutes.js        # /api/music/*
│   │   ├── PlaylistRoutes.js        # /api/playlists/*
│   │   ├── songRoutes.js            # /api/songs/*
│   │   └── AlbumRoute.js            # /api/albums/*
│   ├── index.js                     # Express app entry point
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MusicPlayer.jsx          # Desktop + mobile mini player
│   │   │   ├── NowPlayingModal.jsx      # Full-screen player modal
│   │   │   ├── AddToPlaylistModal.jsx   # Add song to playlist
│   │   │   ├── NewPlaylistModal.jsx     # Create new playlist
│   │   │   ├── DesktopSidebar.jsx       # Desktop navigation sidebar
│   │   │   ├── SplashScreen.jsx         # Animated splash screen
│   │   │   ├── ProtectedRoute.jsx       # Auth route guard
│   │   │   ├── SongCard.jsx             # Song card component
│   │   │   ├── SongList.jsx             # Song list component
│   │   │   ├── ScrollRow.jsx            # Horizontal scroll row
│   │   │   ├── FeaturedSection.jsx      # Featured music section
│   │   │   ├── Hero.jsx                 # Hero banner
│   │   │   ├── Pagination.jsx           # Pagination controls
│   │   │   └── ...
│   │   ├── Pages/
│   │   │   ├── Home.jsx                 # Home page with discovery
│   │   │   ├── SearchPage.jsx           # Search page
│   │   │   ├── Songs.jsx                # Categories page
│   │   │   ├── Tracks.jsx               # Top charts page
│   │   │   ├── Profile.jsx              # Desktop profile
│   │   │   ├── MobileLibrary.jsx        # Mobile library hub
│   │   │   ├── MobileProfile.jsx        # Mobile profile
│   │   │   ├── MobileSearch.jsx         # Mobile search
│   │   │   ├── LikedSongs.jsx           # Liked songs list
│   │   │   ├── PlaylistDetail.jsx       # Playlist song list
│   │   │   ├── MobileAlbums.jsx         # Albums grid
│   │   │   ├── MobileSingers.jsx        # Singers grid
│   │   │   ├── PrivacyPolicy.jsx        # Privacy policy page
│   │   │   ├── HelpSupport.jsx          # Help & support page
│   │   │   ├── Login.jsx                # Login form
│   │   │   ├── Signup.jsx               # Signup form
│   │   │   ├── ViewAll.jsx              # View all songs
│   │   │   └── NotFound.jsx             # 404 page
│   │   ├── Context/
│   │   │   ├── PlayerContext.jsx         # Audio player state
│   │   │   ├── AuthContext.jsx           # Authentication state
│   │   │   └── LoginPopupContext.jsx     # Login popup state
│   │   ├── Service/
│   │   │   ├── api.js                    # Axios instance + interceptors
│   │   │   └── songApi.js               # All API functions
│   │   ├── Header/
│   │   │   ├── Navbar.jsx                # Top navigation bar
│   │   │   └── BottomNavbar.jsx          # Mobile bottom nav
│   │   ├── hooks/
│   │   │   └── useDebounce.js            # Debounce hook
│   │   ├── theme/                        # Theme configuration
│   │   ├── App.jsx                       # Router + layout
│   │   ├── main.jsx                      # Entry point
│   │   └── input.css                     # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Mounesh-v/music-tracker-app.git
cd New_Music

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

### Running the App

```bash
# Start backend (from Backend/)
node index.js

# Start frontend (from Frontend/)
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies `/api` requests to `http://localhost:3000`.

---

## Environment Variables

### Backend (`Backend/.env`)

```env
PORT=3000
URI=mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend (`Frontend/.env`)

```env
VITE_API_URL=/api
```

---

## API Endpoints

### Authentication & Users (`/api/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/signup` | Create account | No |
| POST | `/login` | Login | No |
| GET | `/me` | Validate token | Yes |
| GET | `/profile` | Get profile | Yes |
| PUT | `/profile` | Update profile | Yes |
| PUT | `/password` | Change password | Yes |
| POST | `/like/:songId` | Like a song | Yes |
| DELETE | `/liked-songs/:songId` | Unlike a song | Yes |
| GET | `/liked-songs` | Get liked song IDs | Yes |

### Music (`/api/music`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/discover` | Catalog with filters | No |
| GET | `/trending` | Trending songs | No |
| GET | `/trending-by-language` | Songs by language | No |
| GET | `/search?q=...` | Search songs | No |
| GET | `/song/:id` | Get song by ID | No |
| GET | `/songs?ids=...` | Batch fetch songs | No |
| GET | `/album/:id` | Get album | No |
| GET | `/artist/:id` | Get artist songs | No |
| GET | `/proxy-audio?url=...` | Proxy audio stream | No |

### Playlists (`/api/playlists`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create playlist | Yes |
| GET | `/` | Get user's playlists | Yes |
| GET | `/:id` | Get playlist by ID | Yes |
| PUT | `/:id` | Update playlist | Yes |
| DELETE | `/:id` | Delete playlist | Yes |
| POST | `/:id/songs/:songId` | Add song to playlist | Yes |
| DELETE | `/:id/songs/:songId` | Remove song from playlist | Yes |

---

## Frontend Routes

### Public Routes

| Route | Page |
|-------|------|
| `/` | Home (music discovery) |
| `/login` | Login |
| `/signup` | Signup |
| `/privacy` | Privacy Policy |
| `/help-support` | Help & Support |

### Protected Routes

| Route | Page |
|-------|------|
| `/search` | Search (desktop) |
| `/songs` | Categories (desktop) |
| `/tracks` | Top Charts (desktop) |
| `/view-all` | View All Songs |
| `/profile` | Profile (desktop) |
| `/m/search` | Search (mobile) |
| `/m/library` | Library hub (mobile) |
| `/m/library/liked` | Liked Songs |
| `/m/library/playlist/:id` | Playlist Detail |
| `/m/library/albums` | Albums |
| `/m/library/singers` | Singers |
| `/m/profile` | Profile (mobile) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  Pages    │  │Components│  │   Context Providers   │  │
│  │          │  │          │  │                       │  │
│  │ Home     │  │ Player   │  │ PlayerContext          │  │
│  │ Search   │  │ Sidebar  │  │ (audio, queue, state)  │  │
│  │ Library  │  │ Modals   │  │                       │  │
│  │ Profile  │  │ Cards    │  │ AuthContext            │  │
│  └──────────┘  └──────────┘  │ (user, token, login)  │  │
│                               └──────────────────────┘  │
│                         │                               │
│                    songApi.js (Axios)                    │
└─────────────────────────┼───────────────────────────────┘
                          │ /api/*
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend (Express)                       │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Routes & Controllers                 │   │
│  │                                                   │   │
│  │  /api/users    → User.js (auth, liked songs)      │   │
│  │  /api/music    → JioSaavnController.js            │   │
│  │  /api/playlists→ PlaylistController.js            │   │
│  └──────────────────────────────────────────────────┘   │
│                          │                              │
│            ┌─────────────┼─────────────┐                │
│            ▼             ▼             ▼                │
│     ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│     │ MongoDB  │  │ JioSaavn │  │  Cache   │           │
│     │ (Users,  │  │  API/SDK │  │ (In-Mem) │           │
│     │ Playlists│  │          │  │          │           │
│     └──────────┘  └──────────┘  └──────────┘           │
└─────────────────────────────────────────────────────────┘
```

---

## How Songs Are Fetched

### 1. Catalog Generation (Startup)

On server start, `warmCatalog()` triggers background generation:

```
warmCatalog()
  → getCatalog() / getTrending() / getLanguageSongs()
    → generateCatalog() / fetchTrendingSongs() / fetchLanguageSongs()
      → jioFetch("search.getResults", { q, p, n })
        → Raw JioSaavn API call
      → normalizeRawSong(raw)
        → Standardized song object
      → Stored in in-memory cache (15 min TTL)
```

### 2. Song Normalization

Every song from JioSaavn is normalized to a consistent shape:

```javascript
{
  id: "song_123",              // JioSaavn string ID
  title: "Song Name",
  artist: "Artist Name",
  album: "Album Name",
  image: "https://...",        // Album art URL
  duration: 240,               // Seconds
  previewUrl: "https://...",   // Audio stream URL
  language: "telugu",
  year: "2024",
  playCount: 12345,
  category: ["Trending"],      // Only in catalog
  audioUrl: "https://...",     // Same as previewUrl
}
```

### 3. Frontend Data Flow

```
User Action          Frontend                    Backend              JioSaavn
─────────────        ────────                    ───────              ────────
Home page loads  →   GET /music/discover     →   Return cached    →   (pre-fetched)
Search query     →   GET /music/search?q=...  →   jioFetch()       →   API call
Tap song to play →   play(track)              →   —                →   —
Like a song      →   POST /users/like/:id     →   Update MongoDB   →   —
Open library     →   GET /users/liked-songs   →   Read MongoDB     →   —
                     GET /playlists           →   Read MongoDB     →   —
View liked       →   IDs from liked-songs     →   —                →   —
                     GET /music/songs?ids=...  →   Batch fetch      →   SDK call
```

### 4. Batch Song Fetching

When the frontend needs full song details from IDs (liked songs, playlists):

```
1. Get IDs from MongoDB: ["song_abc", "song_def", ...]
2. Call: GET /api/music/songs?ids=song_abc,song_def
3. Backend: songService.getSongByIds({ songIds: "song_abc,song_def" })
4. Normalize each result
5. Return full song objects to frontend
```

---

## Audio Playback

### Audio URL Resolution

```
track.audioUrl || track.previewUrl || track.preview_url
  ↓
If JioSaavn URL (saavncdn.com / jiosaavn.com):
  → Proxy through /api/music/proxy-audio?url=<encoded_url>
  → Backend fetches with proper headers (Referer, Origin)
  → Streams to client
  ↓
Otherwise:
  → Play directly
```

### Player State (PlayerContext)

```javascript
{
  currentTrack: Song,        // Currently playing song
  queue: Song[],             // Playback queue
  isPlaying: boolean,        // Play state
  volume: number,            // 0-1
  progress: number,          // Current time in seconds
  duration: number,          // Total duration
  shuffle: boolean,          // Shuffle mode
  repeat: "off"|"all"|"one", // Repeat mode
  recentlyPlayed: Song[],    // Last 20 played songs (localStorage)
}
```

### Playback Features

- **Auto-play next**: Picks next song from same language, prefers different category
- **Shuffle**: Random selection from queue
- **Repeat one/all/off**: Configurable repeat behavior
- **State persistence**: Current track + progress saved to localStorage
- **Pre-fetching**: Fetches more songs of same language when track changes

---

## Data Models

### User

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  profileImage: String (default: ""),
  bio: String (default: ""),
  likedSongs: [String],           // JioSaavn song IDs
  timestamps: true
}
```

### Playlist

```javascript
{
  name: String (required, trim),
  description: String (default: ""),
  image: String (default: ""),
  owner: ObjectId (ref: User, required),
  songs: [String],                // JioSaavn song IDs
  timestamps: true
}
```

### Songs (Local)

```javascript
{
  external_urls: String (required),
  image: String (required),
  songName: String (required),
  is_playable: Boolean (required),
  singer: String (required),
  duration_ms: Number (required),
  isrc: String (required, unique),
  preview_url: String (required),
  release_date: String (required),
  timestamps: true
}
```

---

## Desktop vs Mobile

The app provides separate layouts for desktop and mobile:

| Feature | Desktop | Mobile |
|---------|---------|--------|
| Navigation | Sidebar (`DesktopSidebar`) | Bottom nav (`BottomNavbar`) |
| Library | Sidebar links | `/m/library` hub page |
| Profile | `/profile` | `/m/profile` |
| Search | `/search` | `/m/search` |
| Player | Fixed bottom bar | Mini player + full modal |
| Layout | Side-by-side | Stacked/full-screen |

---

## Disclaimer

This application is an independent project created for educational and portfolio purposes. It is not affiliated with, endorsed by, sponsored by, or officially connected with JioSaavn or any of its parent companies or partners.

The application uses publicly available music data and services through backend integration for music discovery and related functionality. All music content, artists, albums, artwork, and audio are the property of their respective owners. The application does not claim ownership of any third-party intellectual property.

---

## License

ISC
