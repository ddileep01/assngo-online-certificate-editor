import React, { useState } from "react";
import { Analytics } from "@vercel/analytics/react"
import {
  useNavigate,
} from "react-router-dom";
import { ClipLoader } from "react-spinners";
import "./certificate.css";
import "./App.css";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  //navigating to validate page
  function goToValidate() {
    navigate("/validate");
  }
  //navigating to certificate generation page
  function goToGenCertificate() {
    navigate("/allGeneratedCertifiactes");
  }
  
  // Function to handle logout
  function handleLogout() {
    // This would typically clear authentication state
    navigate("/login");
  }
  
  const [formData, setFormData] = useState({
    name: "",
    fromDate: "",
    toDate: "",
    email: "",
  });


  // Function to handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "name") {
      // Capitalize the input certificant name
      updatedValue = value.toUpperCase();
    }
    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEmpty = Object.values(formData).some((value) => value === "");
    if (!isEmpty) {
      setLoading(true);
      try {
        const response = await fetch(
          "https://assngo-online-certificate-editor-validator-server.vercel.app/certificates",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        if (response.ok) {
          setLoading(false);
          const data = await response.json();
          navigate("/certificateview", {
            state: { datas: formData, certId: data.certId },
          });
          setFormData({
            name: "",
            fromDate: "",
            toDate: "",
            email: "",
          });
        } else {
          setLoading(false);
          throw new Error("Failed to add certificate");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-figtree">
      {/* Header with Navigation */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-800">ASS Certificate Portal</h1>
            </div>
            <nav className="flex space-x-4">
              <button 
                onClick={() => goToValidate()} 
                className="text-gray-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Validate Certificate
              </button>
              <button 
                onClick={() => goToGenCertificate()} 
                className="text-gray-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Certificate History
              </button>
              <button 
                onClick={handleLogout} 
                className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="w-full bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="w-full h-32 md:h-64 bg-center bg-contain bg-no-repeat rounded-lg shadow-lg"
            style={{
              backgroundImage: `url("https://res.cloudinary.com/dryli2l24/image/upload/v1708189605/header_img_aizbk2.png")`,
            }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="page-container">
          <div className="page-header">
            <h2 className="page-title">Generate Certificate</h2>
          </div>

          {/* Certificate Form */}
          <div className="form-container">
            <div className="form-row">
              <div className="form-col">
                <label htmlFor="name" className="form-label">
                  Name of the Certificant
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="form-col">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label htmlFor="fromDate" className="form-label">
                  From Date
                </label>
                <input
                  type="date"
                  id="fromDate"
                  name="fromDate"
                  className="form-input"
                  value={formData.fromDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-col">
                <label htmlFor="toDate" className="form-label">
                  To Date
                </label>
                <input
                  type="date"
                  id="toDate"
                  name="toDate"
                  className="form-input"
                  value={formData.toDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="button-group">
              <button
                className="button button-primary flex items-center gap-2"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader size={16} color={"#ffffff"} loading={loading} />
                ) : (
                  <>
                    <span>Generate Certificate</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
              <button
                onClick={() => goToValidate()}
                className="button button-success flex items-center gap-2"
              >
                <span>Validate Certificate</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => goToGenCertificate()}
                className="button button-secondary flex items-center gap-2"
              >
                <span>View History</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {loading && (
            <div className="flex justify-center items-center mt-8">
              <ClipLoader size={40} color={"#123abc"} loading={loading} />
              <span className="ml-4">Generating certificate...</span>
            </div>
          )}
        </div>
      </main>
      <Analytics/>
    </div>
  );
}

export default Home;
