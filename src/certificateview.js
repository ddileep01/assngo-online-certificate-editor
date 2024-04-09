import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import './certificate.css';
import { useLocation } from 'react-router-dom';

const CertificateView = ({ generatedCertificate }) => {
    const location = useLocation();
  const props = location.state;
  console.log("data", props.datas)
  const handleDownloadPDF = () => {
    const certificateContainer = document.getElementById(
      "certificate-container"
    );

    html2canvas(certificateContainer, { scrollX: 0, scrollY: 0 }, {useCORS: true}).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("landscape", "mm", "a4"); // Set orientation to landscape
        const imgWidth = 297; // A4 width in landscape mode
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Calculate vertical position for centering
        const yPos = (pdf.internal.pageSize.height - imgHeight) / 2;

        // Add the image to the PDF and position it
        pdf.addImage(imgData, "PNG", 0, yPos, imgWidth, imgHeight);
        pdf.save("ass_certificate.pdf");
      }
    );

  };

  return (
    <div className="w-full mt-5">
      <div id="download-pdf" className="flex flex-col items-center">
        <div className="certificate-container" id="certificate-container">
          <div className="header">
            <div>
              <img
                src="https://i.ibb.co/h9B75cN/ass-logo.png"
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
                (REGISTERED BY GOV OF AP REGISTER NO:1/2021)
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
                <u>{props.datas.fromDate}</u>
              </span>
              to{" "}
              <span style={{ fontWeight: "bold" }}>
                <u>{props.datas.toDate}</u>
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
                src="https://i.ibb.co/9wPpdqC/gowri-sign.png"
                alt="President's Signature"
                className="ml-4"
                style={{ width: "100px", height: "auto" }}
              />
              <hr className="hr-style" />
              <p className="official-name">Kolusu Gowri Naidu</p>
              <p className="official-title">VICE-PRESIDENT</p>
            </div>
            <div>
              <img
                src="https://i.ibb.co/mGPqnbB/stamp.png"
                alt="stamp"
                style={{ width: "80px", height: "80px" }}
              />
            </div>
            <div className="official">
              <img
                src="https://i.ibb.co/hC54cCw/daya-sign.png"
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
              <div className="mt-2 mr-2">
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
      </div>
    </div>
  );
};

export default CertificateView;
