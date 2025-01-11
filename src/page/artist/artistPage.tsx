import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import instanceAxios from "@/context/axiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
  coverImageUrl: string;
}

export function ArtistPage() {
  const { id } = useParams();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const userId = localStorage.getItem("user");
  const isAnonymous = localStorage.getItem("isAnonymous") === "true";

  useEffect(() => {
    if (id) {
      const fetchArtistData = async () => {
        try {
          try {
            const artistResponse = await instanceAxios.get(`/artists/${id}`);
            setArtist(artistResponse.data);
          } catch (error) {
            setError("Erreur lors de la récupération des informations de l'artiste.");
            toast({ title: "Erreur lors de la récupération des informations de l'artiste.", variant: "destructive" });
            return;
          }

          try {
            const songsResponse = await instanceAxios.get(`/songs/artist/${id}`);
            setSongs(songsResponse.data);
          } catch (error) {
            setError("Erreur lors de la récupération des chansons.");
            toast({ title: "Erreur lors de la récupération des chansons.", variant: "destructive" });
            return;
          }

          if (!isAnonymous && userId) {
            try {
              const followResponse = await instanceAxios.get(`/users/${userId}/favorite-artists`);
            
              const favoriteArtists = followResponse.data?.favoriteArtists || [];
            
              if (!Array.isArray(favoriteArtists)) {
                throw new Error("Structure inattendue de la réponse");
              }
            
              setIsFollowing(favoriteArtists.some((favorite: any) => favorite._id === id));
            } catch (error) {
              console.error("Erreur:", error);
              setError("Erreur lors de la vérification de l'abonnement.");
              toast({ title: "Erreur lors de la vérification de l'abonnement.", variant: "destructive" });
              return;
            }
          }
        } catch (err) {
          setError("Erreur générale lors du chargement des données.");
          toast({ title: "Erreur générale", variant: "destructive" });
        } finally {
          setLoading(false);
        }
      };

      fetchArtistData();
    }
  }, [id, userId, isAnonymous]);

  const followArtist = async () => {
    try {
      await instanceAxios.post("/users/favorite-artists", { artistId: id });
      setIsFollowing(true);
      toast({ title: "Artiste suivi avec succès !" });
    } catch (error) {
      toast({ title: "Erreur lors du suivi", variant: "destructive" });
    }
  };

  const unfollowArtist = async () => {
    try {
      await instanceAxios.delete(`/users/favorite-artists/${id}`);
      setIsFollowing(false);
      toast({ title: "Artiste non suivi !" });
    } catch (error) {
      toast({ title: "Erreur lors du désabonnement", variant: "destructive" });
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!artist) return <div>Artiste non trouvé</div>;

  return (
    <div className="bg-white text-black min-h-screen flex flex-col items-center">
      <div
        className="relative w-full h-96 bg-cover bg-center overflow-hidden"
      >
        <div className="absolute inset-0" style={{ backgroundImage: `url(${artist.profilePictureUrl})` }}></div>
        <div className="absolute bottom-8 left-8">
          <h1 className="text-4xl font-bold text-white">{artist.name}</h1>
          <p className="text-lg mt-2 text-gray-300">{artist.bio}</p>
        </div>
      </div>

      <div className="w-full max-w-3xl px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={artist.profilePictureUrl} alt={artist.name} />
              <AvatarFallback>Artiste</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{artist.name}</h2>
              <p className="text-sm text-gray-600">{songs.length} musique(s)</p>
            </div>
          </div>
          <div>
            {!isAnonymous && (
              isFollowing ? (
                <Button variant="outline" onClick={unfollowArtist}>Se désabonner</Button>
              ) : (
                <Button variant="outline" onClick={followArtist}>S'abonner</Button>
              )
            )}
          </div>
        </div>

        <div className="space-y-4">
          {songs.map((song, index) => (
            <div
              key={song._id}
              className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-100 rounded-md transition"
            >
              <div className="flex items-center space-x-4">
                <div className="text-lg text-gray-600">{index + 1}</div>
                <div className="flex items-center space-x-2">
                  <img src={song.coverImageUrl} alt={song.title} className="w-12 h-12" />
                </div>
              </div>

              <div className="flex-1 px-4">
                <h3 className="text-lg font-semibold">{song.title}</h3>
                <p className="text-sm text-gray-500">{song.artist.name}</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-500 mr-2">
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
                    <DropdownMenuItem>
                          <Link to={`/songs/${song._id}`}>
                        <DropdownMenuItem>
                          <span>Accéder à la musique</span>
                        </DropdownMenuItem>
                      </Link>
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
