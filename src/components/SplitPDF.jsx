import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function SplitPDF() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState('');

  const parsePages = (input, totalPages) => {
    let result = [];

    input.split(',').forEach((part) => {
      if (part.includes('-')) {
        let [start, end] = part.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          result.push(i - 1);
        }
      } else {
        result.push(Number(part) - 1);
      }
    });

    return result.filter((p) => p >= 0 && p < totalPages);
  };

  const splitPDF = async (file) => {
    if (!file) return;

    setLoading(true);

    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);

    const totalPages = pdf.getPageCount();

    const pageIndexes = pages
      ? parsePages(pages, totalPages)
      : [...Array(totalPages).keys()];

    for (let i of pageIndexes) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);

      newPdf.addPage(page);

      const newBytes = await newPdf.save();

      const blob = new Blob([newBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `page-${i + 1}.pdf`;
      a.click();
    }

    setLoading(false);
  };
const combineSelectedPages = async (file) => {
  if (!file) return;

  setLoading(true);

  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);

  const totalPages = pdf.getPageCount();

  const pageIndexes = pages
    ? parsePages(pages, totalPages)
    : [...Array(totalPages).keys()];

  const newPdf = await PDFDocument.create();

  const copiedPages = await newPdf.copyPages(pdf, pageIndexes);

  copiedPages.forEach((page) => newPdf.addPage(page));

  const newBytes = await newPdf.save();

  const blob = new Blob([newBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'selected-pages.pdf';
  a.click();

  setLoading(false);
 };
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">Split PDF</h2>

      {/* Upload box */}
      <div
        onClick={() => document.getElementById('splitInput').click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const droppedFile = e.dataTransfer.files[0];
          setFile(droppedFile);
        }}
        onDragEnter={(e) =>
          e.currentTarget.classList.add('border-blue-400')
        }
        onDragLeave={(e) =>
          e.currentTarget.classList.remove('border-blue-400')
        }
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-2xl p-10 cursor-pointer hover:border-blue-400 hover:bg-gray-700/40 transition"
      >
        <input
          id="splitInput"
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
          }}
        />

        <div className="text-5xl mb-3">📄</div>

        <p className="text-lg text-gray-300">
          Drag & drop PDF here
        </p>

        <p className="text-sm text-gray-500 mt-2">
          or click to browse file
        </p>
      </div>

      {/* File Display */}
      {file && (
        <div className="mt-4 flex justify-between items-center bg-gray-700 px-4 py-2 rounded text-sm text-gray-300">
          <span>📄 {file.name}</span>

          <button
            onClick={() => setFile(null)}
            className="text-red-400 hover:text-red-300"
          >
            ❌
          </button>
        </div>
      )}

      {/* Page Input */}
      <input
        type="text"
        placeholder="Enter pages (e.g. 1,3,5 or 2-6)"
        value={pages}
        onChange={(e) => setPages(e.target.value)}
        className="mt-4 px-4 py-2 rounded bg-gray-700 text-white w-full outline-none"
      />

     <div className="flex gap-4 mt-6">

  {/* Split Button */}
  <button
    onClick={() => splitPDF(file)}
    disabled={!file || loading}
    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition transform hover:scale-105 active:scale-95 ${
      !file || loading
        ? 'bg-gray-600 cursor-not-allowed'
        : 'bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-blue-500/30'
    }`}
  >
    {loading ? (
      <>
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        Splitting...
      </>
    ) : (
      <>
        ✂️ Split
      </>
    )}
  </button>

  {/* Combine Button */}
  <button
    onClick={() => combineSelectedPages(file)}
    disabled={!file || loading}
    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition transform hover:scale-105 active:scale-95 ${
      !file || loading
        ? 'bg-gray-600 cursor-not-allowed'
        : 'bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-green-500/30'
    }`}
  >
    {loading ? (
      <>
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        Processing...
      </>
    ) : (
      <>
        📄 Combine
      </>
    )}
  </button>

</div>
   </div>
  );
}