import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
// import Carousel from './Carousel';
import Footer from './Footer';

const Home = () => {
  const homeStyle = {
    backgroundImage: `url('/assets/images/background.jpg')`,
    backgroundSize: 'cover', // Makes sure the image covers the entire viewport
    backgroundPosition: 'center', // Center the image
    backgroundRepeat: 'no-repeat', // Prevent image repetition
    minHeight: '100vh', // Make sure it covers the full height of the viewport
  };
  return (
    // <>
    //   <Navbar />
    //   <HeroSection />
    //   <FeatureSection />
      
    //   <Footer />
    // </>
    <div style={homeStyle}>
    <Navbar />
    <HeroSection />
    <FeatureSection />
    <Footer />
  </div>
  );
};

export default Home;
