
import React, { useState } from 'react';
import { MessageCircle, Send, Star } from 'lucide-react';

interface Wish {
  id: number;
  name: string;
  message: string;
  timestamp: string;
}

const WishesSection: React.FC = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);

  const [newWish, setNewWish] = useState({ name: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWish.name.trim() && newWish.message.trim()) {
      const wish: Wish = {
        id: Date.now(),
        name: newWish.name.trim(),
        message: newWish.message.trim(),
        timestamp: "À l'instant"
      };
      setWishes([wish, ...wishes]);
      setNewWish({ name: '', message: '' });
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageCircle className="w-8 h-8 text-birthday-purple" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-birthday-purple to-birthday-pink bg-clip-text text-transparent">
              Messages & Souhaits
            </h2>
            <Star className="w-8 h-8 text-birthday-gold" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Partagez vos plus beaux messages pour cette journée spéciale !
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Formulaire pour ajouter un message */}
          <div className="bg-gradient-soft rounded-2xl p-8 mb-12 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Laissez votre message !
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={newWish.name}
                  onChange={(e) => setNewWish(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-birthday-pink/20 focus:border-birthday-pink focus:outline-none transition-colors"
                />
              </div>
              <div>
                <textarea
                  placeholder="Votre message d'anniversaire..."
                  value={newWish.message}
                  onChange={(e) => setNewWish(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-birthday-pink/20 focus:border-birthday-pink focus:outline-none transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-birthday-pink to-birthday-purple text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Envoyer le message
              </button>
            </form>
          </div>

          {/* Liste des messages */}
          <div className="space-y-6">
            {wishes.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-birthday-pink mx-auto mb-4 opacity-50" />
                <p className="text-gray-500 text-lg">
                  Soyez le premier à laisser un message d'anniversaire !
                </p>
              </div>
            ) : (
              wishes.map((wish) => (
                <div
                  key={wish.id}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-birthday-pink to-birthday-purple rounded-full flex items-center justify-center text-white font-bold">
                        {wish.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{wish.name}</h4>
                        <p className="text-sm text-gray-500">{wish.timestamp}</p>
                      </div>
                    </div>
                    <Star className="w-5 h-5 text-birthday-gold" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{wish.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WishesSection;
