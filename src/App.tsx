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

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <div>{children}</div>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<div>Page non trouvée</div>} />
    </Routes>
  );
}

function ProtectedLayout() {
  return (
    <div>
      <Menu />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<SettingsForm />} />
        <Route path="/settings/artist-profile" element={<ArtistProfileSettings />} />
        <Route path="/song/:id" element={<SongPage />}/>
        <Route path="/artist/:id" element={<ArtistPage />}/>
        <Route path="/playlist/:id" element={<PlaylistPage />}/>
      </Routes>
    </div>
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
