import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function PDFtoJPG() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

const convertToJPG = async () => {

  if (!file) return;

  setLoading(true);

  const fileReader = new FileReader();

  fileReader.onload = async function () {

    const typedarray = new Uint8Array(this.result);

    const pdf = await pdfjsLib.getDocument({
      data: typedarray,
    }).promise;

    const zip = new JSZip();

    for (let i = 1; i <= pdf.numPages; i++) {

      const page = await pdf.getPage(i);

      const viewport = page.getViewport({
        scale: 2,
      });

      const canvas = document.createElement('canvas');

      const context = canvas.getContext('2d');

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', 0.9)
      );

      zip.file(`page-${i}.jpg`, blob);
    }

    const zipBlob = await zip.generateAsync({
      type: 'blob',
    });

    saveAs(zipBlob, 'pdf-images.zip');

    setLoading(false);
  };

  fileReader.readAsArrayBuffer(file);
};

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">
        PDF to JPG
      </h2>

      {/* Upload Box */}
      <div
        onClick={() =>
          document.getElementById('pdfInput').click()
        }
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const droppedFile =
            e.dataTransfer.files[0];

          setFile(droppedFile);
        }}
        className="border-2 border-dashed border-gray-600 rounded-2xl p-10 cursor-pointer hover:border-green-400 transition"
      >
        <input
          id="pdfInput"
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) =>
            setFile(e.target.files[0])
          }
        />

        <div className="text-5xl mb-3">📄</div>

        <p className="text-gray-300">
          Drag & drop PDF here
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Convert PDF pages into JPG images
        </p>
      </div>

      {/* File Display */}
      {file && (
        <div className="mt-4 bg-gray-700 px-4 py-2 rounded text-sm text-gray-300 flex justify-between items-center">
          <span>📄 {file.name}</span>

          <button
            onClick={() => setFile(null)}
            className="text-red-400"
          >
            ❌
          </button>
        </div>
      )}

      {/* Convert Button */}
      <button
        onClick={convertToJPG}
        disabled={!file || loading}
        className={`mt-6 px-6 py-3 rounded-xl text-white transition ${
          !file || loading
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {loading
          ? 'Converting...'
          : 'Convert to JPG'}
      </button>
    </div>
  );
}