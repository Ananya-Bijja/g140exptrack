import React from 'react';

const FeatureSection = () => {
  const features = [
    {
      icon: '/assets/images/emotion.png',
      title: 'Emotion-Driven Learning',
      description:
        'The educational games are continuously optimized based on the emotional feedback received during play, ensuring engagement at the right level.',
    },
    {
      icon: '/assets/images/supporting.png',
      title: 'Supporting Dyslexic Children',
      description:
        'We provide tools that improve learning experiences and emotional engagement, making learning both effective and enjoyable.',
    },
    {
      icon: '/assets/images/computer.png',
      title: 'Optimized Game Design',
      description:
        'Our games are optimized based on emotional feedback, ensuring a challenging and personalized learning experience.',
    },
  ];

  return (
    <div className="container px-4 py-5" id="featured-3">
      <h2 className="pb-2 border-bottom">Why Choose Learn&Smile?</h2>
      <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
        {features.map((feature, index) => (
          <div className="feature col" key={index}>
            <div className="feature-icon d-inline-flex align-items-center justify-content-center bg-light">
              <img src={feature.icon} alt={feature.title} height="30" />
            </div>
            <h3 className="fs-2">{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
// bs-dark-bg-subtle