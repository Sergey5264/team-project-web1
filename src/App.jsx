import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import GameDetails from './pages/GameDetails';
import Favorites from './pages/Favorites';

export default function App() {
  return (
    // Використовуємо ретро-сіру палітру Aseprite
    <div className="min-h-screen bg-[#2b2d31] text-[#e0e0e0] font-['VT323'] text-xl selection:bg-[#5b5b6b]">
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