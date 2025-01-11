import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Headphones, Shuffle, Users } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white">

      <section className="h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-bold mb-4">Écoutez de la musique illimitée</h1>
        <p className="text-xl mb-6">Des millions de chansons, partout, à tout moment.</p>
        <Link to="/register">
          <button className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
            S'inscrire
          </button>
        </Link>
      </section>

      <section className="py-20 bg-white text-gray-800">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">Pourquoi choisir notre application ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="flex flex-col items-center">
              <Music className="text-5xl mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Écoute illimitée</h3>
              <p className="text-lg text-gray-600">Accédez à des millions de chansons, partout et tout le temps.</p>
            </div>

            <div className="flex flex-col items-center">
              <Headphones className="text-5xl mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Écoutez en mode hors ligne</h3>
              <p className="text-lg text-gray-600">Téléchargez vos morceaux préférés et écoutez-les sans connexion.</p>
            </div>

            <div className="flex flex-col items-center">
              <Shuffle className="text-5xl mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Listes de lecture personnalisées</h3>
              <p className="text-lg text-gray-600">Créez et partagez vos playlists avec vos amis.</p>
            </div>

            <div className="flex flex-col items-center">
              <Users className="text-5xl mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Suivez vos artistes favoris</h3>
              <p className="text-lg text-gray-600">Recevez des recommandations et des notifications en temps réel.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Ce que nos utilisateurs disent</h2>
          <div className="flex justify-center space-x-12">
            <div className="w-1/3">
              <p className="text-lg mb-4">"Une des meilleures expériences musicales que j'ai jamais eues. J'adore la qualité sonore!"</p>
              <p>- Julie, utilisatrice satisfaite</p>
            </div>
            <div className="w-1/3">
              <p className="text-lg mb-4">"J'adore pouvoir écouter mes chansons même sans connexion internet!"</p>
              <p>- Marc, utilisateur fidèle</p>
            </div>
            <div className="w-1/3">
              <p className="text-lg mb-4">"Les recommandations sont parfaites, je découvre toujours de nouveaux morceaux." </p>
              <p>- Emma, passionnée de musique</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Rejoignez-nous et commencez à écouter maintenant !</h2>
        <Link to="/register">
          <button className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
            S'inscrire dès maintenant
          </button>
        </Link>
      </section>

    </div>
  );
}

export default LandingPage;
