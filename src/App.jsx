import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import GameDetails from './pages/GameDetails';
import Favorites from './pages/Favorites';

export default function App() {
  return (
    <div className="min-h-screen bg-[#1b2838] text-[#c6d4df] font-sans selection:bg-[#66c0f4]/30">
      <Header />
      <main className="max-w-[1200px] mx-auto p-4 md:p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/game/:id" element={<GameDetails />} />
        </Routes>
      </main>
    </div>
  );
}