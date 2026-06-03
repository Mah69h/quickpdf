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

  const inputRef = useRef(null);

 const [position, setPosition] = useState("top-left");

const [size, setSize] = useState(40);

const [opacity, setOpacity] = useState(30);

const [rotation, setRotation] = useState(45);

const [color, setColor] = useState("#ff4d4f");

const [fontFamily, setFontFamily] =
  useState("Helvetica");

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

  <div className="
  relative
  h-72
  bg-gray-900
  border border-gray-700
  rounded-2xl
  overflow-hidden
">

  <div
    className="absolute"
    style={{
      color,
      opacity: opacity / 100,
      fontSize: `${size}px`,
      fontWeight: bold ? 700 : 400,
      fontStyle: italic ? "italic" : "normal",
      transform: `rotate(${rotation}deg)`,

      top:
        position.includes("top")
          ? "10%"
          : position.includes("bottom")
          ? "80%"
          : "50%",

      left:
        position.includes("left")
          ? "10%"
          : position.includes("right")
          ? "75%"
          : "50%"
    }}
  >
    {text}
  </div>

</div>
  {/* POSITION */}

  <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">

  <p className="text-white font-medium mb-4">
    Position
  </p>

  <div className="flex items-start gap-6">

    <div className="grid grid-cols-3 gap-1">

      {[
        "top-left",
        "top-center",
        "top-right",

        "middle-left",
        "center",
        "middle-right",

        "bottom-left",
        "bottom-center",
        "bottom-right"
      ].map((item) => (

        <button
          key={item}
          onClick={() =>
            setPosition(item)
          }
          className={`
            w-10 h-10 rounded
            border

            ${
              position === item
                ? "bg-red-500 border-red-500"
                : "bg-gray-800 border-gray-600"
            }
          `}
        />

      ))}

    </div>

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

      Mosaic

    </label>

  </div>

</div>

  {/* FONT */}

  <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">

  <p className="text-white font-medium mb-4">
    Text Format
  </p>

  <div className="flex flex-wrap gap-3">

    <select
  value={fontFamily}
  onChange={(e) =>
    setFontFamily(e.target.value)
  }
  className="
    bg-gray-800
    px-3 py-2
    rounded-lg
    text-white
  "
>

  <option value="Arial">Arial</option>
  <option value="Helvetica">Helvetica</option>
  <option value="Verdana">Verdana</option>
  <option value="Tahoma">Tahoma</option>
  <option value="Trebuchet MS">Trebuchet MS</option>
  <option value="Times New Roman">Times New Roman</option>
  <option value="Georgia">Georgia</option>
  <option value="Garamond">Garamond</option>
  <option value="Courier New">Courier New</option>
  <option value="Brush Script MT">Brush Script MT</option>
  <option value="Impact">Impact</option>
  <option value="Comic Sans MS">Comic Sans MS</option>
  <option value="Lucida Sans">Lucida Sans</option>
  <option value="Palatino">Palatino</option>
  <option value="Bookman">Bookman</option>
  <option value="Candara">Candara</option>
  <option value="Century Gothic">Century Gothic</option>
  <option value="Franklin Gothic Medium">
    Franklin Gothic
  </option>
  <option value="Segoe UI">Segoe UI</option>
  <option value="Calibri">Calibri</option>

</select>

    <button
      onClick={() =>
        setBold(!bold)
      }
      className={`
        px-4 py-2 rounded-lg

        ${
          bold
            ? "bg-red-600"
            : "bg-gray-800"
        }
      `}
    >
      B
    </button>

    <button
      onClick={() =>
        setItalic(!italic)
      }
      className={`
        px-4 py-2 rounded-lg

        ${
          italic
            ? "bg-red-600"
            : "bg-gray-800"
        }
      `}
    >
      I
    </button>

    <input
      type="color"
      value={color}
      onChange={(e) =>
        setColor(
          e.target.value
        )
      }
      className="w-12 h-10"
    />

  </div>

</div>

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

 <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">

  <p className="text-white mb-3">
    Transparency
  </p>

  <select
    value={opacity}
    onChange={(e) =>
      setOpacity(
        Number(e.target.value)
      )
    }
    className="
      w-full
      bg-gray-800
      rounded-xl
      px-4 py-3
      text-white
    "
  >

    <option value={0}>
      No Transparency
    </option>

    <option value={20}>
      20%
    </option>

    <option value={40}>
      40%
    </option>

    <option value={60}>
      60%
    </option>

    <option value={80}>
      80%
    </option>

  </select>

</div>

  {/* ROTATION */}

  <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">

  <p className="text-white mb-3">
    Rotation
  </p>

  <select
    value={rotation}
    onChange={(e) =>
      setRotation(
        Number(
          e.target.value
        )
      )
    }
    className="
      w-full
      bg-gray-800
      rounded-xl
      px-4 py-3
      text-white
    "
  >

    <option value={0}>
      0°
    </option>

    <option value={45}>
      45°
    </option>

    <option value={90}>
      90°
    </option>

    <option value={135}>
      135°
    </option>

    <option value={180}>
      180°
    </option>

  </select>

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