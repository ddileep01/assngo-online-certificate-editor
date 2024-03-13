import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import ValidatePage from "./validate";
import GeneratedCertificates from "./GeneratedCertificates";
import Home from "./home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/validate" element={<ValidatePage />} />
        <Route
          path="/allGeneratedCertifiactes"
          element={<GeneratedCertificates />}
        />
      </Routes>
    </Router>
  );
}

export default App;
