import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/context/axiosInstance";
import { MultiSelect } from "@/components/multi-select"; 

export function AddArtist() {
  const [genres, setGenres] = useState<any[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]); 
  const [artistName, setArtistName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axiosInstance.get("/genre");
        const formattedGenres = response.data.map((genre: any) => ({
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

  const resetForm = () => {
    setArtistName("");
    setBio("");
    setProfilePictureUrl("");
    setSelectedGenres([]); 
    setIsSuccess(false);
  };

  const handleSave = async () => {
    if (!artistName || !bio || !profilePictureUrl || selectedGenres.length === 0) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    const newArtist = {
      name: artistName,
      bio: bio,
      profilePictureUrl: profilePictureUrl,
      genres: selectedGenres, 
      userId: localStorage.getItem("user"), 
    };

    try {
      const response = await axiosInstance.post("/artists", newArtist);
      console.log("Artiste ajouté avec succès:", response.data);
      setIsSuccess(true);
      alert("L'artiste a été ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'artiste:", error);
      alert("Une erreur est survenue, veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle />
          Ajouter un artiste
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Nouvel artiste</DialogTitle>
          <DialogDescription>
            Ajoutez un nouvel artiste à la plateforme. Remplissez le formulaire ci-dessous et cliquez sur "Enregistrer".
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom de l'artiste
            </Label>
            <Input
              id="name"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio de l'artiste
            </Label>
            <Input
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profilePictureUrl" className="text-right">
              URL de la photo de profil
            </Label>
            <Input
              id="profilePictureUrl"
              value={profilePictureUrl}
              onChange={(e) => setProfilePictureUrl(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="genres" className="text-right">
              Genres
            </Label>
            <div className="col-span-3">
              <MultiSelect
                options={genres}
                onValueChange={setSelectedGenres}
                defaultValue={selectedGenres}
                placeholder="Sélectionner des genres"
                maxCount={5} 
                modalPopover={true}
                variant={"default"}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Enregistrement..." : "Enregistrer l'artiste"}
          </Button>

          <DialogClose
            asChild
            onClick={() => {
              if (isSuccess) {
                resetForm();
              }
            }}
          >
            <Button type="button" variant="secondary">
              {isSuccess ? "Fermer" : "Annuler"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
