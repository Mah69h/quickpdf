import { useState, useRef } from 'react';

import {
  PDFDocument,
  rgb,
  degrees
} from 'pdf-lib';

export default function WatermarkPDF() {

  const [file, setFile] =
    useState(null);

  const [text, setText] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const inputRef = useRef(null);

  // ADD WATERMARK

  const addWatermark = async () => {

    if (!file || !text) return;

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

      pages.forEach((page) => {

        const {
          width,
          height
        } = page.getSize();

        page.drawText(text, {

          x: width / 2 - 120,

          y: height / 2,

          size: 40,

          rotate: degrees(-35),

          color: rgb(
            0.8,
            0.8,
            0.8
          ),

          opacity: 0.35
        });
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
        'quickpdf-watermarked.pdf';

      a.click();

      URL.revokeObjectURL(url);

    } catch (err) {

      console.error(err);

      alert(
        'Failed to add watermark'
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="w-full max-w-2xl mx-auto text-center">

      <h2 className="text-3xl font-bold text-white mb-8">
        Watermark PDF
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
            💧
          </div>

          <p className="text-xl text-white">
            Upload PDF
          </p>

        </div>
      )}

      {/* WATERMARK INPUT */}

      {file && (

        <div className="space-y-5">

          <div className="
            bg-gray-900
            border border-gray-800
            rounded-2xl
            p-5
            text-left
          ">

            <p className="text-white font-medium truncate">
              {file.name}
            </p>

          </div>

          <input
            type="text"

            placeholder="Enter watermark text"

            value={text}

            onChange={(e) =>
              setText(
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
          />

          <button
            onClick={addWatermark}

            disabled={
              loading || !text
            }

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
              : 'Add Watermark'}

          </button>

        </div>
      )}

    </div>
  );
}