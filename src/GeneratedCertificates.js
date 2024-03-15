import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function GeneratedCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://good-jade-dhole-robe.cyclic.app/certificates"
        );
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
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {loading ? ( // Conditional rendering of loader
        <button
          type="button"
          className="bg-indigo-500 flex justify-center items-center px-4 py-2 rounded-md text-white cursor-not-allowed"
          disabled
        >
          <svg
            className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-indigo-300 rounded-full"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0120 12h-4a3.999 3.999 0 00-3.928-3.995L12 5.062v7.45zm8-1.34A8.045 8.045 0 0117.708 17H20c0-3.045-1.115-5.821-2.958-7.938l-1.083 1.914zM4 12h4a4 4 0 003.861 3.995L9.073 12H4v.119zm8 7.88V14.57L8.958 16.48A8.045 8.045 0 017 17h5zm3.937-9.939L14 7.43v-7.43H9.073l1.887 3.324A4 4 0 0012 9.883V10z"
            ></path>
          </svg>
          <span>Processing...</span>
        </button>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-semibold">Generated Certificates</h1>
            <Link to="/" className="text-blue-500 hover:underline">
              Back
            </Link>
          </div>
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
        </div>
      )}
    </div>
  );
}

export default GeneratedCertificates;
