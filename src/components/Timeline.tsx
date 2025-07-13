import React, { useState, useEffect } from 'react';
import { Calendar, Gift, GraduationCap, Heart, Sparkles, Camera, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  photoUrl?: string;
  mediaItemId?: string;
  createdAt?: string;
}

const Timeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Default events
  const defaultEvents: TimelineEvent[] = [
    {
      id: 'default-1',
      year: "2006",
      title: "Bienvenue au monde !",
      description: "Le début d'une belle aventure",
      icon: <Heart className="w-5 h-5" />,
      color: "birthday-coral"
    },
    {
      id: 'default-2',
      year: "2012",
      title: "Première rentrée scolaire",
      description: "Le début de l'apprentissage",
      icon: <GraduationCap className="w-5 h-5" />,
      color: "birthday-mint"
    },
    {
      id: 'default-3',
      year: "2018",
      title: "Entrée au collège",
      description: "Nouveaux défis, nouvelles amitiés",
      icon: <Sparkles className="w-5 h-5" />,
      color: "birthday-purple"
    },
    {
      id: 'default-4',
      year: "2021",
      title: "Années lycée",
      description: "Grandir et se découvrir",
      icon: <Calendar className="w-5 h-5" />,
      color: "birthday-pink"
    },
    {
      id: 'default-5',
      year: "2024",
      title: "18 ans - Majorité !",
      description: "Une nouvelle étape commence",
      icon: <Gift className="w-5 h-5" />,
      color: "birthday-gold"
    }
  ];

  const fetchTimelineEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/api/timeline');
      
      if (response.ok) {
        const apiEvents = await response.json();
        
        // Convert API events to Timeline events
        const convertedEvents: TimelineEvent[] = apiEvents.map((event: any) => ({
          id: event.id,
          year: event.year,
          title: event.title,
          description: event.description,
          icon: <Camera className="w-5 h-5" />,
          color: "birthday-purple",
          photoUrl: event.photoUrl,
          mediaItemId: event.mediaItemId,
          createdAt: event.createdAt
        }));

        // Combine default events with API events and sort by year
        const allEvents = [...defaultEvents, ...convertedEvents];
        const sortedEvents = allEvents.sort((a, b) => parseInt(a.year) - parseInt(b.year));
        
        setEvents(sortedEvents);
      } else {
        console.log('Failed to fetch timeline events, using defaults');
        setEvents(defaultEvents);
      }
    } catch (error) {
      console.error('Error fetching timeline events:', error);
      setEvents(defaultEvents);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineEvents();
  }, []);

  const handleRefresh = async () => {
    await fetchTimelineEvents();
    toast({
      title: "Timeline Refreshed",
      description: "Timeline has been updated with latest photos",
    });
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-birthday-purple" />
            <p className="text-gray-600">Loading timeline...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-birthday-pink to-birthday-purple bg-clip-text text-transparent mb-4">
            Timeline des Souvenirs
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            18 années de bonheur, de croissance et de moments inoubliables
          </p>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            className="mb-8"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser la Timeline
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Ligne centrale */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-birthday-pink via-birthday-purple to-birthday-gold rounded-full"></div>

            {events.map((event, index) => (
              <div
                key={event.id}
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
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    
                    {/* Display photo if available */}
                    {event.photoUrl && (
                      <div className="mt-4">
                        <img 
                          src={event.photoUrl}
                          alt={event.title}
                          className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                          onError={(e) => {
                            // Hide image if it fails to load
                            const img = e.target as HTMLImageElement;
                            img.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Show upload timestamp for uploaded photos */}
                    {event.createdAt && (
                      <div className="mt-2 text-xs text-gray-500">
                        Ajouté le {new Date(event.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
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
