import { useState } from 'react';

import { PDFDocument } from 'pdf-lib';

import JSZip from 'jszip';

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function SplitPDF() {

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [pages, setPages] = useState('');

  const [pageCount, setPageCount] = useState(0);

  const [thumbnail, setThumbnail] = useState(null);

  // ─────────────────────────────────────────────
  // Parse Pages
  // ─────────────────────────────────────────────

  const parsePages = (
    input,
    totalPages
  ) => {

    let result = [];

    input.split(',').forEach((part) => {

      if (part.includes('-')) {

        let [start, end] =
          part.split('-').map(Number);

        for (
          let i = start;
          i <= end;
          i++
        ) {
          result.push(i - 1);
        }

      } else {

        result.push(Number(part) - 1);
      }
    });

    return result
      .filter(
        (p) =>
          p >= 0 &&
          p < totalPages
      )
      .filter(
        (p, index, self) =>
          self.indexOf(p) === index
      );
  };

  // ─────────────────────────────────────────────
  // Generate Preview + Meta
  // ─────────────────────────────────────────────

  const generatePreview =
    async (selectedFile) => {

      const buffer =
        await selectedFile.arrayBuffer();

      const typedArray =
        new Uint8Array(buffer);

      const pdf =
        await pdfjsLib.getDocument({
          data: typedArray
        }).promise;

      setPageCount(pdf.numPages);

      const page =
        await pdf.getPage(1);

      const viewport =
        page.getViewport({
          scale: 0.35
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

      setThumbnail(
        canvas.toDataURL(
          'image/jpeg',
          0.7
        )
      );
    };

  // ─────────────────────────────────────────────
  // Handle File
  // ─────────────────────────────────────────────

  const handleFile =
    async (selectedFile) => {

      if (
        !selectedFile ||
        selectedFile.type !==
          'application/pdf'
      ) {
        return;
      }

      setFile(selectedFile);

      await generatePreview(
        selectedFile
      );
    };

  // ─────────────────────────────────────────────
  // Split PDF
  // ─────────────────────────────────────────────

  const splitPDF = async () => {

    if (!file) return;

    try {

      setLoading(true);

      const bytes =
        await file.arrayBuffer();

      const pdf =
        await PDFDocument.load(
          bytes
        );

      const totalPages =
        pdf.getPageCount();

      const pageIndexes =
        pages
          ? parsePages(
              pages,
              totalPages
            )
          : [
              ...Array(
                totalPages
              ).keys()
            ];

      const zip =
        new JSZip();

      for (let i of pageIndexes) {

        const newPdf =
          await PDFDocument.create();

        const [page] =
          await newPdf.copyPages(
            pdf,
            [i]
          );

        newPdf.addPage(page);

        const newBytes =
          await newPdf.save();

        zip.file(
          `page-${i + 1}.pdf`,
          newBytes
        );
      }

      const zipBlob =
        await zip.generateAsync({
          type: 'blob'
        });

      const zipUrl =
        URL.createObjectURL(
          zipBlob
        );

      const a =
        document.createElement('a');

      a.href = zipUrl;

      a.download =
        'quickpdf-split.zip';

      a.click();

      setTimeout(() => {
        URL.revokeObjectURL(
          zipUrl
        );
      }, 5000);

    } catch (err) {

      console.error(err);

      alert(
        'Failed to split PDF'
      );

    } finally {

      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Combine Selected Pages
  // ─────────────────────────────────────────────

  const combineSelectedPages =
    async () => {

      if (!file) return;

      try {

        setLoading(true);

        const bytes =
          await file.arrayBuffer();

        const pdf =
          await PDFDocument.load(
            bytes
          );

        const totalPages =
          pdf.getPageCount();

        const pageIndexes =
          pages
            ? parsePages(
                pages,
                totalPages
              )
            : [
                ...Array(
                  totalPages
                ).keys()
              ];

        const newPdf =
          await PDFDocument.create();

        const copiedPages =
          await newPdf.copyPages(
            pdf,
            pageIndexes
          );

        copiedPages.forEach(
          (page) =>
            newPdf.addPage(page)
        );

        const newBytes =
          await newPdf.save();

        const blob =
          new Blob(
            [newBytes],
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
          document.createElement('a');

        a.href = url;

        a.download =
          'quickpdf-selected-pages.pdf';

        a.click();

        setTimeout(() => {
          URL.revokeObjectURL(
            url
          );
        }, 5000);

      } catch (err) {

        console.error(err);

        alert(
          'Failed to combine pages'
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="w-full max-w-2xl mx-auto text-center">

      {/* HEADER */}

      <h2 className="text-3xl font-bold text-white mb-6">
        Split PDF
      </h2>

      {/* UPLOAD BOX */}

      <div
        onClick={() =>
          document
            .getElementById(
              'splitInput'
            )
            .click()
        }

        onDragOver={(e) =>
          e.preventDefault()
        }

        onDrop={async (e) => {

          e.preventDefault();

          const droppedFile =
            e.dataTransfer
              .files[0];

          await handleFile(
            droppedFile
          );
        }}

        className="border-2 border-dashed border-gray-700 hover:border-red-500 transition rounded-3xl p-12 cursor-pointer bg-gray-900"
      >

        <input
          id="splitInput"
          type="file"
          accept="application/pdf"
          className="hidden"

          onChange={async (e) => {

            const selectedFile =
              e.target.files[0];

            await handleFile(
              selectedFile
            );
          }}
        />

        <div className="text-6xl mb-4">
          📄
        </div>

        <p className="text-xl text-white font-medium">
          Drag & drop PDF here
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Fast • Secure • Local Processing
        </p>

      </div>

      {/* FILE PREVIEW */}

      {file && (

        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-4">

          {thumbnail && (

            <img
              src={thumbnail}
              alt="PDF Preview"
              className="w-20 h-28 object-cover rounded-lg border border-gray-700"
            />
          )}

          <div className="text-left flex-1">

            <p className="text-white font-medium truncate">
              {file.name}
            </p>

            <p className="text-gray-500 text-sm mt-1">
              {(
                file.size /
                (1024 * 1024)
              ).toFixed(2)} MB
            </p>

            <p className="text-gray-500 text-sm">
              {pageCount} pages
            </p>

          </div>

          <button
            onClick={() => {

              setFile(null);

              setThumbnail(null);

              setPages('');

              setPageCount(0);
            }}

            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-white transition"
          >
            Remove
          </button>

        </div>
      )}

      {/* PAGE INPUT */}

      {file && (

        <input
          type="text"

          placeholder="Example: 1,3,5 or 2-8"

          value={pages}

          onChange={(e) =>
            setPages(
              e.target.value
            )
          }

          className="mt-6 w-full bg-gray-900 border border-gray-700 focus:border-red-500 outline-none rounded-2xl px-5 py-4 text-white"
        />
      )}

      {/* ACTION BUTTONS */}

      {file && (

        <div className="flex gap-4 mt-6">

          {/* SPLIT */}

          <button
            onClick={splitPDF}

            disabled={loading}

            className={`flex-1 py-4 rounded-2xl text-white font-medium transition ${
              loading
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >

            {loading
              ? 'Processing...'
              : 'Split PDF'}

          </button>

          {/* COMBINE */}

          <button
            onClick={
              combineSelectedPages
            }

            disabled={loading}

            className={`flex-1 py-4 rounded-2xl text-white font-medium transition ${
              loading
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >

            {loading
              ? 'Processing...'
              : 'Extract Pages'}

          </button>

        </div>
      )}

      {/* FOOTER */}

      <div className="flex justify-center gap-6 mt-10 text-gray-600 text-xs">

        <div>
          🔒 Local Processing
        </div>

        <div>
          ⚡ Fast Splitting
        </div>

        <div>
          ∞ No Limits
        </div>

      </div>

    </div>
  );
}