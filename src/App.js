import React, { useState } from "react";

function App() {
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
        const response = await fetch("https://good-jade-dhole-robe.cyclic.app/certificates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const data = await response.json();
          setGeneratedCertificate(formData);
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
    <div className="h-screen flex flex-col justify-center items-center bg-cover bg-center">
      {/* Banner */}
      <div
        className="w-full h-1/3 flex justify-center items-center text-center text-black bg-cover bg-center"
        style={{
          backgroundImage: `url("https://res.cloudinary.com/dryli2l24/image/upload/v1708189605/header_img_aizbk2.png")`,
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
            <label htmlFor="name" className="block">
              Name of the certificate:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full border border-gray-400 rounded-md p-2"
              value={formData.name}
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
            <label htmlFor="email" className="block">
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full border border-gray-400 rounded-md p-2"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Generate Certificate
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
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4">
              Download to Local
            </button>
            <p className="text-black text-center ml-2 mr-2 px-4 py-2">or</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Send Emails
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
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
