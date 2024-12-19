import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import axiosInstance from "@/context/axiosInstance";

interface AddPlaylistProps {
  userId: string;
}

export function AddPlaylist({ userId }: AddPlaylistProps) {
  const [playlistName, setPlaylistName] = useState<string>("");
  const [playlistDescription, setPlaylistDescription] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resetForm = () => {
    setPlaylistName("");
    setPlaylistDescription("");
    setIsPublic(false);
    setIsSuccess(false);
  };

  const handleSave = async () => {
    if (!playlistName || !playlistDescription) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    const newPlaylist = {
      name: playlistName,
      description: playlistDescription,
      isPublic,
      user: userId,
    };

    try {
      const response = await axiosInstance.post("/playlists/", newPlaylist);
      console.log("Playlist ajoutée avec succès:", response.data);
      setIsSuccess(true);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"empty"}>
          <PlusCircle />
          Ajouter une playlist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] overflow-visible">
        <DialogHeader>
          <DialogTitle>Nouvelle playlist</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle playlist à la plateforme. Remplissez le formulaire ci-dessous et cliquez sur "Enregistrer".
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="playlistName" className="text-right">
              Nom de la playlist
            </Label>
            <Input
              id="playlistName"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="playlistDescription" className="text-right">
              Description
            </Label>
            <Input
              id="playlistDescription"
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isPublic" className="text-right">
              Rendre public
            </Label>
            <div className="col-span-3 flex items-center">
              <Checkbox
                id="isPublic"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked as boolean)}
              />
              <span className="ml-2">Oui</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Enregistrement..." : "Enregistrer la playlist"}
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
