import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setTerm('');
    setShowDropdown(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!term.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const fetchQuickSearch = async () => {
      setIsSearching(true);
      setShowDropdown(true);
      try {
        const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
        const response = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&search=${term}&page_size=5`);
        const data = await response.json();
        setResults(data.results || []);
      } catch (err) {
        console.error("Quick search error:", err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceId = setTimeout(fetchQuickSearch, 500);
    return () => clearTimeout(debounceId);
  }, [term]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (term.trim()) {
      setShowDropdown(false);
      navigate(`/search?q=${term}`);
    }
  };

  const handleSurpriseMe = async () => {
    try {
      const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const res = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&page=${randomPage}&page_size=20&ordering=-rating`);
      const data = await res.json();
      const randomId = data.results[Math.floor(Math.random() * data.results.length)].id;
      navigate(`/game/${randomId}`);
    } catch (e) {
      console.error("Surprise Me error:", e);
    }
  };

  return (
    <header className="bg-[#171a21] border-b border-white/5 sticky top-0 z-50 p-4 font-['Roboto']">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        
        {/* Логотип */}
        <Link to="/" className="text-2xl font-black italic text-white uppercase tracking-tighter shrink-0">
          GAME<span className="text-[#bef264] underline underline-offset-4">VAULT</span>
        </Link>

        <nav className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
          <Link to="/" className="hover:text-white transition">Discovery</Link>
          <button onClick={handleSurpriseMe} className="hover:text-white transition uppercase tracking-[0.2em]">Surprise_Me</button>
          <Link to="/favorites" className="hover:text-white transition">Favorites</Link>
        </nav>

        <div className="relative flex-1 max-w-md" ref={dropdownRef}>
          <form onSubmit={handleSubmit} className="relative group">
            <input 
              type="text" 
              placeholder="Search..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onFocus={() => term.trim() && setShowDropdown(true)}
              className="w-full bg-[#316282]/20 border border-white/10 px-4 py-2 text-sm outline-none text-white focus:border-[#bef264] transition-all placeholder:text-zinc-600 font-bold"
            />
            <button type="submit" className="absolute right-3 top-2.5 opacity-40 hover:opacity-100 transition-opacity">
              🔍
            </button>
          </form>

          {showDropdown && (
            <div className="absolute top-full left-0 w-full mt-1 bg-[#2a3f5a] shadow-2xl flex flex-col z-[100] border border-black/50">
              {isSearching ? (
                <div className="p-4 text-sm text-[#bef264] italic animate-pulse font-bold tracking-widest uppercase">Searching...</div>
              ) : results.length > 0 ? (
                <>
                  {results.map((game) => (
                    <Link 
                      key={game.id} 
                      to={`/game/${game.id}`}
                      className="flex items-center gap-3 p-2 hover:bg-[#417a9b] transition-colors border-b border-black/20 group"
                    >
                      <img src={game.background_image} alt={game.name} className="w-24 h-12 object-cover" />
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-bold truncate group-hover:text-white uppercase">{game.name}</span>
                        <span className="text-zinc-400 text-[10px] uppercase font-black">
                          {game.released?.split('-')[0] || 'TBA'} • RATING: {game.rating}
                        </span>
                      </div>
                    </Link>
                  ))}
                  <button 
                    onClick={handleSubmit}
                    className="p-3 bg-[#1b2838] hover:bg-[#bef264] hover:text-black text-white text-xs font-black uppercase tracking-widest transition-colors text-center"
                  >
                    View All Results
                  </button>
                </>
              ) : (
                <div className="p-4 text-sm text-zinc-400 font-bold uppercase tracking-widest">No matches found.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}