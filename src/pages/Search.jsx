import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import GameCard from '../components/GameCard';

const SORT_OPTIONS = [
  { value: '-rating', label: 'HIGHEST_RATING' },
  { value: '-released', label: 'RELEASE_DATE' },
  { value: 'name', label: 'NAME_A-Z' },
  { value: '-metacritic', label: 'META_SCORE' }
];

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [games, setGames] = useState([]);
  const [sort, setSort] = useState(SORT_OPTIONS[0]); 
  const [isLoading, setIsLoading] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${API_KEY}&search=${query}&ordering=${sort.value}&page_size=20&search_precise=true`
        );
        const data = await response.json();
        setGames(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, sort]);

  if (!query) return <div className="p-20 text-center opacity-50 uppercase tracking-widest text-xl font-black">Enter_Search_Query...</div>;

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter">
            Search: <span className="text-[#bef264]">{query}</span>
          </h1>
          <p className="text-zinc-500 text-xs font-bold mt-2 uppercase tracking-[0.2em]">
            Vault_Matches: {games.length}
          </p>
        </div>

        <div className="flex items-center gap-3 relative" ref={sortRef}>
          <span className="text-[11px] font-bold text-[#556772] uppercase tracking-widest">Sort_By:</span>
          
          <div 
            className="bg-[#1b2838] text-[#bef264] px-3 py-1.5 text-sm font-bold uppercase cursor-pointer flex items-center gap-2 hover:bg-[#2a3f5a] transition-colors"
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
            {sort.label}
            <span className="text-[10px]">▼</span>
          </div>

          {isSortOpen && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-[#1b2838] border border-black shadow-xl z-50 flex flex-col">
              {SORT_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    setSort(option);
                    setIsSortOpen(false);
                  }}
                  className={`px-3 py-2 text-sm font-bold uppercase cursor-pointer transition-colors ${
                    sort.value === option.value 
                      ? 'bg-[#3e6787] text-white' 
                      : 'text-[#bef264] hover:bg-[#3e6787] hover:text-white'
                  }`}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="p-20 text-center text-[#bef264] text-2xl font-black animate-pulse uppercase italic">
          Scanning_Database...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.length > 0 ? (
            games.map(game => <GameCard key={game.id} game={game} />)
          ) : (
            <div className="col-span-full p-20 text-center bg-white/5 border-2 border-dashed border-white/10 opacity-50">
              <span className="font-bold uppercase tracking-widest italic">No matches found in the vault archive.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}