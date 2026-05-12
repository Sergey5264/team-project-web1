import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function GameCard({ game }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some(fav => fav.id === game.id));
  }, [game.id]);

  const toggleFavorite = (e) => {
    e.preventDefault(); // Чтобы не переходить по ссылке при клике на сердечко
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      favorites = favorites.filter(fav => fav.id !== game.id);
    } else {
      favorites.push({
        id: game.id,
        name: game.name,
        background_image: game.background_image,
        rating: game.rating,
        released: game.released
      });
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <Link 
      to={`/game/${game.id}`} 
      className="bg-[#16202d] border border-transparent hover:border-[#bef264]/40 transition-all group relative"
    >
      <div className="relative aspect-video overflow-hidden">
        <img src={game.background_image} alt={game.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" />
        
        {/* Кнопка Избранного */}
        <button 
          onClick={toggleFavorite}
          className={`absolute top-2 left-2 p-2 rounded-sm backdrop-blur-md transition-all ${isFavorite ? 'bg-[#bef264] text-black' : 'bg-black/60 text-white hover:bg-white/20'}`}
        >
          {isFavorite ? '★' : '☆'}
        </button>

        <div className="absolute top-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[11px] font-black text-[#bef264] border border-[#bef264]/20">
          {game.rating}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-[15px] font-bold text-white truncate mb-2 uppercase tracking-tight">{game.name}</h3>
        <div className="flex justify-between items-center text-[10px] font-black text-zinc-500">
          <span className="bg-black/30 px-2 py-0.5">[{game.released?.split('-')[0]}]</span>
          <span className="text-[#bef264] opacity-0 group-hover:opacity-100 transition-opacity italic">OPEN_VAULT</span>
        </div>
      </div>
    </Link>
  );
}