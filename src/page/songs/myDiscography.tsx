import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instanceAxios from "@/context/axiosInstance";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Play, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddSong } from "@/components/dashboard/addSong";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Genre {
  _id: string;
  name: string;
}

interface Artist {
  _id: string;
  name: string;
  bio: string;
  profilePictureUrl: string;
}

interface Song {
  _id: string;
  title: string;
  artist: Artist;
  genre: Genre[];
  likesCount: number;
  viewsCount: number;
  filePath: string;
  coverImageUrl: string;
}

export function MyDiscographyPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const userId = localStorage.getItem("user");

  useEffect(() => {
    const fetchArtistAndSongs = async () => {
      try {
        if (!userId) throw new Error("User ID not found");

        const artistResponse = await instanceAxios.get(`/artists/user/${userId}`);
        const artistData = artistResponse.data;
        setArtist(artistData);

        const songsResponse = await instanceAxios.get(`/artists/${artistData._id}/songs`);
        setSongs(songsResponse.data);
      } catch (err) {
        setError("Erreur de récupération des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtistAndSongs();
  }, [userId]);

  const addListen = async (song: Song) => {
    try {
      await instanceAxios.post(`/songs/${song._id}/play`);
      toast({ title: "Chanson en cours de lecture !" });
    } catch (error) {
      toast({ title: "Erreur lors de la lecture", variant: "destructive" });
    }
  };

  const deleteSong = async (songId: string) => {
    try {
      await instanceAxios.delete(`/songs/${songId}`);
      toast({ title: "Chanson supprimée avec succès" });
      setSongs((prevSongs) => prevSongs.filter((song) => song._id !== songId));
      window.location.reload();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression de la chanson.",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!artist) return <div>Artiste non trouvé</div>;

  return (
    <div className="bg-white text-black min-h-screen flex flex-col items-center">
      <div className="relative w-full h-96 bg-cover bg-center rounded-lg overflow-hidden"
        style={{ backgroundImage: `url(${artist.profilePictureUrl})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute bottom-8 left-8">
          <h1 className="text-4xl font-bold text-white">{artist.name}</h1>
          <p className="text-lg mt-2 text-gray-300">{artist.bio}</p>
        </div>
      </div>

      <div className="w-full max-w-3xl px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">Ma Discographie</h2>
        <AddSong id={artist._id}/>
        <div className="space-y-4">
          {songs.map((song, index) => (
            <div
              key={song._id}
              className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-100 rounded-md transition"
            >
              <div className="flex items-center space-x-4">
                <div className="text-lg text-gray-600">{index + 1}</div>
                <Button variant="outline" onClick={() => addListen(song)} className="flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Lancer</span>
                </Button>
              </div>

              <div className="flex-1 px-4">
                <h3 className="text-lg font-semibold">{song.title}</h3>
                <p className="text-sm text-gray-500">{artist.name}</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-500 mr-4">
                <span>{song.viewsCount} vues</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" className="p-0 font-normal">Supprimer la musique</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                            <DialogTitle>Suppression de la musique</DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer cette musique ? Cette action est irréversible.
                            </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                            <DialogClose asChild>
                            <Button onClick={() => deleteSong(song._id)}>Supprimer</Button>
                            </DialogClose>
                            <DialogClose asChild>
                            <Button variant={"outline"}>Annuler</Button>
                            </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                        </Dialog>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/song/${song._id}`)}>
                      <span>Accéder au à la page de la musique</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
