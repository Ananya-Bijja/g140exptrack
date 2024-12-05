import React from 'react';

const Carousel = () => {
  return (
    <div className="container">
      <div id="carouselExampleIndicators" className="carousel slide">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/assets/images/couple.jpg" className="d-block w-100" alt="couple" />
          </div>
          <div className="carousel-item">
            <img src="/assets/images/dog.jpg" className="d-block w-100" alt="dog" />
          </div>
          <div className="carousel-item">
            <img src="/assets/images/family.jpg" className="d-block w-100" alt="family" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
