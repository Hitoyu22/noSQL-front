import { useEffect, useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Link, useNavigate } from "react-router-dom";
import instanceAxios from "@/context/axiosInstance";
import { AddPlaylist } from "../dashboard/addPlaylist";

interface Playlist {
  _id: string;
  name: string;
}

export function Menu() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user");
    if (userId) {
      const fetchPlaylists = async () => {
        try {
          const response = await instanceAxios.get(`/playlists/${userId}`);
          setPlaylists(response.data);
        } catch (error) {
          console.error("Erreur lors de la récupération des playlists", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPlaylists();
    }
  }, []);

  return (
    <Menubar className="rounded-none border-b px-2 lg:px-4">
      <MenubarMenu>
        <MenubarTrigger className="font-bold">Spotify</MenubarTrigger>
        <MenubarContent>
          <Link to="/dashboard">
            <MenubarItem>Accueil</MenubarItem>
          </Link>
          <MenubarSub>
            <MenubarSubTrigger>Playlist</MenubarSubTrigger>
            <MenubarSubContent className="w-[230px]">
                  <AddPlaylist userId={localStorage.getItem("user") || ""} />
              {loading ? (
                <MenubarItem>Chargement...</MenubarItem>
              ) : (
                playlists.map((playlist) => (
                  <MenubarItem
                    key={playlist._id}
                    onClick={() => navigate(`/playlist/${playlist._id}`)}
                  >
                    {playlist.name}
                  </MenubarItem>
                ))
              )}
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Paramètres</MenubarTrigger>
        <MenubarContent>
          <Link to="/settings">
            <MenubarItem>Général</MenubarItem>
          </Link>
          <Link to="/settings/artist-profile">
            <MenubarItem>Profil d'artiste</MenubarItem>
          </Link>
          <Link to="/logout">
            <MenubarItem>Déconnexion</MenubarItem>
          </Link>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
