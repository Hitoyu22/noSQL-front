"use client";

import * as React from "react";
import { Button } from "@/components/ui/button"; 
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import instanceAxios from "@/context/axiosInstance"; 
import { Link } from "react-router-dom";

interface Artist {
  name: string;
}

interface Song {
  _id: string;
  coverImageUrl: string;
  title: string;
  artist: Artist;
}

export function SearchSongs() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState(""); 
  const [songs, setSongs] = React.useState<Song[]>([]); 
  const [error, setError] = React.useState<string | null>(null); 

  const toggleCommandMenu = () => {
    setOpen((prevState) => !prevState);
  };

  const handleSearch = React.useCallback(
    async (searchQuery: string) => {
      try {
        const response = await instanceAxios.get(`/songs/search?query=${searchQuery}`);
        setSongs(response.data); 
        setError(null); 
      } catch (error) {
        setError("Aucune musique ne correspond."); 
      }
    },
    []
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 200); 

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  React.useEffect(() => {
    if (open) {
      handleSearch(""); 
    }
  }, [open, handleSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value); 
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={toggleCommandMenu}
          aria-expanded={open}
          aria-controls="command-menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
          </svg>
          Parcourir les chansons
        </Button>
      </DialogTrigger>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={toggleCommandMenu} />
      )}

      <DialogContent className="sm:max-w-[425px]">
      <DialogHeader className="hidden">
          <DialogTitle>Nouvelle chanson</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle chanson à la plateforme. Remplissez le formulaire ci-dessous et cliquez sur "Enregistrer".
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center border-b px-3 py-4">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            type="text"
            placeholder="Rechercher une chanson..."
            value={query}
            onChange={handleChange}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-neutral-500 placeholder:text-black disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-neutral-400"
          />
        </div>

        <div className="mt-4 max-h-72 overflow-y-auto">
          {error ? (
            <p>{error}</p>
          ) : songs.length === 0 ? (
            <p>Aucune musique ne correspond à votre recherche</p>
          ) : (
            songs.slice(0, 3).map((song) => ( 
              <Link key={song._id} to={`/song/${song._id}`}>
                <div className="flex items-center space-x-4 p-2 hover:bg-gray-100 cursor-pointer transition-colors">
                  <img
                    src={song.coverImageUrl}
                    alt={song.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <span className="font-semibold">{song.title}</span>
                    {song.artist && song.artist.name ? (
                      <div className="text-sm text-gray-500">{song.artist.name}</div>
                    ) : (
                      <div className="text-sm text-gray-500">Artiste inconnu</div> 
                    )}
                  </div>
                </div>
              </Link>
            )))
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}
