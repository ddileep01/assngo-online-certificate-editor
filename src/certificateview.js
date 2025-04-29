import React, {useState, useEffect} from  "react";
import html2pdf from 'html2pdf.js';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import './certificate.css';
import { useLocation, Link } from 'react-router-dom';

const CertificateView = ({ generatedCertificate }) => {
  const location = useLocation();
  const props = location.state;
  const handleDownloadPDF = async () => {
    const element = document.getElementById('download-pdf');
    if (!element) {
      console.error('Element not found');
      return;
    }
  
    const opt = {
      margin: 0,
      filename: 'ass-certificate.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }, // Change orientation to landscape
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
  const formatDate = (dateString) => {
    const parts = dateString.split("-");
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${day}-${month}-${year}`;
};

  



  return (
    <div className="w-full mt-5">
      <div id="download-pdf" className="flex flex-col items-center">
        <div className="certificate-container" id="certificate-container">
          <div className="header">
            <div>
              <img
                src="/images/ass_logo.png"
                alt="logo"
                style={{ width: "80px", height: "auto" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginLeft: "8px",
              }}
            >
              <h1 className="title">AKHANDA SEVA SAMSTHAN</h1>
              <p className="subtitle">NON-GOVERNMENT ORGANIZATION</p>
              <p className="registration">
                (REGISTERED BY GOV OF AP REGISTER NO:1/2021 | DARPAN ID: AP/2022/0328620)
              </p>
            </div>
          </div>

          <div className="body">
            <h2 className="body-title">CERTIFICATE OF APPRECIATION</h2>
            <p className="content">
              With a deep sense of gratitude, we would like to extend the
              highest appreciation,
              <br />
              on behalf of{" "}
              <span style={{ fontWeight: "bold" }}>
                AKHANDA SEVA SAMSTHAN
              </span>{" "}
              to
            </p>
            <p className="name font-bold">{props.datas.name}</p>
            <hr className="hr-style-name" />

            <p className="content">
              For dedicating his/her selfless service from{" "}
              <span style={{ fontWeight: "bold", paddingRight: "4px" }}>
                {formatDate(props.datas.fromDate)}
              </span>
              to{" "}
              <span style={{ fontWeight: "bold" }}>
                {formatDate(props.datas.toDate)}
              </span>
              <br />
              towards the organization through thick and thin.
            </p>
            <p className="content">
              Please accept this token of gratitude for your remarkable efforts.
            </p>
          </div>

          <div className="footer">
            <div className="official">
              <img
                src="/images/gowri_sign.png"
                alt="Vice President's Signature"
                className="ml-4"
                style={{ width: "100px", height: "auto" }}
              />
              <hr className="hr-style" />
              <p className="official-name">Kolusu Gowri Naidu</p>
              <p className="official-title">VICE-PRESIDENT</p>
            </div>
            <div>
              <img
                src="/images/stamp.png"
                alt="stamp"
                style={{ width: "80px", height: "80px" }}
              />
            </div>
            <div className="official">
              <img
                src="/images/daya_sign.png"
                alt="President's Signature"
                className="ml-4"
                style={{ width: "100px", height: "auto" }}
              />
              <hr className="hr-style" />
              <h6 className="official-name">Rayapureddy Dayakar</h6>
              <p className="official-title">PRESIDENT</p>
            </div>
          </div>

          <div className="contact">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <div className="mail-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="12"
                  width="12"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#000000"
                    d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"
                  />
                </svg>
              </div>
              <p>akhandasevasamsthan.ass@gmail.com</p>
              <span>|</span>
              <div className="web-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="12"
                  width="12"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#000000"
                    d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"
                  />
                </svg>
              </div>
              <a href="https://www.akhandasevasamsthan.org/" style={{ textDecoration: "none", color: "inherit" }}>www.akhandasevasamsthan.org</a>
            </div>
            <p>
              CERTIFICATE ID:{" "}
              <u>
                <a href="https://akhanda-seva-samsthan.vercel.app/validate">
                  {props.certId}
                </a>
              </u>
            </p>
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
        <Link to="/" className="bg-green-950 hover:bg-green-900 text-white px-4 py-2 w-64 mt-2 mb-2">
          Back to Generate Certificate
        </Link>
      </div>
    </div>
  );
};

export default CertificateView;
