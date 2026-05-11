import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const handleSurpriseMe = async () => {
    try {
      const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${API_KEY}&page=${randomPage}&page_size=20&ordering=-rating`
      );
      const data = await response.json();
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const randomGameId = data.results[randomIndex].id;
      navigate(`/game/${randomGameId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="bg-[#171a21] shadow-xl sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-black tracking-tighter text-[#c6d4df] hover:text-white transition-colors uppercase italic">
            GAME<span className="text-[#66c0f4] underline decoration-2 underline-offset-4">VAULT</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-[13px] uppercase tracking-widest font-medium">
            <button onClick={handleSurpriseMe} className="text-[#c6d4df] hover:text-[#66c0f4] transition">Surprise me</button>
            <Link to="/favorites" className="text-[#c6d4df] hover:text-[#66c0f4] transition">Favorites</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
           <div className="h-8 w-48 bg-[#316282] rounded-sm px-3 flex items-center justify-between group cursor-pointer hover:bg-[#417a9b] transition-colors">
            <span className="text-[#c6d4df] text-[11px]">search games...</span>
            <span className="text-[#c6d4df] text-xs">🔍</span>
          </div>
        </div>
      </div>
    </header>
  );
}