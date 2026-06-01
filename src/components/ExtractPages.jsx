import { useState, useRef } from 'react';

import { PDFDocument } from 'pdf-lib';

import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

export default function ExtractPages() {

  const [file, setFile] =
    useState(null);

  const [pages, setPages] =
    useState([]);

  const [selectedPages, setSelectedPages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const inputRef = useRef(null);

  // LOAD PDF

  const loadPDF = async (pdfFile) => {

    setFile(pdfFile);

    const buffer =
      await pdfFile.arrayBuffer();

    const typedArray =
      new Uint8Array(buffer);

    const pdf =
      await pdfjsLib.getDocument({
        data: typedArray
      }).promise;

    const previews = [];

    for (
      let i = 1;
      i <= pdf.numPages;
      i++
    ) {

      const page =
        await pdf.getPage(i);

      const viewport =
        page.getViewport({
          scale: 0.4
        });

      const canvas =
        document.createElement('canvas');

      const context =
        canvas.getContext('2d');

      canvas.width =
        viewport.width;

      canvas.height =
        viewport.height;

      await page.render({
        canvasContext: context,
        viewport
      }).promise;

      previews.push({
        pageNumber: i,
        thumbnail:
          canvas.toDataURL(
            'image/jpeg',
            0.7
          )
      });
    }

    setPages(previews);
  };

  // SELECT PAGE

  const togglePage = (page) => {

    if (
      selectedPages.includes(page)
    ) {

      setSelectedPages(
        selectedPages.filter(
          (p) => p !== page
        )
      );

    } else {

      setSelectedPages([
        ...selectedPages,
        page
      ]);
    }
  };

  // EXTRACT

  const extractPages = async () => {

    if (!file) return;

    try {

      setLoading(true);

      const buffer =
        await file.arrayBuffer();

      const sourcePdf =
        await PDFDocument.load(
          buffer
        );

      const newPdf =
        await PDFDocument.create();

      const copiedPages =
        await newPdf.copyPages(
          sourcePdf,
          selectedPages.map(
            (p) => p - 1
          )
        );

      copiedPages.forEach(
        (page) =>
          newPdf.addPage(page)
      );

      const pdfBytes =
        await newPdf.save();

      const blob =
        new Blob(
          [pdfBytes],
          {
            type:
              'application/pdf'
          }
        );

      const url =
        URL.createObjectURL(blob);

      const a =
        document.createElement('a');

      a.href = url;

      a.download =
        'quickpdf-extracted.pdf';

      a.click();

      URL.revokeObjectURL(url);

    } catch (err) {

      console.error(err);

      alert(
        'Extraction failed'
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="w-full max-w-5xl mx-auto text-center">

      <h2 className="text-3xl font-bold text-white mb-8">
        Extract PDF Pages
      </h2>

      {/* UPLOAD */}

      {!file && (

        <div
          onClick={() =>
            inputRef.current?.click()
          }

          className="
            border-2 border-dashed
            border-gray-700
            hover:border-red-500
            bg-gray-900
            rounded-3xl
            p-16
            cursor-pointer
            transition
          "
        >

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"

            onChange={(e) =>
              loadPDF(
                e.target.files[0]
              )
            }
          />

          <div className="text-6xl mb-4">
            ✂️
          </div>

          <p className="text-xl text-white">
            Upload PDF
          </p>

        </div>
      )}

      {/* PAGES */}

      {pages.length > 0 && (

        <div className="mt-8">

          <div className="
            grid grid-cols-2
            md:grid-cols-4
            gap-6
          ">

            {pages.map((page) => (

              <div
                key={page.pageNumber}

                onClick={() =>
                  togglePage(
                    page.pageNumber
                  )
                }

                className={`
                  border-2 rounded-2xl
                  p-3 cursor-pointer
                  transition
                  ${
                    selectedPages.includes(
                      page.pageNumber
                    )
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-gray-700 bg-gray-900 hover:border-red-500'
                  }
                `}
              >

                <img
                  src={page.thumbnail}
                  alt=""
                  className="
                    rounded-lg
                    mb-3
                    w-full
                  "
                />

                <p className="text-white text-sm">
                  Page {page.pageNumber}
                </p>

              </div>
            ))}

          </div>

          {/* BUTTON */}

          <button
            onClick={extractPages}

            disabled={
              loading ||
              selectedPages.length === 0
            }

            className={`
              mt-8
              px-8 py-4
              rounded-2xl
              text-white
              font-medium
              transition
              ${
                loading
                  ? 'bg-gray-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            `}
          >

            {loading
              ? 'Processing...'
              : `Extract ${selectedPages.length} Pages`}

          </button>

        </div>
      )}

    </div>
  );
}