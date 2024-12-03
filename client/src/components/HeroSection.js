import React from 'react';

const HeroSection = () => {
  return (
    <div className="px-4 pt-5 my-5 text-center border-bottom">
      <h1 className="display-4 fw-bold text-body-emphasis">Learn&Smile</h1>
      <div className="col-lg-6 mx-auto">
        <p className="lead mb-4">
          Welcome to Learn&Smile, where we are on a mission to transform the way dyslexic children experience education.
          As innovators in educational technology, we believe that learning should be joyful, personalized, and
          emotionally supportive.
        </p>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
          <a href="/login" className="btn btn-primary btn-lg px-4 me-sm-3">
            Login
          </a>
          <a href="/signup" className="btn btn-outline-secondary btn-lg px-4">
            Signup
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
