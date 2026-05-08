import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function GameDetails() {
  const { id } = useParams(); // Дістаємо ID з посилання
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
        const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
        const data = await response.json();
        setGame(data);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGameDetails();
  }, [id]);

  if (isLoading) return <div className="p-20 text-center animate-pulse text-zinc-500">Loading details...</div>;
  if (!game) return <div className="p-20 text-center text-red-500">Game not found</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/" className="text-zinc-500 hover:text-white transition mb-8 inline-block">← Back to library</Link>
      
      <div className="relative h-[400px] rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-blue-500/10">
        <img src={game.background_image} alt={game.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
        <h1 className="absolute bottom-8 left-8 text-5xl font-black text-white uppercase italic tracking-tighter">
          {game.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-blue-500 uppercase tracking-widest">About</h2>
          {/* Вичищаємо HTML-теги з опису */}
          <p className="text-zinc-400 leading-relaxed text-lg">
            {game.description_raw || game.description.replace(/<[^>]*>?/gm, '')}
          </p>
        </div>

        <div className="space-y-8 bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800/50">
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2">Rating</h3>
            <span className="text-3xl font-mono text-green-400">{game.rating} / 5</span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2">Released</h3>
            <p className="text-white font-medium">{game.released}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2">Platforms</h3>
            <div className="flex flex-wrap gap-2">
              {game.platforms?.map(p => (
                <span key={p.platform.id} className="bg-zinc-800 px-3 py-1 rounded-lg text-xs text-zinc-300">
                  {p.platform.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}