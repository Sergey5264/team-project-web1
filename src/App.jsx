import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import GameDetails from './pages/GameDetails';
import Header from './components/Header';

export default function App() {
  return (
    <div className="min-h-screen bg-[#1b2838] text-white selection:bg-[#bef264]/30 font-['Roboto']">
      <Header />
      <main className="max-w-[1400px] mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:id" element={<GameDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </div>
  );
}