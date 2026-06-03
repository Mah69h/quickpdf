import { useState, useRef } from 'react';

import {
  PDFDocument,
  rgb,
  degrees
} from 'pdf-lib';

export default function WatermarkPDF() {

  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [text, setText] =
    useState('CONFIDENTIAL');

  const [position, setPosition] =
    useState('center');

  const [size, setSize] =
    useState(40);

  const [opacity, setOpacity] =
    useState(0.3);

  const inputRef = useRef(null);

  const addWatermark =
    async () => {

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
          (page) => {

            const {
              width,
              height
            } =
              page.getSize();

            let x = 50;
            let y = 50;

            switch (
              position
            ) {

              case 'center':

                x =
                  width / 2 -
                  size * 2;

                y =
                  height / 2;

                break;

              case 'top-left':

                x = 30;

                y =
                  height - 60;

                break;

              case 'top-right':

                x =
                  width - 220;

                y =
                  height - 60;

                break;

              case 'bottom-left':

                x = 30;

                y = 40;

                break;

              case 'bottom-right':

                x =
                  width - 220;

                y = 40;

                break;

              default:

                break;
            }

            page.drawText(
              text,
              {

                x,

                y,

                size,

                rotate:
                  position ===
                  'center'
                    ? degrees(
                        45
                      )
                    : degrees(
                        0
                      ),

                color:
                  rgb(
                    0.7,
                    0.7,
                    0.7
                  ),

                opacity
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
          URL.createObjectURL(
            blob
          );

        const a =
          document.createElement(
            'a'
          );

        a.href = url;

        a.download =
          'quickpdf-watermarked.pdf';

        a.click();

        URL.revokeObjectURL(
          url
        );

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

      {file && (

        <div className="space-y-5">

          <div className="
            bg-gray-900
            border border-gray-800
            rounded-2xl
            p-4 text-left
          ">

            <p className="text-white truncate">
              {file.name}
            </p>

          </div>

          <input
            value={text}

            onChange={(e) =>
              setText(
                e.target.value
              )
            }

            placeholder="Watermark Text"

            className="
              w-full
              bg-gray-900
              border border-gray-700
              rounded-xl
              px-4 py-3
              text-white
            "
          />

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
              rounded-xl
              px-4 py-3
              text-white
            "
          >

            <option value="center">
              Center
            </option>

            <option value="top-left">
              Top Left
            </option>

            <option value="top-right">
              Top Right
            </option>

            <option value="bottom-left">
              Bottom Left
            </option>

            <option value="bottom-right">
              Bottom Right
            </option>

          </select>

          <div>

            <p className="text-gray-400 mb-2">
              Font Size
            </p>

            <input
              type="range"

              min="20"

              max="80"

              value={size}

              onChange={(e) =>
                setSize(
                  Number(
                    e.target.value
                  )
                )
              }

              className="w-full"
            />

          </div>

          <div>

            <p className="text-gray-400 mb-2">
              Opacity
            </p>

            <input
              type="range"

              min="0.1"

              max="1"

              step="0.1"

              value={opacity}

              onChange={(e) =>
                setOpacity(
                  Number(
                    e.target.value
                  )
                )
              }

              className="w-full"
            />

          </div>

          <button
            onClick={
              addWatermark
            }

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
              : 'Add Watermark'}

          </button>

        </div>
      )}

    </div>
  );
}