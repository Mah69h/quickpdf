import { useState, useRef } from 'react';

import { PDFDocument } from 'pdf-lib';

export default function CropPDF() {

  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [topCrop, setTopCrop] =
    useState(20);

  const [bottomCrop, setBottomCrop] =
    useState(20);

  const [leftCrop, setLeftCrop] =
    useState(20);

  const [rightCrop, setRightCrop] =
    useState(20);

  const inputRef =
    useRef(null);

  const cropPDF =
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

            const cropWidth =
              width -
              leftCrop -
              rightCrop;

            const cropHeight =
              height -
              topCrop -
              bottomCrop;

            if (
              cropWidth <= 0 ||
              cropHeight <= 0
            ) {
              return;
            }

            page.setCropBox(
              leftCrop,
              bottomCrop,
              cropWidth,
              cropHeight
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
          'quickpdf-cropped.pdf';

        a.click();

        URL.revokeObjectURL(
          url
        );

      } catch (err) {

        console.error(err);

        alert(
          'Failed to crop PDF'
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="w-full max-w-2xl mx-auto text-center">

      <h2 className="text-3xl font-bold text-white mb-8">
        Crop PDF
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
            ✂️
          </div>

          <p className="text-xl text-white">
            Upload PDF
          </p>

          <p className="text-gray-500 mt-2">
            Crop all pages equally
          </p>

        </div>

      )}

      {file && (

        <div className="space-y-6">

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

          {/* PREVIEW */}

          <div className="
            bg-gray-900
            border border-gray-700
            rounded-2xl
            p-8
          ">

            <div
              className="
                mx-auto
                relative
                bg-white
              "

              style={{
                width: '220px',
                height: '300px'
              }}
            >

              <div
                className="
                  absolute
                  border-4
                  border-red-500
                "

                style={{
                  top:
                    `${topCrop / 2}px`,
                  bottom:
                    `${bottomCrop / 2}px`,
                  left:
                    `${leftCrop / 2}px`,
                  right:
                    `${rightCrop / 2}px`
                }}
              />

            </div>

            <p className="text-gray-400 text-sm mt-4">
              Preview of crop area
            </p>

          </div>

          {/* TOP */}

          <div>

            <p className="text-gray-400 mb-2">
              Top Crop:
              {' '}
              {topCrop}px
            </p>

            <input
              type="range"
              min="0"
              max="150"
              value={topCrop}

              onChange={(e) =>
                setTopCrop(
                  Number(
                    e.target.value
                  )
                )
              }

              className="w-full"
            />

          </div>

          {/* BOTTOM */}

          <div>

            <p className="text-gray-400 mb-2">
              Bottom Crop:
              {' '}
              {bottomCrop}px
            </p>

            <input
              type="range"
              min="0"
              max="150"
              value={bottomCrop}

              onChange={(e) =>
                setBottomCrop(
                  Number(
                    e.target.value
                  )
                )
              }

              className="w-full"
            />

          </div>

          {/* LEFT */}

          <div>

            <p className="text-gray-400 mb-2">
              Left Crop:
              {' '}
              {leftCrop}px
            </p>

            <input
              type="range"
              min="0"
              max="150"
              value={leftCrop}

              onChange={(e) =>
                setLeftCrop(
                  Number(
                    e.target.value
                  )
                )
              }

              className="w-full"
            />

          </div>

          {/* RIGHT */}

          <div>

            <p className="text-gray-400 mb-2">
              Right Crop:
              {' '}
              {rightCrop}px
            </p>

            <input
              type="range"
              min="0"
              max="150"
              value={rightCrop}

              onChange={(e) =>
                setRightCrop(
                  Number(
                    e.target.value
                  )
                )
              }

              className="w-full"
            />

          </div>

          <button
            onClick={cropPDF}

            disabled={loading}

            className={`

              w-full
              py-4
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
              : 'Crop PDF'}

          </button>

        </div>

      )}

    </div>
  );
}