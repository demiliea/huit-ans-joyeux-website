
import React, { useState } from 'react';
import Header from '../components/Header';
import PhotoGallery from '../components/PhotoGallery';
import PhotoUpload from '../components/PhotoUpload';
import WishesSection from '../components/WishesSection';
import Timeline from '../components/Timeline';
import Footer from '../components/Footer';
import Confetti from '../components/Confetti';

const Index = () => {
  const [refreshTimeline, setRefreshTimeline] = useState(0);

  const handleUploadSuccess = (photo: any) => {
    console.log('Photo uploaded successfully:', photo);
    // Trigger timeline refresh by updating the key
    setRefreshTimeline(prev => prev + 1);
  };

  return (
    <div className="min-h-screen">
      <Confetti />
      <Header />
      <PhotoGallery />
      
      {/* Add PhotoUpload component */}
      <section className="py-20 bg-gradient-to-br from-birthday-pink/10 to-birthday-purple/10">
        <div className="container mx-auto px-6">
          <PhotoUpload onUploadSuccess={handleUploadSuccess} />
        </div>
      </section>
      
      <Timeline key={refreshTimeline} />
      <WishesSection />
      <Footer />
    </div>
  );
};

export default Index;
