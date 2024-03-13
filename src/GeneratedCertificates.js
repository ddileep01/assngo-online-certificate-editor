import React, { useState, useEffect } from "react";

function GeneratedCertificates() {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://good-jade-dhole-robe.cyclic.app/certificates"
        );
        const data = await response.json();
        // Format date strings
        const formattedData = data.map((certificate) => ({
          ...certificate,
          fromDate: formatDate(certificate.fromDate),
          toDate: formatDate(certificate.toDate),
        }));
        setCertificates(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Get only the date part
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8">Generated Certificates</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
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
            {certificates.map((certificate, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
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
  );
}

export default GeneratedCertificates;
