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

        if (gameData.genres?.[0]) {
          const simRes = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&genres=${gameData.genres[0].slug}&page_size=5`);
          const simData = await simRes.json();
          setSimilarGames(simData.results.filter(g => g.id !== gameData.id).slice(0, 4));
        }
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };
    fetchGameData();
  }, [id]);

  if (isLoading) return <div className="p-20 text-center text-4xl">FETCHING_DATA...</div>;
  if (!game) return <div className="p-20 text-center text-red-500 text-4xl">GAME_NOT_FOUND</div>;

  return (
    <>
      <div className={`space-y-8 transition-all ${selectedScreenshot ? 'blur-sm pointer-events-none' : ''}`}>
        <Link to="/" className="inline-block bg-[#3f3f4a] border-4 border-black px-4 py-1 text-2xl hover:bg-white hover:text-black transition-colors mb-4">
          &lt; BACK_TO_FILES
        </Link>

        <div className="bg-[#3f3f4a] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-2">
          <div className="bg-black border-4 border-black aspect-video overflow-hidden">
            <img src={game.background_image} alt={game.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 bg-black/40 mt-2">
            <h1 className="text-6xl font-black uppercase text-white tracking-tighter">{game.name}</h1>
            <div className="flex flex-wrap gap-4 mt-4">
              {game.genres?.map(g => (
                <span key={g.id} className="bg-[#bef264] text-black px-3 py-1 font-bold uppercase text-lg border-2 border-black">
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#3f3f4a] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-bold uppercase border-b-4 border-black mb-4 pb-2">File_Description</h2>
            <p className="text-2xl leading-tight text-zinc-300">
              {game.description_raw || game.description.replace(/<[^>]*>?/gm, '')}
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {screenshots.slice(0, 4).map(s => (
                <img 
                  key={s.id} 
                  src={s.image} 
                  className="border-4 border-black cursor-pointer hover:scale-[1.02] transition-transform pointer-events-auto"
                  onClick={() => setSelectedScreenshot(s.image)}
                />
              ))}
            </div>
          </div>

          <div className="bg-[#3f3f4a] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-fit space-y-6">
            <div>
              <p className="text-zinc-500 uppercase text-lg">Rating</p>
              <p className="text-4xl text-[#bef264] font-bold">{game.rating} / 5</p>
            </div>
            <div>
              <p className="text-zinc-500 uppercase text-lg">Released</p>
              <p className="text-2xl text-white">{game.released}</p>
            </div>
            <div>
              <p className="text-zinc-500 uppercase text-lg">Developer</p>
              <p className="text-2xl text-white truncate">{game.developers?.[0]?.name || 'Unknown'}</p>
            </div>
            <a href={game.website} target="_blank" className="block text-center bg-white text-black text-2xl font-bold py-3 border-4 border-black hover:bg-[#bef264] transition-colors uppercase">
              Official_Site
            </a>
          </div>
        </div>
      </div>

      {selectedScreenshot && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 cursor-pointer pointer-events-auto" onClick={() => setSelectedScreenshot(null)}>
          <img src={selectedScreenshot} className="max-w-full max-h-[90vh] border-8 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,0.5)]" />
        </div>
      )}
    </>
  );
}