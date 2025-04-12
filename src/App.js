import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ValidatePage from "./validate"; 
import CertificateView from "./certificateview";
import GeneratedCertificates from "./GeneratedCertificates";
import Home from "./home";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/validate" element={<ValidatePage />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/certificateview" 
            element={
              <PrivateRoute>
                <CertificateView />
              </PrivateRoute>
            } 
          />
          <Route
            path="/allGeneratedCertifiactes"
            element={
              <PrivateRoute>
                <GeneratedCertificates />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
