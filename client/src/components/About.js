
import React from 'react';
import '../styles/About.css'; 

const About = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <h1>About Learn&Smile</h1>
        <p>Empowering Learning Through Educational Games</p>
      </section>

      {/* Introduction Section */}
      <section className="about-intro">
        <h2>Who We Are</h2>
        <p>
          JoyWithLearning is dedicated to developing innovative educational tools that support children with learning differences, especially dyslexic learners. Our mission is to create a system that analyzes emotional responses during educational gameplay, helping us optimize game design for better learning experiences.
        </p>
      </section>

      {/* Mission & Vision Section */}
      <section className="about-mission-vision">
        <h2>Our Mission</h2>
        <p>
          To empower dyslexic children by providing engaging, emotion-aware educational games that enhance their learning experience and emotional well-being.
        </p>
        <h2>Our Vision</h2>
        <p>
          A world where every child, regardless of their learning challenges, thrives through personalized and emotionally supportive educational tools.
        </p>
      </section>

      

      {/* How It Works Section */}
      <section className="about-how-it-works">
        <h2>How It Works</h2>
        <p>
          Our system captures images of children while they play educational games designed for dyslexic learners. Using cutting-edge computer vision algorithms, we analyze their facial expressions in real-time to understand their emotional responses. This data is then used to adapt and improve the game elements, ensuring a positive and effective learning experience tailored to each child’s needs.
        </p>
      </section>

      
    </div>
  );
};

export default About;
