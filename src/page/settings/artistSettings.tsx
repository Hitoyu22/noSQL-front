import React, { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/context/axiosInstance";
import { Link } from "react-router-dom";
import { AddArtist } from "@/components/settings/addArtist";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/multi-select"; 

const artistProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Le nom de l'artiste doit au moins faire 2 caractères" })
    .max(30, { message: "Le nom de l'artiste ne peut pas dépasser 30 caractères" }),
  bio: z
    .string()
    .min(4, { message: "La biographie doit comporter au moins 4 caractères" })
    .max(160, { message: "La biographie ne peut pas dépasser 160 caractères" }),
  profilePictureUrl: z.string().url({ message: "Merci d'entrer une URL valide pour l'image de profil" }).optional(),
  genres: z.array(z.string()).optional(), 
});

type ArtistProfileFormValues = z.infer<typeof artistProfileSchema>;

const ArtistProfileSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [artistExists, setArtistExists] = useState(false);
  const [artistProfile, setArtistProfile] = useState<any>(null);
  const [genres, setGenres] = useState<any[]>([]); 


  const form = useForm<ArtistProfileFormValues>({
    resolver: zodResolver(artistProfileSchema),
    defaultValues: {
      name: "",
      bio: "",
      profilePictureUrl: "",
      genres: [],
    },
  });

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresResponse = await axiosInstance.get("/genre");
        const formattedGenres = genresResponse.data.map((genre: any) => ({
          value: genre._id,
          label: genre.name,
        }));
        setGenres(formattedGenres);
      } catch (error) {
        console.error("Erreur lors de la récupération des genres:", error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const checkArtistProfile = async () => {
      try {
        const userId = localStorage.getItem("user");
        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }

        const response = await axiosInstance.get(`/artists/user/${userId}`);
        if (response.status === 200) {
          setArtistExists(true);
          setArtistProfile(response.data); 
          form.reset({
            name: response.data.name,
            bio: response.data.bio,
            profilePictureUrl: response.data.profilePictureUrl,
            genres: response.data.genres, 
          });
        }
      } catch (error: any) {
        if (error.response?.status === 404 || error.response?.status === 204) {
          setArtistExists(false);
        } else {
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la vérification du profil artiste.",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    checkArtistProfile();
  }, [form]);

  const onSubmit = async (data: ArtistProfileFormValues) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("user");
      if (!userId || !artistProfile?._id) {
        throw new Error("ID utilisateur ou ID artiste manquant");
      }

      await axiosInstance.put(`/artists/${artistProfile._id}`, data);
      toast({
        title: "Succès",
        description: "Profil d'artiste mis à jour avec succès.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de la mise à jour du profil.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col gap-8 bg-muted/40 p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Paramètres</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/settings">Général</Link>
          <Link to="/settings/artist-profile" className="font-semibold text-primary">
            Profil d'artiste
          </Link>
        </nav>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil d'artiste</CardTitle>
              <CardDescription>
                Mettez à jour les informations de votre profil.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!artistExists ? (
                <div className="flex flex-col items-center justify-center text-center">
                  <h2 className="text-2xl font-semibold">Vous n'avez pas de profil d'artiste ?</h2>
                  <p className="mt-4 text-muted-foreground">
                    Créez-en un pour commencer à partager votre art avec le monde !
                  </p>
                  <AddArtist />
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom de l'artiste</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Entrez le nom de l'artiste"
                              {...field}
                              disabled={loading}
                            />
                          </FormControl>
                          <FormDescription>Nom de l'artiste visible publiquement.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Biographie</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Parlez-nous de votre art"
                              className="resize-none"
                              {...field}
                              disabled={loading}
                            />
                          </FormControl>
                          <FormDescription>Une courte biographie à propos de votre art.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="profilePictureUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image de profil</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Entrez l'URL de votre image de profil"
                              {...field}
                              disabled={loading}
                            />
                          </FormControl>
                          <FormDescription>Une image de profil pour votre page.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="genres"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Genres</FormLabel>
                          <FormControl>
                            <MultiSelect
                              options={genres}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              placeholder="Sélectionner des genres"
                              maxCount={5}
                              modalPopover={true}
                              variant={"default"}
                            />
                          </FormControl>
                          <FormDescription>Les genres de musique associés à votre profil.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={loading}>
                      {loading ? "Enregistrement..." : "Mettre à jour le profil"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfileSettings;
