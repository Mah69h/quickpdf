import { useState } from 'react';

import * as pdfjsLib from 'pdfjs-dist/build/pdf';

import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';

import PptxGenJS from 'pptxgenjs';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  pdfjsWorker;

export default function PDFtoPPT() {

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const convertToPPT = async () => {

    if (!file) return;

    setLoading(true);

    const fileReader = new FileReader();

    fileReader.onload = async function () {

      const typedarray =
        new Uint8Array(this.result);

      const pdf =
        await pdfjsLib.getDocument({
          data: typedarray,
        }).promise;

      const pptx = new PptxGenJS();

      pptx.layout = 'LAYOUT_WIDE';

      for (
        let i = 1;
        i <= pdf.numPages;
        i++
      ) {

        const page = await pdf.getPage(i);

        const viewport =
          page.getViewport({
            scale: 2,
          });

        const canvas =
          document.createElement('canvas');

        const context =
          canvas.getContext('2d');

        canvas.width = viewport.width;

        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        const imgData =
          canvas.toDataURL(
            'image/jpeg',
            0.9
          );

        const slide = pptx.addSlide();

        slide.addImage({
          data: imgData,
          x: 0,
          y: 0,
          w: 13.33,
          h: 7.5,
        });
      }

      await pptx.writeFile({
        fileName: 'converted.pptx',
      });

      setLoading(false);
    };

    fileReader.readAsArrayBuffer(file);
  };

  return (
    <div className="text-center">

      <h2 className="text-2xl font-semibold mb-6">
        PDF to POWERPOINT
      </h2>

      <div
        onClick={() =>
          document.getElementById(
            'pdfPPTInput'
          ).click()
        }

        onDragOver={(e) =>
          e.preventDefault()
        }

        onDrop={(e) => {

          e.preventDefault();

          const droppedFile =
            e.dataTransfer.files[0];

          setFile(droppedFile);
        }}

        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-2xl p-10 cursor-pointer hover:border-orange-400 hover:bg-gray-700/40 transition"
      >

        <input
          id="pdfPPTInput"
          type="file"
          accept="application/pdf"
          className="hidden"

          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />

        <div className="text-5xl mb-3">
          📊
        </div>

        <p className="text-lg text-gray-300">
          Drag & drop PDF here
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Convert PDF into PowerPoint
        </p>

      </div>

      {file && (

        <div className="mt-4 flex justify-between items-center bg-gray-700 px-4 py-2 rounded text-sm text-gray-300">

          <span>
            📄 {file.name}
          </span>

          <button
            onClick={() =>
              setFile(null)
            }

            className="text-red-400 hover:text-red-300"
          >
            ❌
          </button>

        </div>
      )}

      <button
        onClick={convertToPPT}

        disabled={!file || loading}

        className={`mt-4 px-6 py-3 rounded-xl text-white font-medium transition ${
          !file || loading
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-orange-500 hover:bg-orange-600 hover:scale-105'
        }`}
      >

        {loading
          ? 'Converting...'
          : 'Convert to POWERPOINT'}

      </button>

    </div>
  );
}