import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Musique } from "@/components/dashboard/music";
import { Sidebar } from "@/components/dashboard/sidebar";
import { AddSong } from "@/components/dashboard/addSong";
import axiosInstance from "@/context/axiosInstance";
import { useEffect, useState } from "react";
import {Playlist} from "@/components/dashboard/playlist";

export default function Dashboard() {
  const [artistExists, setArtistExists] = useState(false);
  const [artistId, setArtistId] = useState<string>("");
  const [recommendedAlbums, setRecommendedAlbums] = useState<any[]>([]); 
  const [playlists, setPlaylists] = useState<any[]>([]); 


  useEffect(() => {
    const checkArtistProfile = async () => {
      try {
        const userId = localStorage.getItem("user");
        if (!userId) throw new Error("User ID not found");

        const response = await axiosInstance.get(`/artists/user/${userId}`);
        setArtistId(response.data._id);
        setArtistExists(response.status === 200);
      } catch (error: any) {
        setArtistExists(false);
      }
    };

    checkArtistProfile();
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axiosInstance.get("/songs/recommandations");
        const albums = response.data.map((song: any) => ({
          _id : song._id,
          name: song.title,
          artist: song.artist.name,
          cover: song.coverImageUrl,
        }));
        setRecommendedAlbums(albums);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      }
    };

    fetchRecommendations();
  }, []);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const userId = localStorage.getItem("user");
        const response = await axiosInstance.get(`/playlists/${userId}/`);
        const Playlist = response.data.map((album: any) => ({
          _id : album._id,
          name: album.name,
          cover: album.coverImageUrl,
        }));
        setPlaylists(Playlist);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      }
    };

    fetchPlaylist();
  }, []);

  return (
    <>
      <div className="md:hidden">
        <img
          src="/examples/music-light.png"
          width={1280}
          height={1114}
          alt="Music"
          className="block dark:hidden"
        />
        <img
          src="/examples/music-dark.png"
          width={1280}
          height={1114}
          alt="Music"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden md:block">
        <div>
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <Sidebar className="sticky top-0 h-full lg:block z-10" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  <div className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <div className="ml-auto mr-4">
                        {artistExists && <AddSong id={artistId} />}
                      </div>
                    </div>
                    <div className="border-none p-0 outline-none">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            Écoutez maintenant
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Sélections principales pour vous. Mise à jour
                            quotidienne.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="relative">
                        <ScrollArea>
                          <div className="flex space-x-4 pb-4">
                            {recommendedAlbums.map((album, index) => (
                              <Musique
                                key={index}
                                album={album}
                                className="w-[250px]"
                                aspectRatio="portrait"
                                width={250}
                                height={330}
                                song={album._id}
                              />
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </div>

                      <div className="mt-6 space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Créé pour vous
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Vos playlists personnelles. Mise à jour quotidienne.
                        </p>
                      </div>
                      <Separator className="my-4" />
                      <div className="relative">
                        <ScrollArea>
                          <div className="flex space-x-4 pb-4">
                            {playlists.map((playlists, index) => (
                              <Playlist
                                key={index}
                                playlist={playlists}
                                className="w-[150px]"
                                aspectRatio="square"
                                width={150}
                                height={150}
                              />
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
