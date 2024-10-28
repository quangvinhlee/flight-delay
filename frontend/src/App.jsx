import React from "react";
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
              <Route path="/" element={<Homepage />} />
            </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
