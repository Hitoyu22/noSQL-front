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
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/multi-select"; 
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const artistProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Le nom de l'artiste doit au moins faire 2 caractères" })
    .max(30, { message: "Le nom de l'artiste ne peut pas dépasser 30 caractères" }),
  bio: z
    .string()
    .min(4, { message: "La biographie doit comporter au moins 4 caractères" })
    .max(160, { message: "La biographie ne peut pas dépasser 160 caractères" }),
  profilePicture: z
    .instanceof(File)
    .optional(), 
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
      profilePicture: undefined,
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
            name: response.data.name || "",
            bio: response.data.bio || "",
            profilePicture: undefined, 
            genres: response.data.genres || [],
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


  const deleteArtistProfile = async () => {

    try {
      if (!artistProfile?._id) {
        throw new Error("ID utilisateur ou ID artiste manquant");
      }

      await axiosInstance.delete(`/artists/${artistProfile._id}`);

      toast({
        title: "Succès",
        description: "Profil d'artiste supprimé avec succès.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de la suppression du profil.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      window.location.reload();
    }
  }

  const onSubmit = async (data: ArtistProfileFormValues) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("user");
      if (!userId || !artistProfile?._id) {
        throw new Error("ID utilisateur ou ID artiste manquant");
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("bio", data.bio);
      formData.append("genres", (data.genres || []).join(','));
      if (data.profilePicture) {
        formData.append("profilePicture", data.profilePicture); 
      }

      await axiosInstance.put(`/artists/${artistProfile._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });

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
    <div className="flex min-h-screen flex-col gap-8 bg-muted/ p-10">
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
                <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'artiste</FormLabel>
                    <FormControl>
                      <Input {...field} className="placeholder:text-black" placeholder="Saisissez votre nom" />
                    </FormControl>
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
                      <Textarea {...field} placeholder="Rédiger votre bio"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profilePicture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image de Profil</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        className="placeholder:text-black"
                        placeholder="Choisir une image"
                      />
                    </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Chargement..." : artistExists ? "Mettre à jour" : "Créer un profil"}
                </Button>
              </div>
            </form>
          </Form>

          <div>
        <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Supprimer le profil</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer le profil</DialogTitle>
          <DialogDescription>
            Si vous supprimez votre profil, toutes vos musiques n'existeront plus.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={deleteArtistProfile}>Supprimer</Button>
          <Button variant={"ghost"}>Annuler</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
        </div>
</>
        )}

        
        </CardContent>
      </Card>
    </div>
  </div>
    </div>
  );
};

export default ArtistProfileSettings;
