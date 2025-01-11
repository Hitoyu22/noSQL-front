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
import { Checkbox } from "@/components/ui/checkbox";
import axiosInstance from "@/context/axiosInstance";

interface EditPlaylistProps {
  playlistId: string;
}

export function EditPlaylist({ playlistId }: EditPlaylistProps) {
  const [playlistName, setPlaylistName] = useState<string>("");
  const [playlistDescription, setPlaylistDescription] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axiosInstance.get(`/playlists/one/${playlistId}`);
        const { name, description, isPublic } = response.data;
        setPlaylistName(name);
        setPlaylistDescription(description);
        setIsPublic(isPublic);

        console.log("Playlist récupérée avec succès :", response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de la playlist :", error);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  const handleSave = async () => {
    if (!playlistName || !playlistDescription) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", playlistName);
    formData.append("description", playlistDescription);
    formData.append("isPublic", isPublic.toString());

    if (coverImage) {
      formData.append("coverImageUrl", coverImage);
    }

    try {
      const response = await axiosInstance.put(`/playlists/${playlistId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Playlist modifiée avec succès :", response.data);
      setIsSuccess(true);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la modification de la playlist :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"empty"}>
          <PlusCircle />
          Modifier la playlist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] overflow-visible">
        <DialogHeader>
          <DialogTitle>Modifier playlist</DialogTitle>
          <DialogDescription>
            Modifiez les informations de votre playlist ci-dessous et cliquez sur "Enregistrer".
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
              className="col-span-3 placeholder:text-black"
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
              className="col-span-3 placeholder:text-black"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="coverImageUrl" className="text-right">
              Nouvelle image de couverture
            </Label>
            <Input
              id="coverImageUrl"
              type="file"
              onChange={(e) => setCoverImage(e.target.files ? e.target.files[0] : null)}
              className="col-span-3 placeholder:text-black"
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
        <DialogClose
            asChild
            onClick={() => {
              if (isSuccess) {
                setIsSuccess(false);
              }
            }}
          >
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
          </DialogClose>
          <DialogClose
            asChild
            onClick={() => {
              if (isSuccess) {
                setIsSuccess(false);
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
