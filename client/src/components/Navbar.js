import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FeedbackModal from './FeedbackModal'; 

const Navbar = () => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand face">
            <img src="/assets/images/icon.png" alt="Learn&Smile Brand Icon" height="23" width="23" /> Learn&Smile
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/About">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <a
                  href="#"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault(); 
                    setShowFeedbackModal(true); 
                  }}
                >
                  Feedback
                </a>
              </li>
            </ul>
            <form className="d-flex">
              <Link to="/login" className="btn btn-outline-success me-2">
                Login
              </Link>
              <Link to="/signup" className="btn btn-outline-success me-2">
                Signup
              </Link>
            </form>
          </div>
        </div>
      </nav>
      {showFeedbackModal && <FeedbackModal onClose={() => setShowFeedbackModal(false)} />}
    </>
  );
};

export default Navbar;
