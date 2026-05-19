import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function CompressPDF() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [level, setLevel] = useState("screen");

const compressPDF = async (file) => {
  if (!file) return;

  setLoading(true);

 const formData = new FormData();
formData.append('file', file);
formData.append('level', level);

  try {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const response = await fetch('http://localhost:5000/compress', {
      method: 'POST',
      body: formData,
    });

    const blob = await res.blob();
    const originalSize = file.size;
const compressedSize = blob.size;

const reduction = (
  ((originalSize - compressedSize) / originalSize) * 100
).toFixed(1);

setResult({
  original: originalSize,
  compressed: compressedSize,
  reduction,
 });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed.pdf';
    a.click();

  } catch (err) {
    console.error(err);
    alert("Compression failed");
  }

  setLoading(false);
};

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">Compress PDF</h2>

      {/* Upload box */}
      <div
        onClick={() => document.getElementById('compressInput').click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const droppedFile = e.dataTransfer.files[0];
          setFile(droppedFile);
        }}
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-2xl p-10 cursor-pointer hover:border-blue-400 hover:bg-gray-700/40 transition"
      >
        <input
          id="compressInput"
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
          }}
        />

        <div className="text-5xl mb-3">📉</div>

        <p className="text-lg text-gray-300">
          Drag & drop PDF here
        </p>

        <p className="text-sm text-gray-500 mt-2">
          or click to browse file
        </p>
      </div>

      {/* File Display */}
     {result && (
  <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-green-400 text-sm">
    Reduced from {(result.original / 1024).toFixed(1)} KB → {(result.compressed / 1024).toFixed(1)} KB  
    <br />
    Saved {result.reduction}% space
  </div>
)}
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

 <select
  value={level}
  onChange={(e) => setLevel(e.target.value)}
  className="mb-4 px-3 py-2 rounded bg-gray-800 text-white"
>
  <option value="screen">Extreme Compression</option>
  <option value="ebook">Recommended</option>
  <option value="printer">Less Compression</option>
 </select>

      {/* Compress Button */}
      <button
        onClick={() => compressPDF(file)}
        disabled={!file || loading}
        className={`mt-4 px-6 py-2 rounded-lg text-white transition ${
          !file || loading
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-purple-500 hover:bg-purple-600'
        }`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Compressing...
          </>
        ) : (
          "Compress PDF"
        )}
      </button>
    </div>
  );
}