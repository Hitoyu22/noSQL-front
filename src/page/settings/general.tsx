import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/context/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Le nom d'utilisateur doit au moins faire 2 caractères" })
    .max(30, { message: "Le nom d'utilisateur ne peut pas dépasser 30 caractères" }),
  email: z
    .string()
    .email({ message: "Merci de renseigner un email valide" }),
  bio: z.string().max(160).min(4, { message: "Votre bio doit faire entre 4 et 160 caractères" }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/users/me/");
        const { username, email, bio, _id } = response.data.user;
        form.reset({ username, email, bio: bio || "" });
        setUserId(_id);
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch user data.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/users/${userId}`, data);
      toast({ title: "Success", description: "Profile updated successfully.", variant: "default" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const [artistExists, setArtistExists] = useState(false);
    const [artistProfile, setArtistProfile] = useState<any>(null);
  

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
  };

  const nav = useNavigate();

  const deleteAccount = async () => {


    if (artistExists) {
      try {
        setLoading(true);
        await deleteArtistProfile();
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Échec de la suppression du profil artiste.",
          variant: "destructive",
        });
      }
    }


    try {
      setLoading(true);
      await axiosInstance.delete(`/users/`);
      toast({ title: "Success", description: "Account deleted successfully.", variant: "default" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete account.", variant: "destructive" });
    } finally {
      setLoading(false);
      nav("/");
    }

  }

  return (
    <div className="flex min-h-screen flex-col gap-8 bg-muted/40 p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Paramètres</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/settings" className="font-semibold text-primary">General</Link>
          <Link to="/settings/artist-profile">Profil d'artiste</Link>
        </nav>
        <div className="grid gap-6">
  <Card>
    <CardHeader>
      <CardTitle>Paramètres du Profil</CardTitle>
      <CardDescription>Mettez à jour les informations de votre profil.</CardDescription>
    </CardHeader>
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom d'utilisateur</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrez votre nom d'utilisateur"
                    {...field}
                    disabled={loading}
                    className="placeholder:text-black"
                  />
                </FormControl>
                <FormDescription>Ceci est votre nom affiché publiquement.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrez votre adresse email"
                    {...field}
                    disabled={loading}
                    className="placeholder:text-black"
                  />
                </FormControl>
                <FormDescription>Votre adresse email.</FormDescription>
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
                    placeholder="Parlez-nous un peu de vous"
                    className="resize-none"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormDescription>Une courte biographie à propos de vous.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="mb-4" disabled={loading}>
            {loading ? "Enregistrement..." : "Mettre à jour le profil"}
          </Button>
        </form>
      </Form>

      <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="mt-2">Supprimer le compte</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer le compte</DialogTitle>
          <DialogDescription>
            Si vous supprimez votre compte, toutes vos données seront perdues. Êtes-vous sûr de vouloir continuer ?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={deleteAccount}>Supprimer</Button>
          <Button variant={"ghost"}>Annuler</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </CardContent>
  </Card>
</div>

      </div>
    </div>
  );
};

export default Settings;
