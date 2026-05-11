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
        
        if (!API_KEY) throw new Error("Ключ API не знайдено в .env");

        const response = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&page_size=13`);
        if (!response.ok) throw new Error("Помилка запиту до RAWG");
        
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

  if (isLoading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="text-[#bef264] text-xl animate-pulse font-bold uppercase tracking-widest">System_Booting...</div>
    </div>
  );

  if (error) return (
    <div className="p-20 text-center text-red-500 font-bold uppercase tracking-tighter">
      [Error]: {error}
    </div>
  );

  const featured = games[0];
  const trending = games.slice(1);

  return (
    <div className="space-y-10 py-4">
      {/* FEATURED BANNER */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#bef264] font-black text-xs uppercase tracking-widest">Featured_&_Recommended</span>
          <div className="h-[1px] flex-1 bg-white/5"></div>
        </div>
        
        {featured && (
          <Link to={`/game/${featured.id}`} className="flex flex-col lg:flex-row bg-[#16202d] border border-white/5 shadow-2xl hover:bg-[#1c242d] transition-all group overflow-hidden">
            <div className="lg:w-2/3 aspect-video relative">
              <img src={featured.background_image} alt={featured.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="lg:w-1/3 p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-black text-white mb-6 leading-none group-hover:text-[#bef264] transition-colors uppercase italic">{featured.name}</h2>
                <div className="grid grid-cols-2 gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                   {featured.short_screenshots?.slice(1, 5).map(s => (
                     <img key={s.id} src={s.image} className="w-full aspect-video object-cover" alt="preview" />
                   ))}
                </div>
              </div>
              <div className="mt-8 flex justify-between items-end">
                 <div className="flex flex-col">
                    <span className="text-[#bef264] text-2xl font-black uppercase italic leading-none">Ready_to_play</span>
                    <span className="text-[#8f98a0] text-sm mt-2 font-bold tracking-tighter">Rating: {featured.rating} / 5</span>
                 </div>
                 <div className="bg-[#bef264] text-black px-6 py-2 text-sm font-black uppercase hover:bg-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                   Access_Link
                 </div>
              </div>
            </div>
          </Link>
        )}
      </section>

      {/* TRENDING GRID */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-black uppercase italic tracking-tighter">Trending_Now</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trending.map((game) => (
            <Link 
              key={game.id} 
              to={`/game/${game.id}`} 
              className="bg-[#16202d] border border-transparent hover:border-[#bef264]/40 transition-all group"
            >
              <div className="relative aspect-video overflow-hidden">
                <img src={game.background_image} alt={game.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute top-2 right-2 bg-black/80 px-1.5 py-0.5 text-[11px] font-black text-[#bef264] border border-[#bef264]/20">
                  {game.rating}
                </div>
              </div>
              <div className="p-4 border-t border-white/5">
                <h3 className="text-[15px] font-bold text-white truncate mb-2 uppercase tracking-tight">{game.name}</h3>
                <div className="flex justify-between items-center text-[10px] font-black text-zinc-500">
                  <span className="bg-black/30 px-2 py-0.5 rounded-sm">[{game.released?.split('-')[0]}]</span>
                  <span className="text-[#bef264] opacity-0 group-hover:opacity-100 transition-opacity tracking-[0.2em] italic">OPEN_VAULT</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}