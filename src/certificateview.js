import React, {useState, useEffect} from  "react";
import html2pdf from 'html2pdf.js';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import './certificate.css';
import { useLocation, Link } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_USER_ID } from './emailjs-config';

const CertificateView = ({ generatedCertificate }) => {
  const location = useLocation();
  const props = location.state;
  const [certificateImage, setCertificateImage] = useState(null);
  const [sending, setSending] = useState(false);
  
  // Function to capture certificate as image
  const captureCertificateAsImage = async () => {
    const element = document.getElementById('certificate-container');
    if (!element) {
      console.error('Certificate element not found');
      return null;
    }
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null
      });
      
      // Convert canvas to image data URL
      const imageDataUrl = canvas.toDataURL('image/png');
      setCertificateImage(imageDataUrl);
      return imageDataUrl;
    } catch (error) {
      console.error('Failed to capture certificate as image:', error);
      return null;
    }
  };

  // Function to compress image data URL to reduce size
  const compressImage = (dataUrl, maxSizeKB = 15) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        const aspectRatio = width / height;
        
        // Start with more aggressive quality and size reduction
        let quality = 0.3; // Start with 30% quality
        let iterations = 0;
        const maxIterations = 10;
        
        // Start with smaller dimensions
        width = width * 0.6;
        height = width / aspectRatio;
        
        const compress = () => {
          // Resize if needed after first quality reduction doesn't work
          if (iterations > 2) {
            width = width * 0.7;
            height = width / aspectRatio;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get compressed data URL
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          
          // Check size in KB
          const sizeInKB = Math.round((compressedDataUrl.length * 3) / 4) / 1024;
          
          console.log(`Compression attempt ${iterations + 1}: Size = ${sizeInKB.toFixed(2)}KB, Quality = ${quality}, Dimensions = ${width}x${height}`);
          
          if (sizeInKB <= maxSizeKB || iterations >= maxIterations) {
            resolve(compressedDataUrl);
          } else {
            // Reduce quality for next iteration
            quality = Math.max(0.1, quality - 0.1);
            iterations++;
            compress();
          }
        };
        
        compress();
      };
      
      img.src = dataUrl;
    });
  };

  // Capture certificate image on component mount
  useEffect(() => {
    captureCertificateAsImage();
  }, []);
  
  const handleDownloadPDF = async () => {
    const element = document.getElementById('download-pdf');
    if (!element) {
      console.error('Element not found');
      return;
    }
    
    // If we don't have the certificate image yet, capture it now
    if (!certificateImage) {
      await captureCertificateAsImage();
    }
  
    // Create a sanitized filename from the recipient's name
    const recipientName = props.datas.name + '_ass_certificate_of_appreciation' || 'ass_certificate_of_appreciation';
    const sanitizedName = recipientName.replace(/[^a-zA-Z0-9]/g, '_');
    
    const opt = {
      margin: 0,
      filename: `${sanitizedName}.pdf`,
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

  // Example function showing how to use the certificate image
  const logCertificateImage = () => {
    if (!certificateImage) {
      console.log('Certificate image not available yet');
      return;
    }
    
    console.log('Certificate image is available for use:', certificateImage.substring(0, 50) + '...');
    
    // Example: You can use the image data URL directly in an img tag
    // <img src={certificateImage} alt="Certificate" />
    
    // Example: You can send this image to a server
    // const sendImageToServer = async () => {
    //   try {
    //     const response = await fetch('/api/save-certificate', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         certificateImage,
    //         recipientName: props.datas.name,
    //         certificateId: props.certId
    //       }),
    //     });
    //     const data = await response.json();
    //     console.log('Server response:', data);
    //   } catch (error) {
    //     console.error('Error sending image to server:', error);
    //   }
    // };
  };

  // You can call this function when needed
  useEffect(() => {
    if (certificateImage) {
      logCertificateImage();
    }
  }, [certificateImage]);

  const handleSendEmail = async () => {
    // Check if we have the recipient's email
    if (!props.datas.email) {
      toast.error('Recipient email is required!');
      return;
    }

    // Make sure we have the certificate image
    let imageToSend = certificateImage;
    if (!imageToSend) {
      toast.info('Generating certificate image...');
      imageToSend = await captureCertificateAsImage();
      if (!imageToSend) {
        toast.error('Failed to generate certificate image!');
        return;
      }
    }

    setSending(true);
    toast.info('Preparing email...');

    try {
      // Compress the image to ensure it's under 15KB (well under the 50KB limit)
      const compressedImage = await compressImage(imageToSend);
      toast.info('Sending email...');

      // Get recipient email from props
      const recipientEmail = props.datas.email;
      console.log('Sending email to:', recipientEmail);

      // Create a personalized message
      const personalizedMessage = `Dear ${props.datas.name},

Please find attached your Certificate of Appreciation from Akhanda Seva Samsthan.

Certificate ID: ${props.certId}
Service Period: ${formatDate(props.datas.fromDate)} to ${formatDate(props.datas.toDate)}

Thank you for your dedicated service!

Please find your certificate attached below, for original PDF format file, please contact our admin at ✉️ Email id: akhandasevasamsthan.ass@gmail.com

📞 Cell: +91 97046 01395, +91 81436 60501

Best regards,
Akhanda Seva Samsthan Team.`;

      // Prepare the email parameters with only the necessary fields
      const templateParams = {
        'to_email': recipientEmail,
        'to_name': props.datas.name,
        'personalizedMessage': personalizedMessage,
        'certificate_image': compressedImage,
        // Add additional recipient email parameters that EmailJS might be looking for
        'recipient': recipientEmail,
        'email': recipientEmail,
        'reply_to': recipientEmail,
        'user_email': recipientEmail,
        'destination': recipientEmail
      };

      console.log('Email template params size (approx):', 
        Math.round((JSON.stringify(templateParams).length * 3) / 4) / 1024, 'KB');

      // Send the email using EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_USER_ID
      );

      console.log('Email sent successfully:', response);
      toast.success('Certificate sent to recipient\'s email!');
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Provide more specific error messages based on the error
      if (error.text) {
        toast.error(`Failed to send email: ${error.text}`);
      } else if (error.message) {
        toast.error(`Failed to send email: ${error.message}`);
      } else {
        toast.error('Failed to send email! Please check your EmailJS configuration.');
      }
    } finally {
      setSending(false);
    }
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
              {/* <div className="mail-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="12"
                  width="12"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#000000"
                    d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"
                  />
                </svg>
              </div> */}
              <p>✉ akhandasevasamsthan.ass@gmail.com</p>
              <span className="ml-2 mr-2">|</span>
              {/* <div className="web-icon">
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
              </div> */}
              <a href="https://www.akhandasevasamsthan.org/" style={{ textDecoration: "none", color: "inherit" }}>ⓘ www.akhandasevasamsthan.org</a>
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
          onClick={handleSendEmail}
          disabled={sending}
          className="bg-green-950 hover:bg-green-900 text-white px-4 py-2 w-64 mt-2 mb-2"
        >
          {sending ? 'Sending...' : 'Send Email ✉'}
        </button>
        <Link to="/" className="bg-green-950 hover:bg-green-900 text-white px-4 py-2 w-64 mt-2 mb-2">
          Back to Generate Certificate
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CertificateView;
