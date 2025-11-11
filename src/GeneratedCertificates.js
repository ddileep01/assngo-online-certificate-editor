import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

function GeneratedCertificates() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://assngo-online-certificate-editor-validator-server.vercel.app/certificates"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const formattedData = data.map((certificate, index) => ({
          ...certificate,
          serialNo: index + 1,
          fromDate: formatDate(certificate.fromDate),
          toDate: formatDate(certificate.toDate),
        }));
        setCertificates(formattedData);
        setFilteredCertificates(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = certificates.filter((cert) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        cert.name?.toLowerCase().includes(searchLower) ||
        cert.certId?.toLowerCase().includes(searchLower) ||
        cert.fromDate?.toLowerCase().includes(searchLower) ||
        cert.toDate?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredCertificates(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery, certificates]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCertificates = filteredCertificates.slice(startIndex, endIndex);

  // Update serial numbers for current page
  const paginatedCertificates = currentCertificates.map((cert, index) => ({
    ...cert,
    serialNo: startIndex + index + 1
  }));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleDelete = async (certificate) => {
    setCertificateToDelete(certificate);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `https://assngo-online-certificate-editor-validator-server.vercel.app/certificates/${certificateToDelete.certId}`,
        {
          method: "DELETE",
        }
      );

      if(response.ok){
        toast.success('Certificate deleted successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the certificate from the UI
      const updatedCertificates = certificates.filter(cert => cert.certId !== certificateToDelete.certId);
      setCertificates(updatedCertificates);
      setFilteredCertificates(updatedCertificates);
      setShowConfirmDialog(false);
      setCertificateToDelete(null);
    } catch (error) {
      console.error("Error deleting certificate:", error);
      setError("Error deleting certificate. Please try again later.");
      toast.error('Failed to delete certificate. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setCertificateToDelete(null);
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ToastContainer />
      
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-800">Certificate History</h1>
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

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="page-container">
          <div className="page-header">
            <h2 className="page-title">All Generated Certificates</h2>
            <div className="flex items-center">
              <button
                onClick={goToHome}
                className="button button-secondary flex items-center gap-2 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span>Create New Certificate</span>
              </button>
            </div>
          </div>

          <div className="form-container">
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search certificates by name, ID, or dates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input pl-12"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <ClipLoader size={40} color={"#2563eb"} loading={loading} />
                <span className="ml-4 text-gray-600">Loading certificates...</span>
              </div>
            ) : error ? (
              <div className="card p-6 bg-red-50 border border-red-200 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-600 font-medium">{error}</p>
                <p className="text-gray-500 mt-2">Please try again later or contact support.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Serial No</th>
                      <th>Certificate ID</th>
                      <th>Name</th>
                      <th>From Date</th>
                      <th>To Date</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCertificates.length > 0 ? (
                      paginatedCertificates.map((certificate) => (
                        <tr key={certificate.certId}>
                          <td>{certificate.serialNo}</td>
                          <td>
                            <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              {certificate.certId}
                            </span>
                          </td>
                          <td className="font-medium">{certificate.name}</td>
                          <td>{certificate.fromDate}</td>
                          <td>{certificate.toDate}</td>
                          <td>
                            <a href={`mailto:${certificate.email}`} className="text-blue-600 hover:underline">
                              {certificate.email}
                            </a>
                          </td>
                          <td>
                            <button
                              onClick={() => handleDelete(certificate)}
                              className="button button-danger button-sm flex items-center gap-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-8">
                          <div className="flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-gray-500">No certificates found matching the search criteria.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
              {filteredCertificates.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                  {/* Items per page selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="form-input py-1 px-2 text-sm"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-gray-600">entries</span>
                  </div>

                  {/* Page info */}
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredCertificates.length)} of {filteredCertificates.length} entries
                  </div>

                  {/* Pagination buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="button button-secondary button-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 text-sm rounded ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="button button-secondary button-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
              <div className="fixed inset-0 flex items-center justify-center z-50 fade-in">
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <div className="card p-8 z-10 max-w-sm w-full">
                  <h3 className="text-lg font-semibold mb-4 text-red-700">Confirm Delete</h3>
                  <p className="mb-6 text-gray-700">Are you sure you want to delete this certificate?</p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={confirmDelete}
                      className="button button-danger"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={cancelDelete}
                      className="button button-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneratedCertificates;
