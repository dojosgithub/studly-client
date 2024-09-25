import React, { useEffect, useState, useRef } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const PdfModifier = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [textBox, setTextBox] = useState({ visible: false, x: 0, y: 0 });
  const [inputText, setInputText] = useState('');
  const inputRef = useRef(null);

  const modifyPdf = async (x, y, text) => {
    const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf';
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize(); // Get the PDF page size

    firstPage.drawText(text, {
      x,
      y, // Flip the y-coordinate to match PDF's origin
      size: 20,
      font: helveticaFont,
      color: rgb(0.1, 0.1, 0.95),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const newPdfUrl = URL.createObjectURL(blob);
    setPdfUrl(newPdfUrl);
  };

  useEffect(() => {
    modifyPdf(0, 0, ''); // Initial PDF rendering without any text
  }, []);

  const handlePdfClick = (e) => {
    const container = e.currentTarget.getBoundingClientRect(); // Bounding box of the div
    const x = e.clientX - container.left;
    const y = e.clientY - container.top;

    const iframe = document.querySelector('iframe');
    const iframeRect = iframe.getBoundingClientRect();

    // Get the PDF page dimensions and iframe dimensions
    const scaleX = iframeRect.width / 800; // Assuming the PDF is rendered at 800px width
    const scaleY = iframeRect.height / 800; // Assuming the PDF is rendered at 800px height

    // Convert click position to PDF coordinates
    const pdfX = x / scaleX;
    const pdfY = y / scaleY;

    setTextBox({ visible: true, x: pdfX, y: pdfY });

    // Focus the input field as soon as it's rendered
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleInputSubmit = (e) => {
    if (e.key === 'Enter') {
      modifyPdf(textBox.x, textBox.y, inputText);
      setTextBox({ visible: false, x: 0, y: 0 });
      setInputText('');
    } else if (e.key === 'Escape') {
      setTextBox({ visible: false, x: 0, y: 0 });
      setInputText('');
    }
  };
  return (
    <div>
      {pdfUrl && (
        <div
          role="button"
          tabIndex={0}
          onClick={handlePdfClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handlePdfClick(e);
            }
          }}
          style={{ position: 'relative' }}
        >
          <iframe
            src={pdfUrl}
            width="800"
            height="800"
            title="Modified PDF"
            style={{ pointerEvents: 'none' }} // Prevent interaction with the iframe itself
          />
          {textBox.visible && (
            <input
              type="text"
              ref={inputRef} // Attach the ref to the input field
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleInputSubmit}
              style={{
                position: 'absolute',
                top: textBox.y * (800 / 800), // Adjust input positioning
                left: textBox.x * (800 / 800), // Adjust input positioning
                zIndex: 1000,
                fontSize: '16px',
                padding: '4px',
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PdfModifier;
