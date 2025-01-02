import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useEffect, useState } from "react";
import axiosInstance from "@/context/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { AddPlaylist } from "./addPlaylist";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Music extends React.HTMLAttributes<HTMLDivElement> {
  album: {
    _id: string;
    name: string;
    artist: string;
    cover: string;
  };
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
  song?: string;
}

export function Musique({
  album,
  aspectRatio = "portrait",
  width,
  height,
  className,
  song,
  ...props
}: Music) {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const userId = localStorage.getItem("user");
        const response = await axiosInstance.get(`/playlists/${userId}`);
        const playlistData = response.data.map((playlist: any) => ({
          _id: playlist._id,
          name: playlist.name,
        }));
        setPlaylists(playlistData);
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      }
    };
    fetchPlaylists();
  }, []);

  const addToPlaylist = async (playlistId: string, song: string) => {
    try {
      await axiosInstance.post(`/playlists/${playlistId}/songs`, { idSong: song });
      toast({
        title: "Ajouter à la playlist",
        description: `${album.name} a été ajouté à la playlist.`,
        duration: 4000,
      });
    } catch (error) {
      toast({
        title: "Une erreur est survenue",
        description: "Une erreur est survenue lors de l'ajout à la playlist.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (song) {
      const songUrl = `${window.location.origin}/song/${song}`;

      toast({
        title: "Lien de la chanson partagé",
        description: (
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                id="link"
                value={songUrl}
                readOnly
                className="w-full max-w-[500px] p-2 border border-gray-300 rounded-md placeholder:text-black"
              />
            </div>
            <Button
              
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

  return (
    <div className={cn("space-y-3", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md">
            <img
              src={album.cover}
              alt={album.name}
              width={width}
              height={height}
              className={cn(
                "h-auto w-auto object-cover transition-all hover:scale-105",
                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
              )}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuSub>
            <ContextMenuSubTrigger>Ajouter à une playlist</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <AddPlaylist userId={localStorage.getItem("user") || ""} />
              <ContextMenuSeparator />
              {playlists.map((playlist) => (
                <ContextMenuItem
                  key={playlist._id}
                  onClick={() => song && addToPlaylist(playlist._id, song)}
                >
                  {playlist.name}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem>Ecouter ensuite</ContextMenuItem>
          <ContextMenuItem>Ecouter plus tard</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={handleShare}>Partager</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{album.name}</h3>
        <p className="text-xs text-muted-foreground">{album.artist}</p>
      </div>
    </div>
  );
}
