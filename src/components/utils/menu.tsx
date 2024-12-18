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
import { Link } from "react-router-dom";
  
  export function Menu() {
    return (
      <Menubar className="rounded-none border-b px-2 lg:px-4">
        <MenubarMenu>
          <MenubarTrigger className="font-bold">Spotify</MenubarTrigger>
          <MenubarContent>
          <Link to="/dashboard">
              <MenubarItem>
                  Accueil
              </MenubarItem>
            </Link>
            <MenubarSub>
              <MenubarSubTrigger>Nouvelle Playlist</MenubarSubTrigger>
              <MenubarSubContent className="w-[230px]">
                <MenubarItem>
                  Playlists
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
  
        <MenubarMenu>
          <MenubarTrigger>Paramètres</MenubarTrigger>
          <MenubarContent>
          <Link to="/settings">
              <MenubarItem>
                  Général
              </MenubarItem>
            </Link>
            <Link to="/settings/artist-profile">
              <MenubarItem>
                  Profil d'artiste
              </MenubarItem>
            </Link>
            <Link to="/logout">
              <MenubarItem>
                  Déconnexion
              </MenubarItem>
            </Link>
          </MenubarContent>
        </MenubarMenu>

      </Menubar>
    );
  }
  