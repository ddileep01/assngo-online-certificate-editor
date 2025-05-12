import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import "./App.css";

const ValidatePage = () => {
  const navigate = useNavigate();
  const [certificateInfo, setCertificateInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false); // State to track loading status

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const validateCertificate = async () => {
    // Check if the certificate ID field is empty
    if (!id || id.trim() === '') {
      setErrorMessage("Please enter a Certificate ID.");
      setCertificateInfo(null);
      return; // Stop execution if the field is empty
    }
    
    setLoading(true); // Set loading to true when validation starts
    try {
      const response = await fetch(
        "https://assngo-online-certificate-editor-validator-server.vercel.app/certificates"
      );
      const data = await response.json();
      const certificate = data.find((cert) => cert.certId === id);

      if (certificate) {
        setCertificateInfo(certificate);
        setErrorMessage(null);
      } else {
        setErrorMessage("No valid certificate found for the given ID.");
        setCertificateInfo(null);
      }
    } catch (error) {
      setErrorMessage("Error validating certificate.");
      setCertificateInfo(null);
    } finally {
      setLoading(false); // Set loading to false after validation
    }

    // Reset the input box after validation only if successful
    if (certificateInfo) {
      setId("");
    }
  };

  const handleInputChange = (event) => {
    setId(event.target.value);
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-800">Certificate Validation</h1>
            </div>
            <button 
              onClick={goToHome}
              className="button button-secondary flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>Return Home</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="form-container">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Verify Certificate Authenticity</h2>
            <p className="text-gray-600 mt-2">Enter the Certificate ID to validate its authenticity</p>
          </div>
          
          <div className="form-group">
            <label
              htmlFor="certificateId"
              className="form-label"
            >
              Certificate ID
            </label>
            <input
              type="text"
              id="certificateId"
              value={id}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g. 3619cc3c-dc48-47f3-8bb2-f4227c4c5a41"
              required
            />
          </div>
          
          <div className="mt-6">
            <button
              onClick={validateCertificate}
              className="button button-primary w-full flex justify-center items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} color={"#fff"} loading={loading} />
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Validate Certificate</span>
                </>
              )}
            </button>
          </div>
          
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md fade-in">
              <p className="text-sm text-red-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {errorMessage}
              </p>
            </div>
          )}
          
          {certificateInfo && (
            <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-lg card fade-in">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-semibold text-green-800">Valid Certificate</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-500">Recipient</p>
                  <p className="font-medium">{certificateInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Certificate ID</p>
                  <p className="font-medium">{certificateInfo.certId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">From Date</p>
                  <p className="font-medium">{formatDate(certificateInfo.fromDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">To Date</p>
                  <p className="font-medium">{formatDate(certificateInfo.toDate)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidatePage;
