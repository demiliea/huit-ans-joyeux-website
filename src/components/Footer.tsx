
import React from 'react';
import { Heart, Sparkles, Gift } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-party py-12">
      <div className="container mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
          <h3 className="text-3xl font-bold text-white">Joyeux 18ème Anniversaire !</h3>
          <Gift className="w-8 h-8 text-white animate-bounce" />
        </div>
        
        <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
          Que cette nouvelle année de vie soit remplie d'aventures, de bonheur, 
          et de tous tes rêves qui se réalisent !
        </p>
        
        <div className="flex items-center justify-center gap-2 text-white/80">
          <span>Fait avec</span>
          <Heart className="w-5 h-5 text-birthday-coral animate-pulse" />
          <span>pour toi !</span>
        </div>
        
        <div className="mt-8 text-white/60 text-sm">
          © 2024 - Site d'anniversaire personnalisé
        </div>
      </div>
    </footer>
  );
};

export default Footer;
