import { useState, useRef } from 'react';

import { PDFDocument } from 'pdf-lib';

export default function MetadataRemoverPDF() {

  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const inputRef =
    useRef(null);

  const removeMetadata =
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

        // REMOVE METADATA

        pdfDoc.setTitle('');

        pdfDoc.setAuthor('');

        pdfDoc.setSubject('');

        pdfDoc.setKeywords([]);

        pdfDoc.setProducer('');

        pdfDoc.setCreator('');

        pdfDoc.setCreationDate(
          new Date(0)
        );

        pdfDoc.setModificationDate(
          new Date(0)
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
          'quickpdf-clean.pdf';

        a.click();

        URL.revokeObjectURL(
          url
        );

      } catch (err) {

        console.error(err);

        alert(
          'Failed to remove metadata'
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="w-full max-w-2xl mx-auto text-center">

      <h2 className="text-3xl font-bold text-white mb-8">
        Remove PDF Metadata
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
            🧹
          </div>

          <p className="text-xl text-white">
            Upload PDF
          </p>

          <p className="text-gray-500 mt-2">
            Remove author, creator,
            producer and hidden metadata
          </p>

        </div>

      )}

      {file && (

        <div className="space-y-5">

          <div
            className="
              bg-gray-900
              border border-gray-800
              rounded-2xl
              p-5
              text-left
            "
          >

            <p className="text-white font-medium truncate">
              {file.name}
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Metadata will be permanently removed.
            </p>

          </div>

          <button
            onClick={
              removeMetadata
            }

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
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }
            `}
          >

            {loading
              ? 'Processing...'
              : 'Remove Metadata'}

          </button>

        </div>

      )}

      <div className="
        flex
        justify-center
        gap-6
        mt-10
        text-gray-600
        text-xs
      ">

        <div>
          🔒 Privacy Focused
        </div>

        <div>
          ⚡ Instant Processing
        </div>

        <div>
          💻 100% Local
        </div>

      </div>

    </div>
  );
}