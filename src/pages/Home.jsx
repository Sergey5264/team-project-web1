import { useState, useEffect } from 'react';

export default function Home() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Беремо ключ із нашого .env файлу
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

  if (isLoading) return <div className="p-10 text-center text-zinc-500">Завантаження...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-4xl font-black mb-8 text-white">
        Trending <span className="text-blue-500">Games</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game) => (
          <div key={game.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all group">
            <img 
              src={game.background_image} 
              alt={game.name} 
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold text-white truncate">{game.name}</h2>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-zinc-400 text-sm">Rating: {game.rating}</span>
                <button className="text-blue-500 text-sm font-semibold hover:underline">
                  Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}