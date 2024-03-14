import React, { useState, useRef } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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

  const pdfRef = useRef(null);

  const downloadPDF = () => {
    const input = pdfRef.current;

    html2canvas(input)
      .then((canvas) => {
        console.log("Canvas generated:", canvas);
        const imgData = canvas.toDataURL('image/png');
        console.log("Image Data:", imgData);
        const pdf = new jsPDF();
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('content.pdf');
        console.log("PDF saved successfully.");
      })
      .catch(error => {
        console.error("Error generating PDF:", error);
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
                <div ref={pdfRef}>
                  <div className="certificate-bg-img">
                    <p className="name-text-overlay">
                      {generatedCertificate.name}
                    </p>
                    <p className="fromdate-text-overlay">
                      {generatedCertificate.fromDate}
                    </p>
                    <p className="todate-text-overlay">
                      {generatedCertificate.toDate}
                    </p>
                    <p className="certid-text-overlay">
                      <a href="https://akhanda-seva-samsthan.vercel.app/validate">{generatedCertificate.certId}</a>
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex flex-col items-center">
                  <button className="bg-green-950 hover:bg-green-900 text-white px-4 py-2 w-64">
                    Download To Local ⬇
                  </button>
                  <p className="text-black text-center ml-2 mr-2 px-4 py-2">
                    _______________or_______________
                  </p>
                  <button onClick={downloadPDF} className="bg-green-950 hover:bg-green-900 text-white px-4 py-2 w-64 mt-2 mb-2">
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
