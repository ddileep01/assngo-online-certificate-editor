import React, { useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
} from "react-router-dom";
import { ClipLoader } from "react-spinners";
import "./certificate.css";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  //navigating to validate page
  function goToValidate() {
    navigate("/validate");
  }
  //navigating to certificate generation page
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
    console.log("e", e.target.value)
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "name") {
      // Capitalize the input certificant name
      updatedValue = value.toUpperCase();
    }
    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEmpty = Object.values(formData).some((value) => value === "");
    if (!isEmpty) {
      setLoading(true);
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
          setLoading(false);
          const data = await response.json();
          // setGeneratedCertificate({
          //   ...formData,
          //   certId: data.certId, // Assuming certId is returned from backend
          // });
          // Optionally, you can clear the form data here
          navigate("/certificateview", {
            state: { datas: formData, certId: data.certId },
          });
          setFormData({
            name: "",
            fromDate: "",
            toDate: "",
            email: "",
          });
        } else {
          setLoading(false);
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
          className="w-full h-16 md:h-1/3 text-center text-black md:bg-cover md:bg-center bg-top bg-contain bg-no-repeat"
          style={{
            backgroundImage: `url("https://res.cloudinary.com/dryli2l24/image/upload/v1708189605/header_img_aizbk2.png")`,
          }}
        ></div>

        {/* Form and Certificate */}
        <div className="flex flex-col items-center w-full mt-16 px-4">
          {/* Form */}
          <div className="w-full sm:w-1/2 flex flex-wrap justify-center">
            <div className="flex flex-col w-full sm:w-5/12 mb-4 mr-4">
              <label
                htmlFor="name"
                className="block"
                style={{ fontWeight: "600" }}
              >
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
            <div className="flex flex-col w-full sm:w-5/12 mb-4 mr-4">
              <label
                htmlFor="email"
                className="block"
                style={{ fontWeight: "600" }}
              >
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
            <div className="flex flex-col w-full sm:w-5/12 mb-4 mr-4">
              <label
                htmlFor="fromDate"
                className="block"
                style={{ fontWeight: "600" }}
              >
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
            <div className="flex flex-col w-full sm:w-5/12 mb-4 mr-4">
              <label
                htmlFor="toDate"
                className="block"
                style={{ fontWeight: "600" }}
              >
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
          </div>
          {/* Buttons Container */}
          <div className="flex mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white mr-4 px-4 py-2 rounded-md"
              onClick={handleSubmit}
            >
              Generate Certificate 🡢
            </button>
            <button
              onClick={() => goToValidate()}
              className="bg-green-500 hover:bg-green-600 text-white mr-4 px-4 py-2 rounded-md"
            >
              Validate Certificate ✔️
            </button>
            <button
              onClick={() => goToGenCertificate()}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
            >
              History ↺
            </button>
          </div>
          {loading && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50 z-50">
            <ClipLoader size={50} color={"#123abc"} loading={loading} />
          </div>
        )}
        </div>
      </div>
    </>
  );
}

export default Home;
