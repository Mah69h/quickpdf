import { useState, useRef } from 'react';

import {
  PDFDocument,
  rgb
} from 'pdf-lib';

export default function PageNumbersPDF() {

  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [position, setPosition] =
    useState('bottom-center');

  const [fontSize, setFontSize] =
    useState(12);

  const inputRef = useRef(null);

  // ADD PAGE NUMBERS

  const addPageNumbers = async () => {

    if (!file) return;

    try {

      setLoading(true);

      const buffer =
        await file.arrayBuffer();

      const pdfDoc =
        await PDFDocument.load(
          buffer
        );

      const pages =
        pdfDoc.getPages();

      pages.forEach(
        (page, index) => {

          const {
            width,
            height
          } = page.getSize();

          let x = width / 2;

          let y = 25;

          // POSITIONS

          if (position === 'top-left') {

            x = 30;
            y = height - 30;
          }

          if (position === 'top-center') {

            x = width / 2;
            y = height - 30;
          }

          if (position === 'top-right') {

            x = width - 40;
            y = height - 30;
          }

          if (position === 'bottom-left') {

            x = 30;
            y = 25;
          }

          if (position === 'bottom-center') {

            x = width / 2;
            y = 25;
          }

          if (position === 'bottom-right') {

            x = width - 40;
            y = 25;
          }

          page.drawText(
            `${index + 1}`,
            {

              x,

              y,

              size: Number(fontSize),

              color: rgb(
                0.5,
                0.5,
                0.5
              )
            }
          );
        }
      );

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
        'quickpdf-page-numbers.pdf';

      a.click();

      URL.revokeObjectURL(url);

    } catch (err) {

      console.error(err);

      alert(
        'Failed to add page numbers'
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="w-full max-w-2xl mx-auto text-center">

      <h2 className="text-3xl font-bold text-white mb-8">
        Add Page Numbers
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
              setFile(
                e.target.files[0]
              )
            }
          />

          <div className="text-6xl mb-4">
            🔢
          </div>

          <p className="text-xl text-white">
            Upload PDF
          </p>

        </div>
      )}

      {/* FILE CARD */}

      {file && (

        <div className="space-y-5">

          <div className="
            bg-gray-900
            border border-gray-800
            rounded-2xl
            p-5 text-left
          ">

            <p className="text-white font-medium truncate">
              {file.name}
            </p>

          </div>

          {/* POSITION */}

          <select
            value={position}

            onChange={(e) =>
              setPosition(
                e.target.value
              )
            }

            className="
              w-full
              bg-gray-900
              border border-gray-700
              focus:border-red-500
              outline-none
              rounded-2xl
              px-5 py-4
              text-white
            "
          >

            <option value="top-left">
              Top Left
            </option>

            <option value="top-center">
              Top Center
            </option>

            <option value="top-right">
              Top Right
            </option>

            <option value="bottom-left">
              Bottom Left
            </option>

            <option value="bottom-center">
              Bottom Center
            </option>

            <option value="bottom-right">
              Bottom Right
            </option>

          </select>

          {/* FONT SIZE */}

          <div className="text-left">

            <label className="text-gray-300 text-sm">
              Font Size
            </label>

            <input
              type="range"

              min="8"

              max="40"

              value={fontSize}

              onChange={(e) =>
                setFontSize(
                  e.target.value
                )
              }

              className="w-full mt-2"
            />

            <p className="text-gray-500 text-sm mt-1">
              {fontSize}px
            </p>

          </div>

          {/* BUTTON */}

          <button
            onClick={addPageNumbers}

            disabled={loading}

            className={`
              w-full py-4 rounded-2xl
              text-white font-medium
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
              : 'Add Page Numbers'}

          </button>

        </div>
      )}

    </div>
  );
}