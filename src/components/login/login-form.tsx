import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/context/axiosInstance";
import { useNavigate } from "react-router-dom";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axiosInstance.post("/users/login/", {
        email,
        password,
      });
      const { message, token, user } = response.data;

      console.log("Connexion réussie :", message);
      console.log("Token :", token);
      console.log("Utilisateur :", user);

      localStorage.setItem("token", token);
      localStorage.setItem("user", user.id);


      navigate("/dashboard");

    } catch (err: any) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Connectez-vous à votre compte</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Entrez votre adresse email ci-dessous pour accéder à votre compte.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Mot de passe</Label>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>
      <div className="text-center text-sm">
        Pas encore de compte ?{" "}
        <a href="/register" className="underline underline-offset-4">
          Inscrivez-vous
        </a>
      </div>
    </form>
  );
}
