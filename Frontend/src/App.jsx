import { useState, useCallback } from "react";
import "./input.css";
import Navbar from "./Header/Navbar";
import BottomNavbar from "./Header/BottomNavbar";
import DesktopSidebar from "./components/DesktopSidebar";
import Signup from "./Pages/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Tracks from "./Pages/Tracks";
import Home from "./Pages/Home";
import Songs from "./Pages/Songs";
import Profile from "./Pages/Profile";
import SearchPage from "./Pages/SearchPage";
import ViewAll from "./Pages/ViewAll";
import MobileSearch from "./Pages/MobileSearch";
import MobileLibrary from "./Pages/MobileLibrary";
import LikedSongs from "./Pages/LikedSongs";
import MobileAlbums from "./Pages/MobileAlbums";
import MobileSingers from "./Pages/MobileSingers";
import MobileProfile from "./Pages/MobileProfile";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import HelpSupport from "./Pages/HelpSupport";
import NotFound from "./Pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import MusicPlayer from "./components/MusicPlayer";
import SplashScreen from "./components/SplashScreen";
import { LoginPopupRenderer } from "./Context/LoginPopupContext";
import { usePlayer } from "./Context/PlayerContext";
import { useAuth } from "./Context/AuthContext";

function AppContent() {
  const { currentTrack } = usePlayer();
  const { user } = useAuth();
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <>
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}

      <div className="flex min-h-screen scrollbar-hide overflow-y-auto">
        {user && <DesktopSidebar />}

        <div className="flex-1 flex flex-col min-h-screen min-w-0">
          <Navbar />

          <main
            className={`flex-1 pt-14 lg:pt-16 ${
              currentTrack ? "pb-[132px] lg:pb-24" : "pb-14 lg:pb-0"
            }`}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/songs" element={<ProtectedRoute><Songs /></ProtectedRoute>} />
              <Route path="/tracks" element={<ProtectedRoute><Tracks /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
              <Route path="/view-all" element={<ProtectedRoute><ViewAll /></ProtectedRoute>} />
              <Route path="/m/search" element={<ProtectedRoute><MobileSearch /></ProtectedRoute>} />
              <Route path="/m/library" element={<ProtectedRoute><MobileLibrary /></ProtectedRoute>} />
              <Route path="/m/library/liked" element={<ProtectedRoute><LikedSongs /></ProtectedRoute>} />
              <Route path="/m/library/albums" element={<ProtectedRoute><MobileAlbums /></ProtectedRoute>} />
              <Route path="/m/library/singers" element={<ProtectedRoute><MobileSingers /></ProtectedRoute>} />
              <Route path="/m/profile" element={<ProtectedRoute><MobileProfile /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/help-support" element={<HelpSupport />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>

      <BottomNavbar />
      <MusicPlayer />
      <LoginPopupRenderer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
