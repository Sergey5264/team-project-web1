import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
        const [gameRes, screenRes] = await Promise.all([
          fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`),
          fetch(`https://api.rawg.io/api/games/${id}/screenshots?key=${API_KEY}`)
        ]);

        const gameData = await gameRes.json();
        const screenData = await screenRes.json();

        setGame(gameData);
        setScreenshots(screenData.results);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGameData();
  }, [id]);

  const getMetacriticColor = (score) => {
    if (!score) return 'text-zinc-500';
    if (score >= 75) return 'text-green-500 border-green-500/50 bg-green-500/10';
    if (score >= 50) return 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10';
    return 'text-red-500 border-red-500/50 bg-red-500/10';
  };

  if (isLoading) return <div className="p-20 text-center animate-pulse text-zinc-500 font-mono text-xl">Loading data...</div>;
  if (!game) return <div className="p-20 text-center text-red-500">Game not found</div>;

  return (
    <>
      {/* 1. ОСНОВНОЙ КОНТЕНТ (Блюрится при клике) */}
      <div className={`max-w-6xl mx-auto pb-12 transition-all duration-300 ${selectedScreenshot ? 'blur-md scale-[0.98] pointer-events-none' : ''}`}>
        <Link to="/" className="text-zinc-500 hover:text-white transition mb-6 inline-block font-medium">
          ← Back to Vault
        </Link>
        
        <div className="relative h-[500px] rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-blue-500/5">
          <img src={game.background_image} alt={game.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
          <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
            <div>
              <div className="flex gap-2 mb-3">
                {game.genres?.map(g => (
                  <span key={g.id} className="bg-blue-600/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {g.name}
                  </span>
                ))}
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter italic">
                {game.name}
              </h1>
            </div>
            
            {game.metacritic && (
              <div className={`hidden md:flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 backdrop-blur-md ${getMetacriticColor(game.metacritic)}`}>
                <span className="text-4xl font-black">{game.metacritic}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest mt-1">Score</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 border-b border-zinc-800 pb-2 uppercase tracking-wider">About</h2>
              <p className="text-zinc-400 leading-relaxed text-lg whitespace-pre-wrap">
                {game.description_raw || game.description.replace(/<[^>]*>?/gm, '')}
              </p>
            </section>

            {screenshots.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-zinc-800 pb-2 uppercase tracking-wider">Gallery</h2>
                <div className="grid grid-cols-2 gap-5">
                  {screenshots.slice(0, 4).map((shot) => (
                    <img 
                      key={shot.id} 
                      src={shot.image} 
                      alt="Gameplay screenshot" 
                      className="w-full h-48 object-cover rounded-2xl border-2 border-zinc-800 hover:border-blue-500 cursor-pointer transition-all hover:scale-105 pointer-events-auto"
                      onClick={() => setSelectedScreenshot(shot.image)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6 bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800/50 h-fit sticky top-28">
            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2">Developer</h3>
              <p className="text-white font-medium">{game.developers?.map(d => d.name).join(', ') || 'Unknown'}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2">Release Date</h3>
              <p className="text-white font-medium">{game.released || 'TBA'}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3">Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {game.platforms?.map(p => (
                  <span key={p.platform.id} className="bg-zinc-800/80 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300">
                    {p.platform.name}
                  </span>
                ))}
              </div>
            </div>
            {game.website && (
              <a 
                href={game.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full py-4 text-center bg-blue-600 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-colors mt-8"
              >
                Official Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. МОДАЛЬНОЕ ОКНО (Не блюрится) */}
      {selectedScreenshot && (
        <div 
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div className="relative max-w-5xl w-full flex items-center justify-center">
             <img 
              src={selectedScreenshot} 
              alt="Full size screenshot" 
              className="max-w-full max-h-[90vh] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-zinc-800 object-contain"
            />
            <button className="absolute -top-12 right-0 text-white text-4xl font-light hover:text-blue-500 transition">&times;</button>
          </div>
        </div>
      )}
    </>
  );
}