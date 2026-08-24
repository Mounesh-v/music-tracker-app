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
import ProtectedRoute from "./components/ProtectedRoute";
import MusicPlayer from "./components/MusicPlayer";
import SplashScreen from "./components/SplashScreen";
import { usePlayer } from "./Context/PlayerContext";

function AppContent() {
  const { currentTrack } = usePlayer();
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <>
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}

      <div className="flex min-h-screen">
        <DesktopSidebar />

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
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </div>

      <BottomNavbar />
      <MusicPlayer />
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
