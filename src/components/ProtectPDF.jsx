import { useState, useRef } from 'react';

import {
  PDFDocument
} from 'pdf-lib';

export default function ProtectPDF() {

  const [file, setFile] =
    useState(null);

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const inputRef = useRef(null);

  // PROTECT PDF

  const protectPDF = async () => {

    if (!file || !password)
      return;

    try {

      setLoading(true);

      const buffer =
        await file.arrayBuffer();

      const pdfDoc =
        await PDFDocument.load(
          buffer
        );

      // ENCRYPT

      await pdfDoc.encrypt({

        userPassword: password,

        ownerPassword: password,

        permissions: {

          printing: 'highResolution',

          modifying: false,

          copying: false,

          annotating: false
        }
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
        'quickpdf-protected.pdf';

      a.click();

      URL.revokeObjectURL(url);

    } catch (err) {

      console.error(err);

      alert(
        'Failed to protect PDF'
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="w-full max-w-2xl mx-auto text-center">

      <h2 className="text-3xl font-bold text-white mb-8">
        Protect PDF
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
            🔒
          </div>

          <p className="text-xl text-white">
            Upload PDF
          </p>

        </div>
      )}

      {/* SETTINGS */}

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

          {/* PASSWORD */}

          <input
            type="password"

            placeholder="Enter password"

            value={password}

            onChange={(e) =>
              setPassword(
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

          {/* BUTTON */}

          <button
            onClick={protectPDF}

            disabled={
              loading || !password
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
              : 'Protect PDF'}

          </button>

        </div>
      )}

    </div>
  );
}