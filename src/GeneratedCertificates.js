import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

function GeneratedCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCertificates, setFilteredCertificates] = useState([]);

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
  }, [searchQuery, certificates]);

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
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setCertificateToDelete(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 font-figtree">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold">Generated Certificates</h1>
        <Link to="/" className="text-blue-500 hover:underline">
          Back
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search certificates by name, ID, or dates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader size={40} color={"#123abc"} loading={loading} />
          <span className="ml-4">Loading...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 flex justify-center items-center h-screen">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificate ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCertificates.map((certificate) => (
                <tr
                  key={certificate.certId}
                  className={certificate.serialNo % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {certificate.serialNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {certificate.certId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {certificate.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {certificate.fromDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {certificate.toDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {certificate.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(certificate)}
                      className="text-red-600 hover:text-red-900 flex items-center"
                    >
                      <span><svg xmlns="http://www.w3.org/2000/svg" height="12" width="10.5" viewBox="0 0 448 512"><path fill="#DC2626" d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></span>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this certificate?</p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeneratedCertificates;
