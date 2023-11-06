import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { PDFDocument, rgb } from 'pdf-lib';
import SignaturePad from './SignaturePad';
import { getFunctions, httpsCallable } from "firebase/functions";
import { app, analytics } from '../firebase';

function Contract() {
  const [contract, setContract] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const sigCanvasRef = useRef(null);
  const navigate = useNavigate();

  function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  useEffect(() => {
    const generatePdf = async () => {
      fetch('liability-waiver.txt')
        // fetch('captains-demise.txt')
        .then(response => response.text())
        .then((data) => {
          const form = JSON.parse(localStorage.getItem('form'));
          const contractTemplate = data;
          const filledContract = contractTemplate.replace(/{(.*?)}/g, (_, key) => {
            if (key === 'date') {
              // Get today's date
              const today = new Date();
              // Format the date
              const formattedDate = formatDate(today);
              return formattedDate;
            }
            return form[key] || '';
          });
          setContract(filledContract);
        })
        .catch(error => console.error('Error fetching contract template:', error));
    }
    generatePdf();
  }, []);

  const handleSign = async () => {
    if (sigCanvasRef.current && sigCanvasRef.current.isEmpty()) {
      alert("Please provide your signature before submitting.");
      return;
    }
    setIsUploading(true);
    if (sigCanvasRef.current) {
      const signatureData = sigCanvasRef.current.toDataURL();
      setSignatureImage(signatureData);
      if (signatureData) {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        // Add a new page to the document
        const page = pdfDoc.addPage();

        const lines = handleNewLinesAndWidth(contract, 1200, 10); // Adjust the maxWidth (800 in this case) as needed

        let yOffset = 800;  // starting y position
        const lineHeight = 12;

        lines.forEach(line => {
          page.drawText(line, { x: 10, y: yOffset, size: 10, lineHeight: lineHeight, color: rgb(0, 0, 0) });
          yOffset -= lineHeight;  // move down by lineHeight for each line
        });

        // Load and draw the signature image
        const signatureImage = await pdfDoc.embedPng(signatureData);
        const signatureDim = signatureImage.scale(0.5);  // Adjust scale as needed
        page.drawImage(signatureImage, {
          x: 10,
          y: 50,
          width: signatureDim.width,
          height: signatureDim.height,
        });

        // Serialize the PDF to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        // // SAVE PDF
        // // Create a link element
        // const link = document.createElement('a');
        // // Set the download attribute with a filename
        // link.download = 'Contract.pdf';
        // // Create a URL for the Blob and set it as the href attribute
        // link.href = window.URL.createObjectURL(blob);
        // // Append the link to the body
        // document.body.appendChild(link);
        // // Programmatically click the link to trigger the download
        // link.click();
        // // Remove the link from the document
        // document.body.removeChild(link);


        const functions = getFunctions(app, 'us-central1');
        const uploadContract = httpsCallable(functions, 'upload');
        const form = JSON.parse(localStorage.getItem('form'));

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          const data = {
            email: form.email,
            name: form.name,
            optin: form.marketingEmails,
            file: base64data
          };

          console.log("sending: ", data);
          uploadContract(data)
            .then((result) => {
              console.log('Function result:', result.data);
              navigate('/done');
            })
            .catch((error) => {
              console.error('Error calling function:', error);
            });
        }
      }
    }
  };

  const getLineWidth = (line, fontSize, upperCaseWeight) => {
    let width = 0;
    for (let char of line) {
      if (char === char.toUpperCase() && char !== ' ') {
        width += fontSize * upperCaseWeight;
      } else {
        width += fontSize;
      }
    }
    return width;
  };

  const splitTextToWidth = (text, maxWidth, fontSize, upperCaseWeight = 1.5) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = getLineWidth(currentLine + ' ' + word, fontSize, upperCaseWeight);
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);

    return lines;
  };


  const handleNewLinesAndWidth = (text, maxWidth, fontSize) => {
    const splitByNewLines = text.split('\n');
    let allLines = [];

    splitByNewLines.forEach((txt) => {
      const lines = splitTextToWidth(txt, maxWidth, fontSize);
      allLines = allLines.concat(lines);
    });

    return allLines;
  };

  return (
    <div id="contract">
      <div className="contract-text">
        {contract}
        {signatureImage ? (
          <img src={signatureImage} alt="Signature" />
        ) : (
          <SignaturePad ref={sigCanvasRef} />
        )}
      </div>
      <div className='button-container'>
        {
          isUploading ?
            (
              <div>
                Uploading...
              </div>
            ) :
            (
              <button onClick={handleSign} className='sign-button'>Submit</button>
            )
        }
      </div>
    </div>
  );
}

export default Contract;
