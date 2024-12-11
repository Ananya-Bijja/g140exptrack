import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
import Footer from './Footer';


const Home = () => {
  const homeStyle = {
    backgroundImage: `url('/assets/images/home_background.png')`,
    backgroundSize: 'cover', 
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat', 
    minHeight: '100vh',
  };
  return (
    <div style={homeStyle}>
    <Navbar />
    <HeroSection />
    <FeatureSection />
    <Footer />
  </div>
  );
};

export default Home;




