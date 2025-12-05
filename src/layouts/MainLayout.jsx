import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 px-4 pb-12 pt-20 md:px-8 lg:px-16">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
