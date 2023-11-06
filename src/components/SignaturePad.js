import React, { forwardRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignaturePad = forwardRef((_, ref) => {

  const handleClear = () => {
    if (ref.current) {
      ref.current.clear();
    }
  };

  return (
    <div className="signature-container">
        <div className="signature-arrow-box">Signature</div>
        <SignatureCanvas ref={ref} penColor='black'
            canvasProps={{width:320, height: 200, className: 'sigCanvas'}} />
        <button onClick={handleClear} className="clear-button">Clear</button>
    </div>
  );
});

export default SignaturePad;
