import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';

export default function Home() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const API_KEY = import.meta.env.VITE_RAWG_API_KEY; 
        const response = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&page_size=13`);
        const data = await response.json();
        setGames(data.results);
      } catch (err) { console.error(err); } 
      finally { setIsLoading(false); }
    };
    fetchGames();
  }, []);

  if (isLoading) return <div className="p-20 text-center text-[#bef264] text-xl animate-pulse font-black uppercase">Initializing_Vault...</div>;

  const featured = games[0];
  const trending = games.slice(1);

  return (
    <div className="space-y-10 py-4">
      {featured && (
        <section>
          <div className="flex items-center gap-3 mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">
            <span className="text-[#bef264]">01.</span> Featured_Recommended
          </div>
          <GameCard game={featured} /> {/* Используем тот же компонент для банера, либо оставь старый банер, если хочешь другой дизайн */}
        </section>
      )}

      <section>
        <h2 className="text-white text-xl font-black uppercase italic tracking-tighter mb-6">Trending_Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trending.map(game => <GameCard key={game.id} game={game} />)}
        </div>
      </section>
    </div>
  );
}