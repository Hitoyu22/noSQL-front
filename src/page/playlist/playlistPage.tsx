import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import instanceAxios from "@/context/axiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { EditPlaylist } from "@/components/edit-playlist";
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

interface Playlist {
  _id: string;
  name: string;
  description: string;
  coverImageUrl: string;
  isPublic: boolean;
  songs: Song[];
  createdAt: string;
  user: string;
}

export function PlaylistPage() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [allPlaylists, setAllPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const userId = localStorage.getItem("user");

  const nav = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchPlaylist = async () => {
        try {
          const response = await instanceAxios.get(`/playlists/${id}/all`);
          setPlaylist(response.data);
        } catch (err) {
          setError("Erreur de récupération des données.");
        } finally {
          setLoading(false);
        }
      };

      const fetchAllPlaylists = async () => {
        try {
          const response = await instanceAxios.get(`/playlists/${userId}`);
          setAllPlaylists(response.data);
        } catch (err) {
          setError("Erreur de récupération des playlists.");
        }
      };

      fetchPlaylist();
      fetchAllPlaylists();
    }
  }, [id]);

  const addListen = async (song: Song) => {
    try {
      await instanceAxios.post(`/songs/${song._id}/play`);
      toast({ title: "Chanson en cours de lecture !" });
    } catch (error) {
      console.error("Erreur lors de la lecture de la chanson", error);
      toast({ title: "Erreur lors de la lecture", variant: "destructive" });
    }

    window.location.reload();
  };

  const deletePlaylist = async () => {
    if (playlist) {
      try {
        await instanceAxios.delete(`/playlists/${playlist._id}`);
        toast({ title: "Playlist supprimée avec succès" });
        setPlaylist(null);
        nav("/dashboard");
      } catch (error) {
        toast({ title: "Erreur lors de la suppression de la playlist", variant: "destructive" });
      }
    }
  }

  const removeSongFromPlaylist = async (songId: string) => {
    if (playlist) {
      try {
        await instanceAxios.delete(`/playlists/${playlist._id}/songs/${songId}`);
        toast({
          title: "Chanson supprimée de la playlist",
          description: `La chanson a été supprimée de ${playlist.name}.`,
        });
        setPlaylist((prevPlaylist) => {
          if (prevPlaylist) {
            return {
              ...prevPlaylist,
              songs: prevPlaylist.songs.filter((song) => song._id !== songId),
            };
          }
          return prevPlaylist;
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors de la suppression de la chanson.",
          variant: "destructive",
        });
      }
    }
  };

  const addSongToAnotherPlaylist = async (songId: string, targetPlaylistId: string) => {
    try {
      await instanceAxios.post(`/playlists/${targetPlaylistId}/songs/${songId}`);
      toast({
        title: "Chanson ajoutée à une autre playlist",
        description: "La chanson a été ajoutée à la playlist choisie.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout de la chanson.",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!playlist) return <div>Playlist non trouvée</div>;

  return (
    <div className="bg-white text-black min-h-screen flex flex-col items-center">
      <div
        className="relative w-full h-96 bg-cover bg-center rounded-lg overflow-hidden"
        style={{ backgroundImage: `url(${playlist.coverImageUrl})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute bottom-8 left-8">
          <h1 className="text-4xl font-bold text-white">{playlist.name}</h1>
          <p className="text-lg mt-2 text-gray-300">{playlist.description}</p>
        </div>
      </div>

      <div className="w-full max-w-3xl px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={playlist.coverImageUrl} alt={playlist.name} />
              <AvatarFallback>Playlist</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{playlist.name}</h2>
              <p className="text-sm text-gray-600">{playlist.songs.length} musique(s)</p>
            </div>
          </div>
          {id && <EditPlaylist playlistId={id} />}
          <>
          <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Supprimer la playlist</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Suppression de la playlist</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette playlist ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
          <Button onClick={deletePlaylist}>Supprimer</Button>
          </DialogClose>
          <DialogClose asChild>
          <Button variant={"outline"}>Annuler</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
          </>
        </div>

        <div className="space-y-4">
          {playlist.songs.map((song, index) => (
            <div
              key={song._id}
              className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-100 rounded-md transition"
            >
              <div className="flex items-center space-x-4">
                <div className="text-lg text-gray-600">{index + 1}</div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={() => addListen(song)} className="flex items-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Lancer</span>
                  </Button>
                </div>
              </div>

              <div className="flex-1 px-4">
                <h3 className="text-lg font-semibold">{song.title}</h3>
                <p className="text-sm text-gray-500">{song.artist.name}</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
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
                    <DropdownMenuItem onClick={() => removeSongFromPlaylist(song._id)}>
                      <span>Supprimer de la playlist</span>
                    </DropdownMenuItem>

                    <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Ajouter à une playlist</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {allPlaylists.map((playlist) => (
                      <DropdownMenuItem
                        key={playlist._id}
                        onClick={() => addSongToAnotherPlaylist(song._id, playlist._id)}
                      >
                        <span>{playlist.name}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

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
