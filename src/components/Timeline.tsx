
import React from 'react';
import { Calendar, Gift2, GraduationCap, Heart, Sparkles } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const Timeline: React.FC = () => {
  const events: TimelineEvent[] = [
    {
      year: "2006",
      title: "Bienvenue au monde !",
      description: "Le début d'une belle aventure",
      icon: <Heart className="w-5 h-5" />,
      color: "birthday-coral"
    },
    {
      year: "2012",
      title: "Première rentrée scolaire",
      description: "Le début de l'apprentissage",
      icon: <GraduationCap className="w-5 h-5" />,
      color: "birthday-mint"
    },
    {
      year: "2018",
      title: "Entrée au collège",
      description: "Nouveaux défis, nouvelles amitiés",
      icon: <Sparkles className="w-5 h-5" />,
      color: "birthday-purple"
    },
    {
      year: "2021",
      title: "Années lycée",
      description: "Grandir et se découvrir",
      icon: <Calendar className="w-5 h-5" />,
      color: "birthday-pink"
    },
    {
      year: "2024",
      title: "18 ans - Majorité !",
      description: "Une nouvelle étape commence",
      icon: <Gift2 className="w-5 h-5" />,
      color: "birthday-gold"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-birthday-pink to-birthday-purple bg-clip-text text-transparent mb-4">
            Timeline des Souvenirs
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            18 années de bonheur, de croissance et de moments inoubliables
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Ligne centrale */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-birthday-pink via-birthday-purple to-birthday-gold rounded-full"></div>

            {events.map((event, index) => (
              <div
                key={index}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Contenu */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 bg-${event.color} rounded-full flex items-center justify-center text-white`}>
                        {event.icon}
                      </div>
                      <span className="text-2xl font-bold text-gray-800">{event.year}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                </div>

                {/* Point central */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-birthday-pink rounded-full shadow-lg z-10"></div>

                {/* Espace vide de l'autre côté */}
                <div className="w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
