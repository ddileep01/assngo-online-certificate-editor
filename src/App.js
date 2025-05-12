import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ValidatePage from "./validate"; 
import CertificateView from "./certificateview";
import GeneratedCertificates from "./GeneratedCertificates";
import Home from "./home";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./components/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="fade-in"
        />
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
          {/* 404 page - this must be the last route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
