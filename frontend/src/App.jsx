import React from "react";
import PredictionTable from "./components/PredictionTable"; 
import About from "./components/About";
import Header from "./components/Header";
import Homepage from "./components/Homepage";
import { Footer } from "./components/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import "./App.css"; 

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow">
            <Routes>
              <Route path="/predict" element={<PredictionTable />} />
              <Route path="/About" element={<About />} />
              <Route path="/" element={<Homepage />} />
            </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
