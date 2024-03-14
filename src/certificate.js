import React from "react";
import './certificate.css';

function CertificatePrint() {

    return(
        <>
            <div>
                {/* <img
                    src="https://i.ibb.co/xjHRKCt/ASS-Certificate-with-stamp-nd-signs-edited.png"
                    alt="Certificate"
                    className="w-4/5 mb-4 certificate-bg-img"
                /> */}
                <div className="certificate-bg-img">
                    <p>from date</p>
                    <p>to date</p>
                    <p>name</p>
                    <p>certificate ID</p>
                </div>
            </div>
        </>
    )
    
}

export default CertificatePrint;