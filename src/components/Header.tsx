
import React from 'react';
import { Sparkles, Gift, Cake } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="relative min-h-screen bg-gradient-party flex items-center justify-center overflow-hidden">
      {/* Éléments décoratifs flottants */}
      <div className="absolute inset-0">
        <Sparkles className="absolute top-20 left-20 w-8 h-8 text-white animate-float" style={{ animationDelay: '0s' }} />
        <Gift className="absolute top-32 right-32 w-6 h-6 text-white animate-float" style={{ animationDelay: '1s' }} />
        <Cake className="absolute bottom-40 left-16 w-10 h-10 text-white animate-float" style={{ animationDelay: '2s' }} />
        <Sparkles className="absolute bottom-20 right-20 w-6 h-6 text-white animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="text-center z-10 px-6 max-w-4xl">
        <div className="animate-bounce-slow">
          <h1 className="text-8xl md:text-9xl font-bold text-white mb-4 drop-shadow-2xl">
            18
          </h1>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-pulse-glow">
          Joyeux Anniversaire !
        </h2>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 font-medium">
          Célébrons cette étape importante avec style ! ✨
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 text-white/80 text-lg">
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Majorité
          </span>
          <span className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Souvenirs
          </span>
          <span className="flex items-center gap-2">
            <Cake className="w-5 h-5" />
            Fête
          </span>
        </div>
      </div>

      {/* Gradient overlay pour un meilleur contraste */}
      <div className="absolute inset-0 bg-black/20" />
    </header>
  );
};

export default Header;
