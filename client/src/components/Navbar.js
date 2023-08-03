import React, { useState } from "react";
import { Link } from "react-router-dom";
import SignUpForm from "./SignupForm";
import LoginForm from "./LoginForm";
import { authService } from "../utils/auth";

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <nav className="navbar has-background-info" role="navigation" aria-label="main navigation">
        <div className="container">
          <div className="navbar-item button hover is-success is-medium is-rounded">
            <Link to="/" className="navbar-item button hover is-success is-medium is-rounded">
              Calms Search
            </Link>
            <button className="navbar-burger" aria-label="menu" aria-expanded="false" onClick={() => setShowModal(true)}>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </button>
          </div>
          <div className="navbar-menu ">
            <div className="navbar-end">
              <Link to="/" className="navbar-item button hover is-success is-medium is-rounded">Search For Calms</Link>
              {authService.loggedIn() ? (
                <>
                  <Link to="/saved" className="navbar-item button hover is-success is-medium is-rounded">See Your Calms</Link>
                  <Link to="/play" className="navbar-item button hover is-success is-medium is-rounded">Play</Link>
                  <button className="navbar-item button hover is-success is-medium is-rounded" onClick={authService.logout}>Logout</button>
                </>
              ) : (
                <button className="navbar button hover is-success is-medium is-rounded" onClick={() => setShowModal(true)}>Login/Sign Up</button>

              )}
            </div>
          </div>
        </div>
      </nav>

      <div className={`modal ${showModal ? "is-active" : ""}`}>
        <div className="modal-background" onClick={() => setShowModal(false)}></div>
        <div className="modal-content">
          <div className="tabs">
            <ul>
              <li className="is-active">
                <a onClick={() => setShowModal(false)}>Login</a>
              </li>
              <li>
                <a onClick={() => setShowModal(false)}>Sign Up</a>
              </li>
            </ul>
          </div>
          <div className="tabs-content">
            <div className="tab-pane is-active">
              <LoginForm handleModalClose={() => setShowModal(false)} />
            </div>
            <div className="tab-pane">
              <SignUpForm handleModalClose={() => setShowModal(false)} />
            </div>
          </div>
        </div>
        <button className="modal-close is-large" aria-label="close" onClick={() => setShowModal(false)}></button>
      </div>
    </>
  );
};

export default AppNavbar;
