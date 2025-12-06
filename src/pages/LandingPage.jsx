import React from 'react';
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import FeaturesSection from '../sections/FeaturesSection';
import LiveSnapshotSection from '../sections/LiveSnapshotSection';
import NgoSignupSection from '../sections/NgoSignupSection';
import ContactSection from '../sections/ContactSection';
import Fireflies from '../components/background/Fireflies';
import BackgroundVideo from '../components/background/BackgroundVideo';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-50">
      <div className="bg-gradient-mesh" />
      <BackgroundVideo />
      <Fireflies />

      <main className="relative mx-auto flex max-w-7xl flex-col gap-28 px-4 pb-0 pt-28 md:px-6 lg:px-8">
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <LiveSnapshotSection />
        <NgoSignupSection />
        <ContactSection />
      </main>
    </div>
  );
};

export default LandingPage;
