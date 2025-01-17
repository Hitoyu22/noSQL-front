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
import { MultiSelect } from "@/components/multi-select"; 
import axiosInstance from "@/context/axiosInstance";

interface AddSongProps {
  id: string; 
}

export function AddSong({ id }: AddSongProps) {
  const [genres, setGenres] = useState<any[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [songTitle, setSongTitle] = useState<string>("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);

  const resetForm = () => {
    setSongTitle("");
    setSelectedGenres([]);
    setCoverImage(null);
    setIsSuccess(false);
  };

  const handleSave = async () => {
    if (!selectedGenres.length || !songTitle || !coverImage) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", songTitle);
    formData.append("artist", id);
    formData.append("genre", (selectedGenres || []).join(','));
    formData.append("coverImage", coverImage);

    try {
      const response = await axiosInstance.post("/songs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Chanson ajoutée avec succès:", response.data);
      setIsSuccess(true);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la chanson:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle />
          Ajouter de la musique
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] overflow-visible">
        <DialogHeader>
          <DialogTitle>Nouvelle chanson</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle chanson à la plateforme. Remplissez le formulaire ci-dessous et cliquez sur "Enregistrer".
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Titre de la chanson
            </Label>
            <Input
              id="title"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              className="col-span-3 placeholder:text-black"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="genre" className="text-right">
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="coverImage" className="text-right">
              Cover de la chanson
            </Label>
            <Input
              id="coverImage"
              type="file"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                setCoverImage(file);
              }}
              className="col-span-3 placeholder:text-black"
            />
          </div>
        </div>

        <DialogFooter>
        <DialogClose
            asChild
            onClick={() => {
              if (isSuccess) {
                resetForm();
              }
            }}
          >
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
          >
          
            {isLoading ? "Enregistrement..." : "Enregistrer la chanson"}
          </Button>
          </DialogClose>
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
