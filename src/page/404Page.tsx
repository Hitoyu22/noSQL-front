import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftCircle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white flex flex-col items-center justify-center text-center">
      
      <div className="text-9xl mb-6">
        <span className="font-bold">404</span>
      </div>

      <h1 className="text-4xl font-bold mb-4">Page non trouvée</h1>
      <p className="text-xl mb-6">Désolé, nous n'avons pas pu trouver cette page.</p>

      <Link to="/">
        <button className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg flex items-center">
          <ArrowLeftCircle className="mr-2" size={20} /> Retour à l'accueil
        </button>
      </Link>
      
    </div>
  );
}

export default NotFoundPage;
