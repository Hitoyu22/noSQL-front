import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "@/page/login/loginPage";
import RegisterPage from "./page/register/registerPage";
import Dashboard from "./page/dashboard/dashboardPage";
import SettingsForm from "./page/settings/general";
import { Menu } from "./components/utils/menu";
import ArtistProfileSettings from "./page/settings/artistSettings";
import { SongPage } from "./page/songs/songPage";
import { ArtistPage } from "./page/artist/artistPage";
import { PlaylistPage } from "./page/playlist/playlistPage";
import { Toaster } from "./components/ui/toaster";
import { FavoriteArtistsPage } from "./page/artist/favoriteArtistePage";
import LogoutPage from "./page/login/logoutPage";
import { MyDiscographyPage } from "./page/songs/myDiscography";
import LandingPage from "./page/landingPage";
import NotFoundPage from "./page/404Page";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <div>
    <Menu />
    
    {children}</div>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/artist-profile"
        element={
          <ProtectedRoute>
            <ArtistProfileSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/song/:id"
        element={
          <ProtectedRoute>
            <SongPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artist/:id"
        element={
          <ProtectedRoute>
            <ArtistPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/playlist/:id"
        element={
          <ProtectedRoute>
            <PlaylistPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artist/favorite"
        element={
          <ProtectedRoute>
            <FavoriteArtistsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artist/my-discography"
        element={
          <ProtectedRoute>
            <MyDiscographyPage />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
      <Toaster />
    </Router>
  );
}

export default App;
