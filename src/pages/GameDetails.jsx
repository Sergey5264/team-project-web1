import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [similarGames, setSimilarGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchGameData = async () => {
      setIsLoading(true);
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

        if (gameData.genres && gameData.genres.length > 0) {
          const mainGenre = gameData.genres[0].slug;
          const similarRes = await fetch(
            `https://api.rawg.io/api/games?key=${API_KEY}&genres=${mainGenre}&ordering=-rating&page_size=5`
          );
          const similarData = await similarRes.json();
          const filteredSimilar = similarData.results.filter(g => g.id !== gameData.id).slice(0, 4);
          setSimilarGames(filteredSimilar);
        }

      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGameData();
  }, [id]);

  if (isLoading) return <div className="p-20 text-center text-zinc-500 font-mono text-xl">Loading data...</div>;
  if (!game) return <div className="p-20 text-center text-red-500">Game not found</div>;

  return (
    <>
      <div className={`max-w-6xl mx-auto pb-12 transition-all duration-300 ${selectedScreenshot ? 'blur-md scale-[0.99] pointer-events-none' : ''}`}>
        
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6 bg-zinc-900/50 p-3 rounded">
          <Link to="/" className="hover:text-white transition">All Games</Link>
          <span>&gt;</span>
          <span className="text-zinc-300">{game.genres?.[0]?.name || 'Game'}</span>
          <span>&gt;</span>
          <span className="text-white">{game.name}</span>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-6 tracking-tight">
          {game.name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-black aspect-video relative">
               <img src={game.background_image} alt={game.name} className="w-full h-full object-contain" />
            </div>
            
            {screenshots.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {screenshots.slice(0, 5).map((shot) => (
                  <img 
                    key={shot.id} 
                    src={shot.image} 
                    alt="Thumbnail" 
                    className="h-20 w-32 object-cover cursor-pointer hover:opacity-80 transition-opacity border border-transparent hover:border-white"
                    onClick={() => setSelectedScreenshot(shot.image)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#12151a] p-6 text-sm text-zinc-400 flex flex-col h-full">
            <img src={game.background_image} alt="capsule" className="w-full mb-4 hidden lg:block" />
            
            <p className="mb-6 leading-snug line-clamp-4">
              {game.description_raw || game.description.replace(/<[^>]*>?/gm, '')}
            </p>

            <div className="space-y-2 mt-auto">
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-500">Recent Reviews:</span>
                <span className={game.rating > 4 ? "text-[#66C0F4]" : "text-zinc-300"}>
                  {game.rating > 4 ? 'Very Positive' : 'Mixed'} ({game.rating}/5)
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-500">Release Date:</span>
                <span className="text-zinc-300">{game.released || 'TBA'}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-500">Developer:</span>
                <span className="text-[#66C0F4]">{game.developers?.map(d => d.name).join(', ') || 'Unknown'}</span>
              </div>
            </div>

            {game.website && (
              <a 
                href={game.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 mt-6 text-center bg-gradient-to-r from-[#75b022] to-[#588a1b] text-white font-medium hover:from-[#8ed629] hover:to-[#6aa621] transition-all rounded-sm shadow-md"
              >
                Visit Official Website
              </a>
            )}
          </div>
        </div>

        <div className="max-w-3xl mb-16">
          <h2 className="text-xl font-medium text-white mb-4 uppercase tracking-wide border-b border-zinc-800 pb-2">About This Game</h2>
          <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-sm">
            {game.description_raw || game.description.replace(/<[^>]*>?/gm, '')}
          </p>
        </div>

        {similarGames.length > 0 && (
          <div className="mt-16 border-t border-zinc-800 pt-8">
            <h2 className="text-xl font-medium text-white mb-6 uppercase tracking-wide">More like this</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {similarGames.map((simGame) => (
                <Link 
                  key={simGame.id} 
                  to={`/game/${simGame.id}`} 
                  className="bg-[#12151a] hover:bg-[#1e2329] transition-colors group block relative"
                >
                  <img 
                    src={simGame.background_image} 
                    alt={simGame.name} 
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-zinc-300 group-hover:text-white truncate">
                      {simGame.name}
                    </h3>
                    <div className="mt-1 flex justify-between items-center">
                      <span className="text-xs text-zinc-500">{simGame.released?.split('-')[0]}</span>
                      <span className="text-xs text-[#66C0F4]">{simGame.genres?.[0]?.name}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedScreenshot && (
        <div 
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div className="relative max-w-7xl w-full flex items-center justify-center">
             <img 
              src={selectedScreenshot} 
              alt="Full size screenshot" 
              className="max-w-full max-h-[90vh] shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-zinc-800 object-contain"
            />
            <button className="absolute -top-10 right-0 text-zinc-400 text-4xl hover:text-white transition">&times;</button>
          </div>
        </div>
      )}
    </>
  );
}