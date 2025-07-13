
import React from 'react';
import Header from '../components/Header';
import PhotoGallery from '../components/PhotoGallery';
import WishesSection from '../components/WishesSection';
import Timeline from '../components/Timeline';
import Footer from '../components/Footer';
import Confetti from '../components/Confetti';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Confetti />
      <Header />
      <PhotoGallery />
      <Timeline />
      <WishesSection />
      <Footer />
    </div>
  );
};

export default Index;
