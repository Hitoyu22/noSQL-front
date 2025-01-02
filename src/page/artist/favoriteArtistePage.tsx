"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instanceAxios from "@/context/axiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Artist {
  _id: string;
  name: string;
  bio: string;
  profilePictureUrl: string;
}

export function FavoriteArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavoriteArtists = async () => {
      try {
        const userId = localStorage.getItem("user");
        const response = await instanceAxios.get(`/users/${userId}/favorite-artists`);
        setArtists(response.data.favoriteArtists || []);
      } catch (err) {
        setError("Erreur lors de la récupération des artistes favoris.");
        toast({ title: "Erreur", description: "Impossible de charger les artistes favoris.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteArtists();
  }, []);

  const unfollowArtist = async (artistId: string) => {
    try {
      await instanceAxios.delete(`/users/favorite-artists/${artistId}`);
      setArtists((prev) => prev.filter((artist) => artist._id !== artistId));
      toast({ title: "Artiste non suivi !" });
    } catch (error) {
      toast({ title: "Erreur lors du désabonnement", variant: "destructive" });
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="bg-white text-black min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold my-8">Mes artistes favoris</h1>
      <div className="w-full max-w-3xl px-6 py-8">
        <div className="space-y-4">
          {artists.length === 0 ? (
            <p className="text-gray-600">Vous n'avez pas encore d'artistes favoris.</p>
          ) : (
            artists.map((artist) => (
              <div
                key={artist._id}
                className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-100 rounded-md transition"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={artist.profilePictureUrl} alt={artist.name} />
                    <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold">{artist.name}</h2>
                    <p className="text-sm text-gray-500">{artist.bio}</p>
                  </div>
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
                      <DropdownMenuItem onClick={() => navigate(`/artist/${artist._id}`)}>
                        <span>Accéder au profil</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => unfollowArtist(artist._id)}>
                        <span>Se désabonner</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
