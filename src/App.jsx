import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import GameDetails from './pages/GameDetails';
import Favorites from './pages/Favorites'; // ВОТ ЭТОЙ СТРОЧКИ НЕ ХВАТАЛО

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <Header />
      <main className="max-w-7xl mx-auto p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/game/:id" element={<GameDetails />} />
        </Routes>
      </main>
    </div>
  );
}