import React from "react";
import { Routes, Route } from "react-router-dom";
import SearchCards from "./pages/SearchCards";
import SavedCards from "./pages/SavedCards";
import PlayPage from "./pages/PlayPage";
import Navbar from "./components/Navbar";
import "bulma/css/bulma.min.css";

// import logo from './logo.svg';
// import './App.css';

// new:
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<SearchCards />} />
        <Route path="/saved" element={<SavedCards />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="*" element={<h1 className="display-2">Wrong page!</h1>} />
      </Routes>
    </>
  );
}

export default App;
