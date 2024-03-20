import React, { useState, useRef } from "react";
import html2pdf from 'html2pdf.js';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
} from "react-router-dom";
import './certificate.css';

function Home() {
  
  // code to convert certificate into pdf


const handleDownloadPDF = async () => {
  const element = document.getElementById('download-pdf');
  if (!element) {
    console.error('Element not found');
    return;
  }

  const opt = {
    margin: 1,
    filename: 'downloaded.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  };

  // Generate PDF
  html2pdf().set(opt).from(element).toPdf().get('pdf').then(function (pdf) {
    var totalPages = pdf.internal.getNumberOfPages();

    for (var i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      // Add footer or any additional content here
    }
  }).save().catch((error) => {
    console.error('Failed to generate PDF', error);
  });
};


  // end of pdf conversion code

  const navigate = useNavigate();
  function goToValidate() {
    navigate("/validate");
  }
  function goToGenCertificate() {
    navigate("/allGeneratedCertifiactes");
  }
  const [formData, setFormData] = useState({
    name: "",
    fromDate: "",
    toDate: "",
    email: "",
  });

  const [generatedCertificate, setGeneratedCertificate] = useState(null);

  // Function to handle input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEmpty = Object.values(formData).some((value) => value === "");
    if (!isEmpty) {
      try {
        const response = await fetch(
          "https://good-jade-dhole-robe.cyclic.app/certificates",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setGeneratedCertificate({
            ...formData,
            certId: data.certId, // Assuming certId is returned from backend
          });
          // Optionally, you can clear the form data here
          setFormData({
            name: "",
            fromDate: "",
            toDate: "",
            email: "",
          });
        } else {
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
    <>
      <div className="h-screen bg-cover bg-center">
        {/* Banner */}
        <div
          className="w-full h-1/3 text-center text-black bg-cover bg-center"
          style={{
            backgroundImage: `url("https://res.cloudinary.com/dryli2l24/image/upload/v1708189605/header_img_aizbk2.png")`,
          }}
        ></div>

        {/* Form and Certificate */}
        <div className="flex flex-col items-center w-full mt-16 px-4">
          {/* Form */}
          <form
            className="w-full sm:w-1/4 sm:ml-16 mb-8 sm:mb-0"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <label htmlFor="name" className="block">
                Enter Name Of The Certificant
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full border border-gray-400 rounded-md p-2"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="fromDate" className="block">
                From Date
              </label>
              <input
                type="date"
                id="fromDate"
                name="fromDate"
                className="w-full border border-gray-400 rounded-md p-2"
                value={formData.fromDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="toDate" className="block">
                To Date
              </label>
              <input
                type="date"
                id="toDate"
                name="toDate"
                className="w-full border border-gray-400 rounded-md p-2"
                value={formData.toDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block">
                Enter Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full border border-gray-400 rounded-md p-2"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <button className="bg-green-950 hover:bg-green-900 text-white px-4 py-2 w-full">
              Generate Certificate 🡢
            </button>
            {/* Horizontal Line for Small Devices */}
            {/* <hr className="border-t border-gray-400 my-4 w-full block sm:hidden" /> */}
          </form>
          <div>
            <button
              onClick={() => goToValidate()}
              className="bg-green-950 hover:bg-green-900 text-white ml-4 px-4 py-2"
            >
              Validate Certificate ✔️
            </button>

            <button
              onClick={() => goToGenCertificate()}
              className="bg-green-950 hover:bg-green-900 text-white ml-4  mt-8 px-4 py-2"
            >
              History ↺
            </button>
          </div>

          {/* Vertical Line for Medium and Large Devices */}
          {/* <hr className="border-l border-gray-400 my-4 h-4/5 hidden sm:block" /> */}

          {/* Certificate */}
          {generatedCertificate && (
            <div className="w-full sm:w-1/2">
              <div id="download-pdf">
                <div className="certificate-container">
                  <div className="header">
                    <h1 className="title">AKHANDA SEVA SAMSTHAN</h1>
                    <p className="subtitle">NON-GOVERNMENT ORGANIZATION</p>
                    <p className="registration">
                      (REGISTERED BY GOV OF AP REGISTER NO:1/2021)
                    </p>
                  </div>

                  <div className="body">
                    <h2 className="body-title">CERTIFICATE OF APPRECIATION</h2>
                    <p className="content">
                      With a deep sense of gratitude, we would like to extend
                      the highest appreciation, on behalf of AKHANDA SEVA
                      SAMSTHAN to
                    </p>
                    <p className="name font-bold"><u>{generatedCertificate.name}</u></p>
                    <p className="content">
                      For dedicating his/her selfless service from {generatedCertificate.fromDate}{" "}
                      to {generatedCertificate.toDate}
                      <br />
                      towards the organization through thick and thin.
                    </p>
                    <p className="content">
                      Please accept this token of gratitude for your remarkable
                      efforts.
                    </p>
                  </div>

                  <div className="footer">
                    <div className="official">
                      <p className="official-title">A SEVA SAMSTHAN</p>
                      <p className="official-name">k. Gummidy</p>
                    </div>
                    <div className="official">
                      <p className="official-title">PRESIDENT</p>
                      <p className="official-name">Kolusu Gowri Naidu</p>
                      <p className="official-id">Read. No. 01/2021</p>
                    </div>
                    <div className="official">
                      <p className="official-title">VICE-PRESIDENT</p>
                      <p className="official-name">Rayapureddy Dayakar</p>
                    </div>
                  </div>

                  <div className="contact">
                    <p>akhandasevasamsthan.ass@gmail.com</p>
                    <p>CERTIFICATE ID: {generatedCertificate.certId}</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex flex-col items-center">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="bg-green-950 hover:bg-green-900 text-white px-4 py-2 w-64"
                >
                  Download To Local ⬇
                </button>
                <p className="text-black text-center ml-2 mr-2 px-4 py-2">
                  _______________or_______________
                </p>
                <button
                  type="button"
                  className="bg-green-950 hover:bg-green-900 text-white px-4 py-2 w-64 mt-2 mb-2"
                >
                  Send Email ✉
                </button>
              </div>
            </div>
          )}
        </div>
        {/* {generatedCertificate && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-2">
              Generated Certificate:
            </h2>
            <ul>
              <li>
                <strong>Name of the certificate:</strong>{" "}
                {generatedCertificate.name}
              </li>
              <li>
                <strong>From Date:</strong> {generatedCertificate.fromDate}
              </li>
              <li>
                <strong>To Date:</strong> {generatedCertificate.toDate}
              </li>
              <li>
                <strong>Email Address:</strong> {generatedCertificate.email}
              </li>
              <li>
                <strong>Certificate ID:</strong> {generatedCertificate.certId}
              </li>
            </ul>
          </div>
        )} */}
      </div>
    </>
  );
}

export default Home;
