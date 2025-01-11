# Projet NoSQL - Partie Front 

## Groupe 2 : 
- Rémy THIBAUT
- Ana Fernandes

## Présentation du projet 

Le projet consiste à recréer une application de musique comme Spotify en permettant d'ajouter des musiques, des artistes, d'aimer des chansons et même de les écouter.

Ce projet contient le frontend de l'application. 
Le backend se trouve à cette adresse : https://github.com/Hitoyu22/NoSQL-back 

## Dépendances du projet 

Les librairies utilisées pour ce projet sont : 

- **Shadcn** UI pour l'UI générale de l'application avec Tailwind CSS
- **Axios** pour les appels APIs
- **Lucide-React** pour les icones 


## Installation et lancement du projet

Pour lancer se projet, il faut déjà avoir le backend de configurer et de lancer. 

### Télécharger le projet 

Pour télécharger le projet, il vous suffit de faire la commande suivante 

```bash
git clone https://github.com/Hitoyu22/noSQL-front
cd noSQL-front
```

### Installer les dépendances 

Pour installer les dépendances, il faut avoir au préalable : 
- **Node JS** (version 20 ou supérieur)
- **NPM** (version 10 ou supérieur) 

Il ne vous reste ensuite plus qu'à lancer la commande suivante pour installer les dépendances du projet : 

```bash
npm install
```

### Configuration des variables d'environnements

Pour lancer le projet, ce dernier doit pouvoir se connecter au serveur.

Vous avez besoin d'un fichier d'environnement .env pour utiliser le projet en mode développement : 

```bash
touch .env
```

Et ajoutez les variables suivantes : 

- **VITE_API_BASE_URL** : correspond à l'adresse du back que vous avez lancé (par exemple **http://localhost:3000**)

### Lancer le projet 

Une fois toutes les étapes précédentes effectuées, vous n'avez plus qu'à lancer la commande suivante pour accéder au front (par défaut, l'url du front sera **http://localhost:5173**) : 

```bash
npm run dev 
```

### Se connecter à l'application 

Un jeu de données sera déjà importé dans le back, un compte utilisateur a déjà été créé pour tester l'ensemble des fonctionnalités rapidement : 

- Email : **demo.projet@esgi.fr**
- Mot de passe : **test**