import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function App() {
  const [formData, setFormData] = useState({
    certificateName: "",
    fromDate: "",
    toDate: "",
    emailAddress: "",
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
  const handleSubmit = (e) => {
    e.preventDefault();
    const isEmpty = Object.values(formData).some((value) => value === "");
    if (!isEmpty) {
      setGeneratedCertificate(formData);
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-cover bg-center">
      {/* Banner */}
      <div
        className="w-full h-1/3 flex justify-center items-center text-center text-black bg-cover bg-center"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dryli2l24/image/upload/v1708189605/header_img_aizbk2.png')`,
        }}
      ></div>

      {/* Form and Certificate */}
      <div className="w-full mt-16 px-4 sm:flex sm:justify-between sm:items-start">
        {/* Form */}
        <form
          className="w-full sm:w-1/4 sm:ml-16 mb-8 sm:mb-0"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label htmlFor="certificateName" className="block">
              Name of the certificate:
            </label>
            <input
              type="text"
              id="certificateName"
              name="certificateName"
              className="w-full border border-gray-400 rounded-md p-2"
              value={formData.certificateName}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="fromDate" className="block">
              From Date:
            </label>
            <input
              type="date"
              id="fromDate"
              name="fromDate"
              className="w-full border border-gray-400 rounded-md p-2"
              value={formData.fromDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="toDate" className="block">
              To Date:
            </label>
            <input
              type="date"
              id="toDate"
              name="toDate"
              className="w-full border border-gray-400 rounded-md p-2"
              value={formData.toDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="emailAddress" className="block">
              Email Address:
            </label>
            <input
              type="email"
              id="emailAddress"
              name="emailAddress"
              className="w-full border border-gray-400 rounded-md p-2"
              value={formData.emailAddress}
              onChange={handleInputChange}
            />
          </div>
          <button className="bg-[#21403A] text-white px-4 py-2 flex items-center">
            Generate Certificate
            <span className="ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="10"
                width="8.75"
                viewBox="0 0 448 512"
              >
                <path
                  fill="#ffffff"
                  d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                />
              </svg>
            </span>
          </button>
          {/* Horizontal Line for Small Devices */}
          <hr className="border-t border-gray-400 my-4 w-full block sm:hidden" />
        </form>

        {/* Vertical Line for Medium and Large Devices */}
        <hr className="border-l border-gray-400 my-4 h-4/5 hidden sm:block" />

        {/* Certificate */}
        <div className="w-full sm:w-1/2 flex flex-col items-center justify-center">
          <img
            src="https://res.cloudinary.com/dryli2l24/image/upload/v1708190262/ASS_Certificate_with_stamp_nd_signs_1_sz8fke.png"
            alt="Certificate"
            className="w-4/5 mb-4"
          />
          <div className="flex justify-center mt-4">
            <button className="bg-[#21403A] text-white px-4 py-2 mr-4 flex items-center">
              Download to Local
              <span className="ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="10"
                  width="10"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#ffffff"
                    d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"
                  />
                </svg>
              </span>
            </button>
            <p className="text-black text-center ml-2 mr-2 px-4 py-2">or</p>
            <button className="bg-[#21403A] text-white px-4 py-2">
              Send Email
            </button>
          </div>
        </div>
      </div>
      {generatedCertificate && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">
            Generated Certificate:
          </h2>
          <ul>
            <li>
              <strong>Name of the certificate:</strong>{" "}
              {generatedCertificate.certificateName}
            </li>
            <li>
              <strong>From Date:</strong> {generatedCertificate.fromDate}
            </li>
            <li>
              <strong>To Date:</strong> {generatedCertificate.toDate}
            </li>
            <li>
              <strong>Email Address:</strong>{" "}
              {generatedCertificate.emailAddress}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
