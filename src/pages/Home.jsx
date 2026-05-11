import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (isLoading) return <div className="p-20 text-center text-[#c6d4df] font-mono">Loading Store...</div>;

  const featuredGame = games[0];
  const otherGames = games.slice(1);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-[#c6d4df] uppercase text-[13px] tracking-widest mb-3 font-semibold">Featured & Recommended</h2>
        {featuredGame && (
          <Link to={`/game/${featuredGame.id}`} className="flex flex-col lg:flex-row bg-[#16202d] shadow-2xl hover:bg-[#1b2838] transition-colors group">
            <div className="lg:w-2/3 aspect-video">
              <img src={featuredGame.background_image} alt="Featured" className="w-full h-full object-cover" />
            </div>
            <div className="lg:w-1/3 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-light text-white mb-4">{featuredGame.name}</h3>
                <div className="grid grid-cols-2 gap-2">
                   {featuredGame.short_screenshots?.slice(1, 5).map(s => (
                     <img key={s.id} src={s.image} className="w-full aspect-video object-cover opacity-60" />
                   ))}
                </div>
              </div>
              <div className="mt-6 flex justify-between items-end">
                 <span className="bg-[#4c6b22] text-[#beee11] px-2 py-1 text-sm font-medium">Coming Soon</span>
                 <span className="text-[#66c0f4] text-xs">Rating: {featuredGame.rating}</span>
              </div>
            </div>
          </Link>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#c6d4df] uppercase text-[13px] tracking-widest font-semibold">Trending Now</h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-zinc-700 to-transparent ml-4"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {otherGames.map((game) => (
            <Link 
              key={game.id} 
              to={`/game/${game.id}`} 
              className="bg-[#16202d] hover:bg-[#1b2838] transition-all transform hover:-translate-y-1 shadow-lg"
            >
              <img src={game.background_image} alt={game.name} className="w-full h-32 object-cover" />
              <div className="p-3">
                <h3 className="text-sm font-medium text-[#c6d4df] truncate mb-1">{game.name}</h3>
                <div className="flex justify-between items-center text-[11px] text-[#8f98a0]">
                  <span>{game.released?.split('-')[0]}</span>
                  <span className="text-[#66c0f4]">{game.genres?.[0]?.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}