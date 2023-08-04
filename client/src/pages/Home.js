import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-page">
            <Link to="/search-cards" className="home-button">Sign Up or Login to Find Your Calm!</Link>
       </div>
    );
}

export default Home;
