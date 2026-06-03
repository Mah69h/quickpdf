import { useState, useRef } from 'react';

import {
  PDFDocument,
  rgb,
  degrees
} from 'pdf-lib';

import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc =
'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

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
    
const [thumbnails, setThumbnails] =
  useState([]);

const [totalPages, setTotalPages] =
  useState(0);

  const [mosaic, setMosaic] =
  useState(false);

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

if (mosaic) {

  for (
    let mx = 0;
    mx < width;
    mx += 220
  ) {

    for (
      let my = 0;
      my < height;
      my += 180
    ) {

      page.drawText(
        text,
        {
          x: mx,
          y: my,
          size,
          rotate: degrees(45),
          color: rgb(
            0.7,
            0.7,
            0.7
          ),
          opacity
        }
      );
    }
  }

} else {

  page.drawText(
    text,
    {
      x,
      y,
      size,
      rotate:
        position === 'center'
          ? degrees(45)
          : degrees(0),

      color: rgb(
        0.7,
        0.7,
        0.7
      ),

      opacity
    }
  );

}
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

 onChange={async (e) => {

  const selectedFile =
    e.target.files[0];

  if (!selectedFile) return;

  setFile(selectedFile);

  const buffer =
    await selectedFile.arrayBuffer();

  const pdf =
    await pdfjsLib.getDocument({
      data: buffer
    }).promise;

  setTotalPages(pdf.numPages);

  const generatedThumbs = [];

  const previewPages =
    Math.min(pdf.numPages, 4);

  for (
    let i = 1;
    i <= previewPages;
    i++
  ) {

    const page =
      await pdf.getPage(i);

    const viewport =
      page.getViewport({
        scale: 0.25
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

    generatedThumbs.push(
      canvas.toDataURL()
    );
  }

  setThumbnails(
    generatedThumbs
  );
}}
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

{thumbnails.length > 0 && (

<div className="
  bg-gray-900
  border border-gray-700
  rounded-2xl
  p-5
">

  <p className="
    text-gray-400
    text-sm
    mb-4
  ">
    Preview
  </p>

  <div className="
    flex gap-3
    justify-center
    flex-wrap
  ">

    {thumbnails.map(
      (thumb, index) => (

        <div
          key={index}
          className="relative"
        >

          <img
            src={thumb}
            alt={`Page ${index + 1}`}
            className="
              w-24
              border
              border-gray-700
              rounded-lg
            "
          />

          {mosaic ? (

            <div className="
              absolute
              inset-0
              flex
              flex-wrap
              gap-1
              p-2
            ">
              {Array.from({
                length: 9
              }).map((_, i) => (

                <div
                  key={i}
                  className="
                    w-2 h-2
                    bg-red-500
                    rounded-full
                  "
                />

              ))}
            </div>

          ) : (

            <div
              className="
                absolute
                w-3 h-3
                bg-red-500
                rounded-full
              "
              style={{
                left:
                  position.includes('right')
                    ? '75%'
                    : position.includes('left')
                    ? '15%'
                    : '45%',

                top:
                  position.includes('top')
                    ? '15%'
                    : position.includes('bottom')
                    ? '75%'
                    : '45%'
              }}
            />

          )}

        </div>

      )
    )}

  </div>

  {totalPages > 4 && (

    <p className="
      text-gray-500
      text-sm
      mt-4
    ">
      + {totalPages - 4} more pages
    </p>

  )}

</div>

)}

            <p className="text-gray-400 mb-2">
  Font Size: {size}px
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
  Opacity: {Math.round(opacity * 100)}%
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

<label className="flex items-center gap-3 text-gray-400 mb-2">

  <input
    type="checkbox"
    checked={mosaic}
    onChange={(e) =>
      setMosaic(
        e.target.checked
      )
    }
  />

  Mosaic Watermark

</label>

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