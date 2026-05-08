import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const handleSurpriseMe = async () => {
    try {
      const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
      // Беремо випадкову сторінку з перших 5 (це 100 ігор на вибір)
      const randomPage = Math.floor(Math.random() * 5) + 1;
      
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${API_KEY}&page=${randomPage}&page_size=20&ordering=-rating`
      );
      const data = await response.json();
      
      // Вибираємо випадкову гру з масиву результатів
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const randomGameId = data.results[randomIndex].id;

      // Перекидаємо користувача на сторінку цієї гри
      navigate(`/game/${randomGameId}`);
    } catch (error) {
      console.error("Failed to find a surprise game:", error);
    }
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tighter text-white hover:opacity-80 transition">
          GAME<span className="text-blue-500 underline decoration-2 underline-offset-4">VAULT</span>
        </Link>

        <div className="flex items-center gap-8">
          <nav className="flex items-center gap-6 text-sm font-semibold text-zinc-400">
            <button 
              onClick={handleSurpriseMe}
              className="hover:text-blue-400 transition-colors uppercase tracking-wider"
            >
              Surprise me
            </button>
            <Link to="/favorites" className="hover:text-white transition-colors uppercase tracking-wider">
              Favorites
            </Link>
          </nav>
          
          <div className="hidden sm:block h-10 w-48 lg:w-64 bg-zinc-900 border border-zinc-800 rounded-full px-4 flex items-center text-zinc-500 text-sm">
            Search...
          </div>
        </div>
      </div>
    </header>
  );
}