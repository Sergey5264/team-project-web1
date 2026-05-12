import { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = () => {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(saved);
  };

  useEffect(() => {
    loadFavorites();
    window.addEventListener('storage_updated', loadFavorites);
    return () => window.removeEventListener('storage_updated', loadFavorites);
  }, []);

  return (
    <div className="space-y-8 py-4">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter">Digital_Library</h1>
        <p className="text-[#bef264] text-xs font-bold mt-2 uppercase tracking-widest italic">
          {favorites.length} archives_stored_locally
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map(game => <GameCard key={game.id} game={game} />)}
        </div>
      ) : (
        <div className="p-20 text-center border-2 border-dashed border-white/5 bg-white/5 opacity-50 uppercase tracking-widest font-bold">
          Vault_is_empty. Go explore some games!
        </div>
      )}
    </div>
  );
}