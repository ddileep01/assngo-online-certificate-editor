import React, {useState, useEffect} from  "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import './certificate.css';
import './App.css';
import { useLocation, useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_USER_ID } from './emailjs-config';

const CertificateView = ({ generatedCertificate }) => {
  const location = useLocation();
  const navigate = useNavigate();
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
    // Get the visible certificate container that's already rendered on screen
    const element = document.getElementById('certificate-container');
    if (!element) {
      console.error('Certificate element not found');
      return;
    }
    
    toast.info('Generating PDF, please wait...');
    
    try {
      // First ensure all images are loaded
      const images = Array.from(element.querySelectorAll('img'));
      await Promise.all(
        images.map(
          (img) => 
            new Promise((resolve) => {
              if (img.complete) {
                resolve();
              } else {
                img.onload = resolve;
                img.onerror = resolve; // Continue even if an image fails to load
              }
            })
        )
      );
      
      // Create a sanitized filename from the recipient's name
      const recipientName = props.datas.name + '_ass_certificate_of_appreciation' || 'ass_certificate_of_appreciation';
      const sanitizedName = recipientName.replace(/[^a-zA-Z0-9]/g, '_');
      
      // Create a clone of the element to modify for PDF generation
      const cloneContainer = element.cloneNode(true);
      document.body.appendChild(cloneContainer);
      
      // Apply specific styles to ensure proper rendering
      cloneContainer.style.position = 'absolute';
      cloneContainer.style.left = '-9999px';
      cloneContainer.style.backgroundColor = 'white'; // Ensure white background
      cloneContainer.style.color = '#1d4141'; // Ensure text color is visible
      
      // Make sure all text elements have proper color
      const textElements = cloneContainer.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span');
      textElements.forEach(el => {
        if (getComputedStyle(el).color === 'rgb(0, 0, 0)' || getComputedStyle(el).color === '#000000') {
          el.style.color = '#1d4141';
        }
      });
      
      // Load background image directly
      const bgImg = new Image();
      bgImg.crossOrigin = 'Anonymous';
      bgImg.src = '/images/ass-cert-bg-img.jpg';
      
      await new Promise((resolve) => {
        bgImg.onload = resolve;
        bgImg.onerror = resolve;
        
        // If image doesn't load within 2 seconds, continue anyway
        setTimeout(resolve, 2000);
      });
      
      // First capture the certificate as an image with html2canvas
      const canvas = await html2canvas(cloneContainer, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'white', // Explicitly set white background
        logging: true, // Enable logging for debugging
        imageTimeout: 0, // No timeout for image loading
      });
      
      // Remove the clone from DOM after capturing
      document.body.removeChild(cloneContainer);
      
      // Create a new PDF with jsPDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate proper dimensions to maintain aspect ratio
      const imgWidth = 297; // A4 width in landscape (mm)
      const pageHeight = 210; // A4 height in landscape (mm)
      
      // Get canvas aspect ratio
      const canvasRatio = canvas.width / canvas.height;
      
      // Calculate height based on width to maintain aspect ratio
      const imgHeight = imgWidth / canvasRatio;
      
      // Center the image vertically if needed
      const yPosition = Math.max(0, (pageHeight - imgHeight) / 2);
      
      // Add the canvas as an image to the PDF with proper dimensions
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(imgData, 'JPEG', 0, yPosition, imgWidth, imgHeight); // Maintain aspect ratio
      
      // Save the PDF
      pdf.save(`${sanitizedName}.pdf`);
      
      toast.success('PDF generated successfully!');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
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
  };

  // You can call this function when needed
  useEffect(() => {
    if (certificateImage) {
      logCertificateImage();
    }
  }, [certificateImage, logCertificateImage]);

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

ℹ️ For original PDF file format, please contact our admin at ✉️ Email id: akhandasevasamsthan.ass@gmail.com

📞 Cell: +91 97046 01395, +91 81436 60501

Your support can be the catalyst for transformative change. Consider making a donation to Akhanda Seva Samsthan and help us fund vital projects that uplift communities. Every contribution, no matter the size, contributes to our collective efforts in creating a more equitable and sustainable world.

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ToastContainer />
      
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-800">Certificate of Appreciation</h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="button button-secondary flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>Return Home</span>
            </button>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
        <div className="page-container">
          <div className="page-header">
            <h2 className="page-title">Certificate Preview</h2>
          </div>
          
          {/* Actions */}
          <div className="button-group mb-4">
            <button
              onClick={handleDownloadPDF}
              className="button button-primary flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleSendEmail}
              className={`button ${sending ? 'bg-gray-400 cursor-not-allowed' : 'button-success'} flex items-center gap-2`}
              disabled={sending}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>{sending ? 'Sending...' : 'Email Certificate'}</span>
            </button>
          </div>
        </div>
        
        {/* Certificate Preview */}
        <div className="form-container p-4 flex justify-center mb-6 overflow-auto">
          <div id="certificate-container" className="certificate-container">
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
                <p>✉ akhandasevasamsthan.ass@gmail.com</p>
                <span className="ml-2 mr-2">|</span>
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
        
        {/* Additional Information */}
        <div className="form-container mt-8 mb-16">
          <div className="form-header">
            <h3 className="form-title">Certificate Information</h3>
            <p className="form-subtitle">Details of the generated certificate</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Recipient</p>
              <p className="font-medium">{props?.datas?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Certificate ID</p>
              <p className="font-medium">{props?.certId || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Service Period</p>
              <p className="font-medium">
                {props?.datas?.fromDate ? formatDate(props.datas.fromDate) : 'N/A'} to {props?.datas?.toDate ? formatDate(props.datas.toDate) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{props?.datas?.email || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        {/* Hidden element for PDF download */}
        <div id="download-pdf" style={{ position: 'absolute', left: '-9999px' }}>
          <div className="certificate-container">
            {/* Duplicate certificate content for PDF generation */}
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
              <p className="name font-bold">{props?.datas?.name}</p>
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
                <p>✉ akhandasevasamsthan.ass@gmail.com</p>
                <span className="ml-2 mr-2">|</span>
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
      </div>
    </div>
  );
};

export default CertificateView;
