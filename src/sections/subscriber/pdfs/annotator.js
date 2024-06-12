import React, { useEffect, useState } from 'react';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const PdfModifier = () => {
  const [pdfUrl, setPdfUrl] = useState(null);

  const modifyPdf = async () => {
    const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf';
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    firstPage.drawText('This text was added with JavaScriptss!', {
      x: 5,
      y: height / 2 + 300,
      size: 50,
      font: helveticaFont,
      color: rgb(0.95, 0.1, 0.1),
      rotate: degrees(-45),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const newPdfUrl = URL.createObjectURL(blob);
    setPdfUrl(newPdfUrl);
  };

  useEffect(() => {
    modifyPdf();
  }, []);
  
  return (
    <div>
      {/* <button type="button" onClick={modifyPdf}>
        Modify PDF
      </button> */}
      {pdfUrl && <iframe src={pdfUrl} width="800" height="800" title="Modified PDF" />}
    </div>
  );
};

export default PdfModifier;
