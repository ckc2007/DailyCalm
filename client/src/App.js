import React from "react";
import { Routes, Route } from "react-router-dom";
import SearchCards from "./pages/SearchCards";
import SavedCards from "./pages/SavedCards";
import PlayPage from "./pages/PlayPage"; // Import PlayPage
import Navbar from "./components/Navbar";
import 'bulma/css/bulma.min.css';

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

// old:
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
