"use client";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import instanceAxios from "@/context/axiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  coverImageUrl: string;
  artist: Artist;
  genre: Genre[];
  likesCount: number;
  viewsCount: number;
  filePath: string;
}

interface Playlist {
  _id: string;
  name: string;
}

export function SongPage() {
  const { id } = useParams();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const fetchSong = async () => {
        try {
          const response = await instanceAxios.get(`/songs/${id}`);
          setSong(response.data);
        } catch (err) {
          setError("Erreur de récupération des données.");
        } finally {
          setLoading(false);
        }
      };
      fetchSong();
    }
  }, [id]);

  useEffect(() => {
    const userId = localStorage.getItem("user");
    if (userId) {
      const fetchPlaylists = async () => {
        try {
          const response = await instanceAxios.get(`/playlists/${userId}`);
          setPlaylists(response.data);
        } catch (err) {
          console.error("Erreur lors de la récupération des playlists", err);
        }
      };
      fetchPlaylists();
    }
  }, []);

  const addToPlaylist = async (playlistId: string) => {
    if (!song) return;

    try {
      await instanceAxios.post(`/playlists/${playlistId}/songs`, {
        idSong: song._id,
      });

      toast({
        title: "Chanson ajoutée à la playlist",
        description: `${song.title} a été ajoutée à la playlist.`,
        duration: 4000,
      });
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        toast({
          title: "Erreur",
          description: "Cette chanson est déjà dans cette playlist.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors de l'ajout de la chanson.",
          variant: "destructive",
        });
      }
    }
  };

  const addListen = async () => {
    if (!song) return;

    try {
      await instanceAxios.post(`/songs/${song._id}/play`);
      console.log("Chanson en cours de lecture !");
    } catch (error) {
      console.error("Erreur lors de la lecture de la chanson", error);
    }
  };

  const handleShare = () => {
    if (song) {
      const songUrl = `${window.location.origin}/song/${song._id}`;

      toast({
        title: "Lien de la chanson partagé",
        description: (
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <input
                id="link"
                value={songUrl}
                readOnly
                className="w-full max-w-[500px] p-2 border border-gray-300 rounded-md"
              />
            </div>
            <Button
              size="sm"
              className="px-3"
              onClick={() => {
                navigator.clipboard.writeText(songUrl);
                toast({
                  title: "Lien copié",
                  description: "Le lien a été copié dans votre presse-papiers.",
                });
              }}
            >
              Copier
            </Button>
          </div>
        ),
        duration: 4000,
        style: { maxWidth: "500px" },
      });
    }
  };

  const handleAddToQueue = () => {
    if (song) {
      toast({
        title: "Chanson ajoutée à la file d'attente",
        description: `${song.title} a été ajoutée à votre file d'attente.`,
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!song) return <div>Chanson non trouvée</div>;

  return (
    <div className="bg-white text-black min-h-screen flex flex-col items-center">
      <div
        className="relative w-full h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${song.coverImageUrl})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute bottom-8 left-8">
          <h1 className="text-4xl font-bold text-white">{song.title}</h1>
          <p className="text-xl mt-2 text-gray-200">{song.artist.name}</p>
        </div>
      </div>

      <div className="w-full max-w-3xl px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Avatar className="w-20 h-20">
              {song.artist && song.artist.profilePictureUrl ? (
                <AvatarImage src={song.artist.profilePictureUrl} alt={song.artist.name} />
              ) : (
                <AvatarFallback>Artiste</AvatarFallback>
              )}
            </Avatar>
            <div>
              {song.artist ? (
                <>
                  <h2 className="text-2xl font-semibold">{song.artist.name}</h2>
                  <p className="text-sm text-gray-600 mt-2">{song.artist.bio}</p>
                </>
              ) : (
                <div>Artiste non trouvé</div>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Ajouter à une playlist</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {playlists.map((playlist) => (
                      <DropdownMenuItem
                        key={playlist._id}
                        onClick={() => addToPlaylist(playlist._id)}
                      >
                        <span>{playlist.name}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={handleAddToQueue}>
                  <span>Ajouter à la file d'attente</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <span>Partager</span>
                </DropdownMenuItem>
                <Link to={`/artist/${song.artist._id}`}>
                  <DropdownMenuItem>
                    <span>Voir le profil de l'artiste</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 flex space-x-4">
          {song.genre.map((g) => (
            <Badge
              key={g._id}
              className="bg-gray-200 text-black py-1 px-4 rounded-full text-sm"
            >
              {g.name}
            </Badge>
          ))}
        </div>

        <div className="mt-6">
          <Button onClick={addListen}>Lancer la musique</Button>
        </div>

        <div className="mt-6 flex space-x-8 text-gray-600">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 3v12l9-6-9-6z"
              />
            </svg>
            <span>{song.viewsCount} vues</span>
          </div>
        </div>
      </div>
    </div>
  );
}
