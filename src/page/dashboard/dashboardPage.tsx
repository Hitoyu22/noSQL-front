import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";


import { AlbumArtwork } from "@/components/dashboard/album-artwork";
import { Sidebar } from "@/components/dashboard/sidebar";
import { listenNowAlbums, madeForYouAlbums } from "@/data/album";
import { AddSong } from "@/components/dashboard/addSong";
import axiosInstance from "@/context/axiosInstance";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [artistExists, setArtistExists] = useState(false);

  const [artistId, setArtistId] = useState<string>("");
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
      } finally {
      }
    };
  
    checkArtistProfile();
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
                          {artistExists ? (
                            <AddSong id={artistId}/>
                          ) : (
                            <></>
                          )}
                          
                        </div>
                      </div>
                      <div className="border-none p-0 outline-none">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h2 className="text-2xl font-semibold tracking-tight">
                              Écoutez maintenant
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              Sélections principales pour vous. Mise à jour quotidienne.
                            </p>
                          </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="relative">
                          <ScrollArea>
                            <div className="flex space-x-4 pb-4">
                              {listenNowAlbums.map((album) => (
                                <AlbumArtwork
                                  key={album.name}
                                  album={album}
                                  className="w-[250px]"
                                  aspectRatio="portrait"
                                  width={250}
                                  height={330}
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
                              {madeForYouAlbums.map((album) => (
                                <AlbumArtwork
                                  key={album.name}
                                  album={album}
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
  
