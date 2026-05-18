import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function MergePDF() {
  const [files, setFiles] = useState([]);

  const mergePDFs = async (files) => {
    const mergedPdf = await PDFDocument.create();

    for (let file of files) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();

    const blob = new Blob([mergedBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    a.click();
    const removeFile = (indexToRemove) => {
  const updatedFiles = files.filter((_, index) => index !== indexToRemove);
  setFiles(updatedFiles);
 };
  };

  return (
  <div className="text-center">
    <h2 className="text-2xl font-semibold mb-6">Merge PDF</h2>

    {/* Upload box */}
    <div
      onClick={() => document.getElementById('fileInput').click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(droppedFiles);
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
        id="fileInput"
        type="file"
        multiple
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const selectedFiles = Array.from(e.target.files);
          setFiles(selectedFiles);
        }}
      />

      <div className="text-5xl mb-3">📄</div>

      <p className="text-lg text-gray-300">
        Drag & drop PDFs here
      </p>

      <p className="text-sm text-gray-500 mt-2">
        or click to browse files
      </p>
    </div>

    {/* File List */}
    <ul className="mt-4 text-sm text-gray-300">
      {files.map((file, index) => (
        <li
          key={index}
          className="flex justify-between items-center bg-gray-700 px-3 py-2 rounded mb-2 hover:bg-gray-600 transition"
        >
          <span>📄 {file.name}</span>

          <button
            type="button"
            onClick={() => {
              const updatedFiles = files.filter((_, i) => i !== index);
              setFiles(updatedFiles);
            }}
            className="text-red-400 hover:text-red-300"
          >
            ❌
          </button>
        </li>
      ))}
    </ul>

    {/* Merge Button */}
    <button
      onClick={() => mergePDFs(files)}
      disabled={files.length === 0}
      className={`mt-4 px-6 py-2 rounded-lg text-white transition ${
        files.length === 0
          ? 'bg-gray-500 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      Merge PDF
    </button>
  </div>
);
}