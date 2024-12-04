import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
// import Carousel from './Carousel';
import Footer from './Footer';
// import { backgroundClip } from 'html2canvas/dist/types/css/property-descriptors/background-clip';
// import { backgroundImage } from 'html2canvas/dist/types/css/property-descriptors/background-image';

const Home = () => {
  const homeStyle = {
    backgroundImage: `url('/assets/images/home_background.png')`,
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




// import React from 'react';
// import Navbar from './Navbar';
// import HeroSection from './HeroSection';
// import FeatureSection from './FeatureSection';
// import Footer from './Footer';

// const Home = () => {
//   return (
//     <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
//       {/* Background Video */}
//       <video
//         autoPlay
//         loop
//         muted
//         playsInline
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           objectFit: 'cover',
//           zIndex: -1,
//         }}
//       >
//         <source src="/assets/images/home_background.mp4" type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>

//       {/* Page Content */}
//       <div style={{ position: 'relative', zIndex: 1 }}>
//         <Navbar />
//         <HeroSection />
//         <FeatureSection />
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default Home;
