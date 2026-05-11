import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const API_KEY = import.meta.env.VITE_RAWG_API_KEY; 
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${API_KEY}&page_size=12`
        );
        if (!response.ok) throw new Error('Помилка завантаження');
        const data = await response.json();
        setGames(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (isLoading) return <div className="p-20 text-center animate-pulse text-zinc-500 font-mono">Loading Games...</div>;
  if (error) return <div className="p-20 text-center text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-4xl font-black mb-10 text-white tracking-tighter uppercase italic">
        Trending <span className="text-blue-500 underline decoration-4 underline-offset-8">Games</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {games.map((game) => (
          <Link 
            key={game.id} 
            to={`/game/${game.id}`} 
            className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group block"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={game.background_image} 
                alt={game.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-zinc-800">
                <span className="text-green-400 font-mono text-xs font-bold">{game.rating}</span>
              </div>
            </div>
            
            <div className="p-5">
              <h2 className="text-lg font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                {game.name}
              </h2>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Released: {game.released?.split('-')[0]}</span>
                <span className="text-blue-500 text-xs font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  View →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}