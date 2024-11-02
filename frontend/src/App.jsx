import React from "react";
import Header from "./components/layouts/Header";
import Homepage from "./components/Homepage";
import { Footer } from "./components/layouts/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import "./App.css"; 

function App() {
  return (
    <Router>
        <Header />
        <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Homepage />} />
            </Routes>
        </div>
        <Footer />
    </Router>
  );
}

export default App;
