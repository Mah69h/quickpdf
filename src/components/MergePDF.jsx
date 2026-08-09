import { useState, useRef } from 'react';

import { PDFDocument } from 'pdf-lib';

import * as pdfjsLib from 'pdfjs-dist';

import ToolWorkspace from '../components/ToolWorkspace';

import {
  DndContext,
  closestCenter
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// ─────────────────────────────────────────────
// SORTABLE ITEM
// ─────────────────────────────────────────────

function SortableItem({
  fileData,
  index,
  removeFile
}) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: fileData.id
  });

  const style = {
    transform:
      CSS.Transform.toString(transform),
    transition
  };

  return (

    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-2xl p-4"
    >

      <div
         className="
    h-80
    bg-gray-800
    rounded-xl
    overflow-hidden
    flex
    items-center
    justify-center
    mb-4
  "
>
  <img
    src={fileData.thumbnail}
    alt=""
    className="
      max-h-full
      object-contain
    "
  />

        <div className="text-left flex-1 min-w-0">

          <p className="text-white font-medium truncate">
            {fileData.file.name}
          </p>

          <p className="text-gray-500 text-sm mt-1">

            {(
              fileData.file.size /
              (1024 * 1024)
            ).toFixed(2)} MB

            {fileData.pageCount && (
              <> • {fileData.pageCount} pages</>
            )}

          </p>

        </div>

      </div>

      <button
        onClick={() =>
          removeFile(index)
        }
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-white transition ml-4"
      >
        Remove
      </button>

    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function MergePDF() {

  const [files, setFiles] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [isDragOver, setIsDragOver] =
    useState(false);

  const inputRef = useRef(null);

  // ─────────────────────────────────────────────
  // GENERATE THUMBNAIL
  // ─────────────────────────────────────────────

  const generateThumbnail =
  async (file) => {

    // ORIGINAL BUFFER
    const originalBuffer =
      await file.arrayBuffer();

    // COPY FOR PDF.JS
    const previewBuffer =
      originalBuffer.slice(0);

    const typedArray =
      new Uint8Array(previewBuffer);

    const pdf =
      await pdfjsLib.getDocument({
        data: typedArray
      }).promise;

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

    const thumbnail =
      canvas.toDataURL(
        'image/jpeg',
        0.7
      );

    return {

      thumbnail,

      // SAVE FRESH BUFFER
      buffer: originalBuffer.slice(0),

      pageCount: pdf.numPages
    };
  };
  
  // ─────────────────────────────────────────────
  // ADD FILES
  // ─────────────────────────────────────────────

const addFiles = async (newFiles) => {

  const pdfFiles =
    Array.from(newFiles).filter(
      (file) =>
        file.type === 'application/pdf'
    );

  for (const file of pdfFiles) {

    try {

      const exists =
        files.some(
          (item) =>
            item.file.name === file.name &&
            item.file.size === file.size
        );

      if (exists) continue;

      const {
        thumbnail,
        buffer,
        pageCount
      } =
        await generateThumbnail(file);

      const newItem = {

        id: Date.now() + Math.random(),

        file,

        thumbnail,

        buffer,

        pageCount
      };

      setFiles((prev) => [
        ...prev,
        newItem
      ]);

    } catch (err) {

      console.error(err);
    }
  }
};

  // ─────────────────────────────────────────────
  // DROP HANDLER
  // ─────────────────────────────────────────────

  const handleDrop =
    async (e) => {

      e.preventDefault();

      setIsDragOver(false);

      const droppedFiles =
        Array.from(
          e.dataTransfer.files
        );

      await addFiles(
        droppedFiles
      );
    };

  // ─────────────────────────────────────────────
  // REMOVE FILE
  // ─────────────────────────────────────────────

  const removeFile = (index) => {

    const updated =
      files.filter(
        (_, i) => i !== index
      );

    setFiles(updated);
  };

  // ─────────────────────────────────────────────
  // DRAG SORT
  // ─────────────────────────────────────────────

  const handleDragEnd =
    (event) => {

      const {
        active,
        over
      } = event;

      if (
        !over ||
        active.id === over.id
      ) {
        return;
      }

      const oldIndex =
        files.findIndex(
          (item) =>
            item.id === active.id
        );

      const newIndex =
        files.findIndex(
          (item) =>
            item.id === over.id
        );

      setFiles(
        arrayMove(
          files,
          oldIndex,
          newIndex
        )
      );
    };

  // ─────────────────────────────────────────────
  // MERGE PDFs
  // ─────────────────────────────────────────────

  const mergePDFs =
    async () => {

      if (files.length === 0)
        return;

      try {

        setLoading(true);

        setProgress(0);

        const mergedPdf =
          await PDFDocument.create();

        for (
          let i = 0;
          i < files.length;
          i++
        ) {

          const item =
            files[i];

          const pdf =
            await PDFDocument.load(
              item.buffer,
              {
                ignoreEncryption: true
              }
            );

          const copiedPages =
            await mergedPdf.copyPages(
              pdf,
              pdf.getPageIndices()
            );

          copiedPages.forEach(
            (page) =>
              mergedPdf.addPage(
                page
              )
          );

          setProgress(
            Math.round(
              ((i + 1) /
                files.length) *
                100
            )
          );
        }

        const mergedBytes =
          await mergedPdf.save();

        const blob =
          new Blob(
            [mergedBytes],
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
          'quickpdf-merged.pdf';

        a.click();

        setTimeout(() => {

          URL.revokeObjectURL(
            url
          );

        }, 5000);

      } catch (err) {

        console.error(err);

        alert(
          'Failed to merge PDFs'
        );

      } finally {

        setLoading(false);

        setProgress(0);
      }
    };

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────

  return (

  <ToolWorkspace
    title="Merge PDF"

    sidebar={

<div
  className="
    mt-6
    flex
    flex-wrap
    gap-6
    justify-center
  "
>

        <h2 className="text-2xl font-bold">
          Merge PDF
        </h2>

<div
  className="
    w-72
    bg-gray-900
    border border-gray-800
    rounded-2xl
    p-4
    hover:border-red-500
    transition
    cursor-grab
  "
>
          Upload multiple PDFs and arrange
          them in the order you want.
        </div>

        <button
          className="
            w-full
            bg-red-600
            hover:bg-red-700
            py-4
            rounded-xl
            font-semibold
          "
        >
          Merge PDF
        </button>

      </div>

    }

  >


{/* UPLOAD AREA */}

{files.length === 0 ? (

  <div
    onClick={() =>
      inputRef.current?.click()
    }

    onDragOver={(e) => {

      e.preventDefault();

      setIsDragOver(true);
    }}

    onDragLeave={() =>
      setIsDragOver(false)
    }

    onDrop={handleDrop}

className={`w-full h-[420px]
  border-2 border-dashed
  rounded-3xl
  cursor-pointer
  transition-all duration-200
  flex items-center justify-center
  ${
    isDragOver
      ? 'border-red-500 bg-gray-900'
      : 'border-gray-700 bg-gray-900 hover:border-red-500'
  }`}
  >

    <input
      ref={inputRef}
      type="file"
      multiple
      accept="application/pdf"
      className="hidden"

      onChange={async (e) => {

        const selectedFiles =
          Array.from(
            e.target.files
          );

        await addFiles(
          selectedFiles
        );
      }}
    />

<div className="text-center">

  <div className="text-6xl mb-5">
    📄
  </div>

  <p className="text-2xl text-white font-semibold">
    Drag & drop PDFs here
  </p>

  <p className="text-sm text-gray-500 mt-3">
    Fast • Secure • Local Processing
  </p>

</div>

  </div>

) : (

  <div className="flex justify-end mb-5">

    <button
      onClick={() =>
        inputRef.current?.click()
      }

      className="
        group
        flex items-center gap-3
        bg-gray-900
        border border-gray-800
        hover:border-red-500
        hover:bg-gray-800
        px-5 py-3
        rounded-2xl
        transition-all duration-200
        shadow-lg
      "
    >

     <div
  className="
    w-10 h-10
    rounded-xl
    bg-red-600
    group-hover:bg-red-500
    flex items-center justify-center
    transition
  "
>

  <span className="text-white text-3xl leading-none -mt-1">
    +
  </span>

</div>

      <div className="text-left">

        <p className="text-white text-sm font-medium">
          Add Files
        </p>

        <p className="text-gray-500 text-xs">
          Add more PDFs
        </p>

      </div>

    </button>

    <input
      ref={inputRef}
      type="file"
      multiple
      accept="application/pdf"
      className="hidden"

      onChange={async (e) => {

        const selectedFiles =
          Array.from(
            e.target.files
          );

        await addFiles(
          selectedFiles
        );
      }}
    />

  </div>
)}
      {/* FILE LIST */}

      {files.length > 0 && (

        <div className="mt-6 space-y-4">

          <DndContext
            collisionDetection={
              closestCenter
            }

            onDragEnd={
              handleDragEnd
            }
          >

            <SortableContext
              items={files.map(
                (f) => f.id
              )}

              strategy={
                verticalListSortingStrategy
              }
            >

              {files.map(
                (
                  fileData,
                  index
                ) => (

                  <SortableItem
                    key={
                      fileData.id
                    }

                    fileData={
                      fileData
                    }

                    index={index}

                    removeFile={
                      removeFile
                    }
                  />
                )
              )}

            </SortableContext>

          </DndContext>

        </div>
      )}

      {/* PROGRESS */}

      {loading && (

        <div className="mt-6">

          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">

            <div
              className="bg-red-600 h-full transition-all duration-300"
              style={{
                width:
                  `${progress}%`
              }}
            />

          </div>

          <p className="text-gray-400 text-sm mt-2">
            Merging...
            {' '}
            {progress}%
          </p>

        </div>
      )}

      {/* BUTTON */}

      {files.length > 0 && (

        <button

          onClick={mergePDFs}

          disabled={loading}

          className={`w-full mt-6 py-4 rounded-2xl text-white font-medium transition ${
            loading
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >

          {loading
            ? 'Processing...'
            : `Merge ${files.length} PDF${files.length !== 1 ? 's' : ''}`}

        </button>
      )}

      {/* FOOTER */}

      <div className="flex justify-center gap-6 mt-10 text-gray-600 text-xs">

        <div>
          🔒 Local Processing
        </div>

        <div>
          ⚡ Fast Merging
        </div>

        <div>
          ∞ No Limits
        </div>

      </div>

    </ToolWorkspace>
  );
}