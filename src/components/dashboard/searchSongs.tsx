import * as React from "react";
import { Button } from "@/components/ui/button"; 
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import instanceAxios from "@/context/axiosInstance"; 
import { Link } from "react-router-dom";
import axios from "axios";

interface Artist {
  name: string;
}

interface Song {
  _id: string;
  coverImageUrl: string;
  title: string;
  artist: Artist;
}

interface Genre {
  _id: string;
  name: string;
}

export function SearchSongs() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState(""); 
  const [songs, setSongs] = React.useState<Song[]>([]); 
  const [genres, setGenres] = React.useState<Genre[]>([]); 
  const [selectedGenre, setSelectedGenre] = React.useState<string>(""); 
  const [error, setError] = React.useState<string | null>(null); 
  const [searchType, setSearchType] = React.useState<"text" | "genre">("text");

  const toggleCommandMenu = () => {
    setOpen((prevState) => !prevState);
  };

  const handleSearch = React.useCallback(
    async (searchQuery: string, genre: string) => {
      try {
        let url = "";
  
        if (searchType === "text") {
          url = `/songs/search?query=${searchQuery}`;
        }
        else if (searchType === "genre" && genre) {
          url = `/songs/genre/${genre}`;
        }
  
        const response = await instanceAxios.get(url);
  
        if (response.status === 404) {
          setError("Aucune musique ne correspond.");
          setSongs([]);
          return;
        }
  
        setSongs(response.data);
        setError(null);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
          console.clear();
        }
        setError("Aucune musique ne correspond.");
        setSongs([]);
      }
    },
    [searchType]
  );
  

  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query, selectedGenre);
    }, 200); 

    return () => clearTimeout(timer);
  }, [query, selectedGenre, handleSearch]);

  React.useEffect(() => {
    if (open) {
      handleSearch("", ""); 
    }
  }, [open, handleSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value); 
  };

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value);
    handleSearch(query, value); 
  };

  React.useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await instanceAxios.get("/genre");
        setGenres(response.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

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
          <DialogTitle>Rechercher une chanson</DialogTitle>
          <DialogDescription>
            Rechercher une chanson pour l'ajouter à votre playlist
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="text" onValueChange={(value) => setSearchType(value as "text" | "genre")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Recherche textuelle</TabsTrigger>
            <TabsTrigger value="genre">Recherche par genre</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text">
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
          </TabsContent>

          <TabsContent value="genre">
            <div className="mt-4">
              <Select onValueChange={handleGenreChange} value={selectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre._id} value={genre._id}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 max-h-72 overflow-y-auto">
  {error ? (
    <p>{error}</p>
  ) : Array.isArray(songs) && songs.length === 0 ? (
    <p>Aucune musique ne correspond à votre recherche</p>
  ) : Array.isArray(songs) && songs.length > 0 ? (
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
    ))
  ) : (
    <p>Aucune musique n'a pu être trouvée</p>
  )}
</div>

      </DialogContent>
    </Dialog>
  );
}
