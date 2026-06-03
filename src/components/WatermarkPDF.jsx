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

  const [position, setPosition] =
  useState('center');

const [size, setSize] =
  useState(40);

const [opacity, setOpacity] =
  useState(50);

const [rotation, setRotation] =
  useState(45);

const [color, setColor] =
  useState('#9ca3af');

const [fontFamily, setFontFamily] =
  useState('Helvetica');

const [bold, setBold] =
  useState(false);

const [italic, setItalic] =
  useState(false);

const [mosaic, setMosaic] =
  useState(false);

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

  {/* FILE */}

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

  {/* TEXT */}

  <input
    value={text}
    onChange={(e) =>
      setText(e.target.value)
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

  {/* LIVE PREVIEW */}

  <div
    className="
      bg-gray-900
      border border-gray-700
      rounded-2xl
      h-64
      flex
      items-center
      justify-center
      overflow-hidden
      relative
    "
  >

    {mosaic ? (

      <div className="absolute inset-0 overflow-hidden">

        {Array.from(
          { length: 18 }
        ).map((_, i) => (

          <div
            key={i}
            style={{
              color,
              opacity:
                opacity / 100,
              fontSize:
                `${size}px`,
              transform:
                `rotate(${rotation}deg)`,
              position:
                'absolute',
              left:
                `${(i % 4) * 25}%`,
              top:
                `${Math.floor(i / 4) * 20}%`
            }}
          >
            {text}
          </div>

        ))}

      </div>

    ) : (

      <div
        style={{
          color,
          opacity:
            opacity / 100,
          fontSize:
            `${size}px`,
          transform:
            `rotate(${rotation}deg)`,
          fontWeight:
            bold
              ? '700'
              : '400',
          fontStyle:
            italic
              ? 'italic'
              : 'normal',
          fontFamily
        }}
      >
        {text}
      </div>

    )}

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

    <option value="top-center">
      Top Center
    </option>

    <option value="top-right">
      Top Right
    </option>

    <option value="middle-left">
      Middle Left
    </option>

    <option value="middle-right">
      Middle Right
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

  {/* FONT */}

  <select
    value={fontFamily}
    onChange={(e) =>
      setFontFamily(
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

    <option>
      Helvetica
    </option>

    <option>
      Times New Roman
    </option>

    <option>
      Courier
    </option>

  </select>

  {/* STYLE */}

  <div className="flex gap-4">

    <label className="flex items-center gap-2 text-white">

      <input
        type="checkbox"
        checked={bold}
        onChange={(e) =>
          setBold(
            e.target.checked
          )
        }
      />

      Bold

    </label>

    <label className="flex items-center gap-2 text-white">

      <input
        type="checkbox"
        checked={italic}
        onChange={(e) =>
          setItalic(
            e.target.checked
          )
        }
      />

      Italic

    </label>

  </div>

  {/* COLOR */}

  <div>

    <p className="text-gray-400 mb-2">
      Watermark Color
    </p>

    <input
      type="color"
      value={color}
      onChange={(e) =>
        setColor(
          e.target.value
        )
      }
      className="
        w-full h-12
        rounded-lg
      "
    />

  </div>

  {/* SIZE */}

  <div>

    <p className="text-gray-400 mb-2">
      Font Size: {size}px
    </p>

    <input
      type="range"
      min="10"
      max="100"
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

  {/* OPACITY */}

  <div>

    <p className="text-gray-400 mb-2">
      Opacity: {opacity}%
    </p>

    <input
      type="range"
      min="0"
      max="100"
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

  {/* ROTATION */}

  <div>

    <p className="text-gray-400 mb-2">
      Rotation: {rotation}°
    </p>

    <input
      type="range"
      min="0"
      max="360"
      value={rotation}
      onChange={(e) =>
        setRotation(
          Number(
            e.target.value
          )
        )
      }
      className="w-full"
    />

  </div>

  {/* MOSAIC */}

  <label className="flex items-center gap-3 text-white">

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

</div>
      )}

    </div>
  );
}