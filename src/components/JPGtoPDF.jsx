import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function JPGtoPDF({ setTool }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const convertToPDF = async () => {
    if (files.length === 0) return;

    setLoading(true);

    const pdf = await PDFDocument.create();

    for (const file of files) {
      const bytes = await file.arrayBuffer();

      let image;

      if (file.type === 'image/png') {
        image = await pdf.embedPng(bytes);
      } else {
        image = await pdf.embedJpg(bytes);
      }

      const page = pdf.addPage([image.width, image.height]);

      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    const pdfBytes = await pdf.save();

    const blob = new Blob([pdfBytes], {
      type: 'application/pdf',
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.pdf';
    a.click();

    setLoading(false);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">
        JPG to PDF
      </h2>

      {/* Upload Box */}
      <div
        onClick={() =>
          document.getElementById('jpgInput').click()
        }
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const droppedFiles = Array.from(
            e.dataTransfer.files
          );
          setFiles(droppedFiles);
        }}
        className="border-2 border-dashed border-gray-600 rounded-2xl p-10 cursor-pointer hover:border-blue-400 transition"
      >
        <input
          id="jpgInput"
          type="file"
          multiple
          accept="image/png, image/jpeg"
          className="hidden"
          onChange={(e) =>
            setFiles(Array.from(e.target.files))
          }
        />

        <div className="text-5xl mb-3">🖼️</div>

        <p className="text-gray-300">
          Drag & drop images here
        </p>

        <p className="text-sm text-gray-500 mt-2">
          PNG & JPG supported
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="bg-gray-700 px-4 py-2 rounded flex justify-between items-center"
            >
              <span className="text-sm text-gray-300">
                🖼️ {file.name}
              </span>

              <button
                onClick={() =>
                  setFiles(
                    files.filter((_, i) => i !== index)
                  )
                }
                className="text-red-400"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Convert Button */}
      <button
        onClick={convertToPDF}
        disabled={files.length === 0 || loading}
        className={`mt-6 px-6 py-3 rounded-xl text-white transition ${
          files.length === 0 || loading
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {loading ? 'Converting...' : 'Convert to PDF'}
      </button>
    </div>
  );
}