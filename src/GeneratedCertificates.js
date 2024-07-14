import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners"; // Importing ClipLoader from react-spinners

function GeneratedCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://assngo-online-certificate-editor-validator-server-2fy21fqmv.vercel.app/certificates"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Format date strings
        const formattedData = data.map((certificate, index) => ({
          ...certificate,
          serialNo: index + 1,
          fromDate: formatDate(certificate.fromDate),
          toDate: formatDate(certificate.toDate),
        }));
        setCertificates(formattedData);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again later.");
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Example: "7/14/2024"
  };

  return (
    <div className="container mx-auto px-4 py-8 font-figtree">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold">Generated Certificates</h1>
        <Link to="/" className="text-blue-500 hover:underline">
          Back
        </Link>
      </div>
      {loading ? ( // Conditional rendering of loader
        <div className="flex justify-center items-center h-screen">
          <ClipLoader size={40} color={"#123abc"} loading={loading} />{" "}
          {/* Using ClipLoader */}
          <span className="ml-4">Loading...</span> {/* Text beside loader */}
        </div>
      ) : error ? (
        <div className="text-red-500 flex justify-center items-center h-screen">{error}</div>
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
              </tr>
            </thead>
            <tbody>
              {certificates.map((certificate) => (
                <tr
                  key={certificate.certId}
                  className={
                    certificate.serialNo % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GeneratedCertificates;
