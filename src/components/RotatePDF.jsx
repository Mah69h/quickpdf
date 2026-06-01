import { useState, useRef } from 'react';

import { PDFDocument, degrees } from 'pdf-lib';

import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

export default function RotatePDF() {

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

  // ROTATE

  const rotatePages = async (angle) => {

    if (!file) return;

    try {

      setLoading(true);

      const buffer =
        await file.arrayBuffer();

      const pdfDoc =
        await PDFDocument.load(
          buffer
        );

      const targetPages =
        selectedPages.length > 0
          ? selectedPages
          : pages.map(
              (p) => p.pageNumber
            );

      targetPages.forEach((pageNum) => {

        const page =
          pdfDoc.getPage(
            pageNum - 1
          );

        const currentRotation =
          page.getRotation().angle;

        page.setRotation(
          degrees(
            currentRotation + angle
          )
        );
      });

      const pdfBytes =
        await pdfDoc.save();

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
        'quickpdf-rotated.pdf';

      a.click();

      URL.revokeObjectURL(url);

    } catch (err) {

      console.error(err);

      alert(
        'Rotation failed'
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="w-full max-w-5xl mx-auto text-center">

      <h2 className="text-3xl font-bold text-white mb-8">
        Rotate PDF
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
            🔄
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

          {/* BUTTONS */}

          <div className="
            flex justify-center gap-4
            mt-8 flex-wrap
          ">

            <button
              onClick={() =>
                rotatePages(-90)
              }

              disabled={loading}

              className="
                bg-gray-800
                hover:bg-gray-700
                px-6 py-3
                rounded-2xl
                text-white
                transition
              "
            >
              ↺ Rotate Left
            </button>

            <button
              onClick={() =>
                rotatePages(90)
              }

              disabled={loading}

              className="
                bg-red-600
                hover:bg-red-700
                px-6 py-3
                rounded-2xl
                text-white
                transition
              "
            >
              ↻ Rotate Right
            </button>

          </div>

        </div>
      )}

    </div>
  );
}