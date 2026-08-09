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
  useSortable,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';


// PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';


// ============================================================
// SORTABLE PDF CARD
// ============================================================

function SortablePDFCard({
  fileData,
  index,
  removeFile
}) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: fileData.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group
        w-full
        bg-[#111827]
        border
        rounded-2xl
        overflow-hidden
        transition-all
        duration-200
        ${
          isDragging
            ? 'border-red-500 shadow-2xl scale-[1.01]'
            : 'border-gray-800 hover:border-gray-700'
        }
      `}
    >

      {/* DOCUMENT ROW */}

      <div className="flex items-center gap-6 p-5">


        {/* NUMBER */}

        <div
          className="
            w-9
            h-9
            rounded-xl
            bg-red-600
            flex
            items-center
            justify-center
            text-sm
            font-bold
            text-white
            flex-shrink-0
          "
        >
          {index + 1}
        </div>


        {/* PDF PREVIEW */}

        <div
          className="
            w-[180px]
            h-[230px]
            bg-[#0a0f1c]
            rounded-xl
            border
            border-gray-800
            flex
            items-center
            justify-center
            overflow-hidden
            flex-shrink-0
          "
        >

          {fileData.thumbnail ? (

            <img
              src={fileData.thumbnail}
              alt={
                fileData.file?.name ||
                'PDF preview'
              }
              className="
                max-w-full
                max-h-full
                object-contain
                shadow-xl
              "
            />

          ) : (

            <div className="text-center">

              <div className="text-5xl mb-3">
                📄
              </div>

              <p className="text-xs text-gray-500">
                PDF Preview
              </p>

            </div>

          )}

        </div>


        {/* FILE INFORMATION */}

        <div className="flex-1 min-w-0">

          <p
            className="
              text-lg
              font-semibold
              text-white
              truncate
              mb-3
            "
            title={fileData.file?.name}
          >
            {fileData.file?.name ||
              'Untitled PDF'}
          </p>


          <div
            className="
              flex
              items-center
              gap-3
              text-sm
              text-gray-500
            "
          >

            <span>
              {fileData.file
                ? `${(
                    fileData.file.size /
                    1024 /
                    1024
                  ).toFixed(2)} MB`
                : ''}
            </span>

            <span>•</span>

            <span>
              {fileData.pageCount || 0}{' '}
              {fileData.pageCount === 1
                ? 'page'
                : 'pages'}
            </span>

          </div>


          {/* DRAG MESSAGE */}

          <p
            className="
              text-xs
              text-gray-600
              mt-5
            "
          >
            Drag the handle to change order
          </p>

        </div>


        {/* DRAG HANDLE */}

        <button
          {...attributes}
          {...listeners}
          type="button"
          className="
            cursor-grab
            active:cursor-grabbing
            text-gray-500
            hover:text-white
            px-3
            py-2
            text-xl
            transition
            flex-shrink-0
          "
          title="Drag to reorder"
        >
          ⋮⋮
        </button>


        {/* REMOVE */}

        <button
          type="button"
          onClick={() =>
            removeFile(fileData.id)
          }
          className="
            px-5
            py-3
            rounded-xl
            text-sm
            font-medium
            bg-gray-800
            text-gray-300
            hover:bg-red-600
            hover:text-white
            transition
            flex-shrink-0
          "
        >
          Remove
        </button>

      </div>

    </div>
  );
}


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function MergePDF() {
  return (
    <div className="text-6xl text-red-500 p-20">
      THIS IS THE REAL MERGE PDF
    </div>
  );

  const [files, setFiles] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [isDragOver, setIsDragOver] =
    useState(false);

  const inputRef = useRef(null);


  // ============================================================
  // GENERATE PDF THUMBNAIL
  // ============================================================

  const generateThumbnail = async (file) => {

    const originalBuffer =
      await file.arrayBuffer();

    const previewBuffer =
      originalBuffer.slice(0);

    const typedArray =
      new Uint8Array(previewBuffer);

    const pdf =
      await pdfjsLib
        .getDocument({
          data: typedArray
        })
        .promise;

    const page =
      await pdf.getPage(1);

    const viewport =
      page.getViewport({
        scale: 0.55
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
        0.8
      );

    return {
      thumbnail,
      buffer: originalBuffer.slice(0),
      pageCount: pdf.numPages
    };
  };


  // ============================================================
  // ADD FILES
  // ============================================================

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

        if (exists) {
          continue;
        }

        const {
          thumbnail,
          buffer,
          pageCount
        } =
          await generateThumbnail(file);

        const newItem = {
          id:
            Date.now() +
            Math.random(),

          file,

          thumbnail,

          buffer,

          pageCount
        };

        setFiles((prev) => [
          ...prev,
          newItem
        ]);

      } catch (error) {

        console.error(
          'Failed to process PDF:',
          error
        );

      }
    }
  };


  // ============================================================
  // DROP HANDLER
  // ============================================================

  const handleDrop = async (event) => {

    event.preventDefault();

    setIsDragOver(false);

    const droppedFiles =
      Array.from(
        event.dataTransfer.files
      );

    await addFiles(
      droppedFiles
    );
  };


  // ============================================================
  // REMOVE FILE
  // ============================================================

  const removeFile = (id) => {

    setFiles((prev) =>
      prev.filter(
        (fileData) =>
          fileData.id !== id
      )
    );
  };


  // ============================================================
  // DRAG SORT
  // ============================================================

  const handleDragEnd = (event) => {

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

    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return;
    }

    setFiles(
      arrayMove(
        files,
        oldIndex,
        newIndex
      )
    );
  };


  // ============================================================
  // MERGE PDFs
  // ============================================================

  const mergePDFs = async () => {

    if (files.length === 0) {
      return;
    }

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
            mergedPdf.addPage(page)
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
        URL.createObjectURL(blob);


      const link =
        document.createElement('a');

      link.href = url;

      link.download =
        'quickpdf-merged.pdf';

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);


      setTimeout(() => {

        URL.revokeObjectURL(url);

      }, 5000);


    } catch (error) {

      console.error(
        'Merge failed:',
        error
      );

      alert(
        'Failed to merge PDFs.'
      );

    } finally {

      setLoading(false);

      setProgress(0);
    }
  };


  // ============================================================
  // TOTAL PAGES
  // ============================================================

  const totalPages =
    files.reduce(
      (total, fileData) =>
        total +
        (fileData.pageCount || 0),
      0
    );


  // ============================================================
  // UI
  // ============================================================

  return (

    <ToolWorkspace
      title=""
      sidebar={

        <div
          className="
            h-full
            flex
            flex-col
          "
        >

          {/* SIDEBAR TITLE */}

          <h2
            className="
              text-2xl
              font-bold
              text-white
              mb-7
            "
          >
            Merge PDF
          </h2>


          {/* DESCRIPTION */}

          <div
            className="
              bg-blue-500/10
              border
              border-blue-500/20
              rounded-2xl
              p-5
              mb-6
            "
          >

            <p
              className="
                text-blue-300
                text-sm
                leading-6
              "
            >
              Upload multiple PDFs and arrange
              them in the order you want.
            </p>

          </div>


          {/* FILE STATS */}

          {files.length > 0 && (

            <div
              className="
                border
                border-gray-800
                rounded-2xl
                p-5
                mb-6
                bg-gray-900/40
              "
            >

              <div
                className="
                  flex
                  justify-between
                  items-center
                  mb-4
                "
              >

                <span
                  className="
                    text-gray-400
                    text-sm
                  "
                >
                  Files
                </span>

                <span
                  className="
                    text-white
                    font-semibold
                  "
                >
                  {files.length}
                </span>

              </div>


              <div
                className="
                  flex
                  justify-between
                  items-center
                "
              >

                <span
                  className="
                    text-gray-400
                    text-sm
                  "
                >
                  Pages
                </span>

                <span
                  className="
                    text-white
                    font-semibold
                  "
                >
                  {totalPages}
                </span>

              </div>

            </div>

          )}


          {/* MERGE BUTTON */}

          <div className="mt-auto">

            <button
              type="button"
              onClick={mergePDFs}
              disabled={
                loading ||
                files.length === 0
              }
              className={`
                w-full
                py-4
                rounded-2xl
                font-semibold
                text-white
                transition-all
                duration-200
                ${
                  loading ||
                  files.length === 0
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20'
                }
              `}
            >

              {loading
                ? `Processing ${progress}%`
                : `Merge ${
                    files.length || ''
                  } PDF${
                    files.length === 1
                      ? ''
                      : 's'
                  }`
              }

            </button>


            <div
              className="
                flex
                justify-center
                gap-4
                mt-5
                text-xs
                text-gray-600
              "
            >

              <span>
                🔒 Local
              </span>

              <span>
                ⚡ Fast
              </span>

              <span>
                ∞ No Limits
              </span>

            </div>

          </div>

        </div>
      }
    >

      {/* ====================================================== */}
      {/* MAIN WORKSPACE */}
      {/* ====================================================== */}

      <div
        className="
          min-h-full
          w-full
        "
      >


        {/* ================================================== */}
        {/* BEFORE UPLOAD */}
        {/* ================================================== */}

        {files.length === 0 ? (

          <div
            className="
              min-h-[calc(100vh-180px)]
              flex
              items-center
              justify-center
            "
          >

            <div
              onClick={() =>
                inputRef.current?.click()
              }

              onDragOver={(event) => {

                event.preventDefault();

                setIsDragOver(true);
              }}

              onDragLeave={() =>
                setIsDragOver(false)
              }

              onDrop={handleDrop}

              className={`
                w-full
                max-w-5xl
                min-h-[420px]
                border-2
                border-dashed
                rounded-3xl
                cursor-pointer
                flex
                items-center
                justify-center
                transition-all
                duration-200
                ${
                  isDragOver
                    ? 'border-red-500 bg-red-500/5'
                    : 'border-gray-700 bg-gray-900/30 hover:border-red-500'
                }
              `}
            >

              <input
                ref={inputRef}
                type="file"
                multiple
                accept="application/pdf"
                className="hidden"
                onChange={async (event) => {

                  const selectedFiles =
                    Array.from(
                      event.target.files || []
                    );

                  await addFiles(
                    selectedFiles
                  );

                  event.target.value =
                    '';
                }}
              />


              {/* CENTER CONTENT */}

              <div
                className="
                  text-center
                  select-none
                "
              >

                <div
                  className="
                    flex
                    justify-center
                    mb-6
                  "
                >

                  <div
                    className="
                      w-24
                      h-24
                      rounded-3xl
                      bg-gray-800
                      border
                      border-gray-700
                      flex
                      items-center
                      justify-center
                      shadow-xl
                    "
                  >

                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-gray-300"
                    >

                      <path
                        d="
                          M14 2H6
                          a2 2 0 0 0-2 2
                          v16
                          a2 2 0 0 0 2 2
                          h12
                          a2 2 0 0 0 2-2
                          V8
                          z
                        "
                      />

                      <polyline
                        points="
                          14 2
                          14 8
                          20 8
                        "
                      />

                      <line
                        x1="8"
                        y1="13"
                        x2="16"
                        y2="13"
                      />

                      <line
                        x1="8"
                        y1="17"
                        x2="14"
                        y2="17"
                      />

                    </svg>

                  </div>

                </div>


                <p
                  className="
                    text-2xl
                    font-semibold
                    text-white
                  "
                >
                  Drag & drop PDFs here
                </p>


                <p
                  className="
                    text-sm
                    text-gray-500
                    mt-3
                  "
                >
                  or click to browse files
                </p>


                <p
                  className="
                    text-xs
                    text-gray-600
                    mt-6
                  "
                >
                  Fast • Secure • Local Processing
                </p>

              </div>

            </div>

          </div>

        ) : (

          /* ================================================== */
          /* AFTER UPLOAD */
          /* ================================================== */

          <div
            className="
              w-full
            "
          >

            {/* ADD FILES */}

            <div
              className="
                flex
                justify-end
                mb-6
              "
            >

              <button
                type="button"
                onClick={() =>
                  inputRef.current?.click()
                }
                className="
                  group
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-2xl
                  border
                  border-gray-800
                  bg-gray-900/70
                  hover:border-red-500
                  hover:bg-gray-900
                  transition-all
                "
              >

                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-red-600
                    group-hover:bg-red-500
                    flex
                    items-center
                    justify-center
                    transition
                  "
                >

                  <span
                    className="
                      text-white
                      text-2xl
                      leading-none
                    "
                  >
                    +
                  </span>

                </div>


                <div className="text-left">

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-white
                    "
                  >
                    Add Files
                  </p>

                  <p
                    className="
                      text-xs
                      text-gray-500
                    "
                  >
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
                onChange={async (event) => {

                  const selectedFiles =
                    Array.from(
                      event.target.files || []
                    );

                  await addFiles(
                    selectedFiles
                  );

                  event.target.value =
                    '';
                }}
              />

            </div>


            {/* PDF LIST */}

            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >

              <SortableContext
                items={files.map(
                  (file) => file.id
                )}
                strategy={
                  verticalListSortingStrategy
                }
              >

                <div
                  className="
                    flex
                    flex-col
                    gap-4
                    pb-10
                  "
                >

                  {files.map(
                    (fileData, index) => (

                      <SortablePDFCard
                        key={
                          fileData.id
                        }
                        fileData={
                          fileData
                        }
                        index={
                          index
                        }
                        removeFile={
                          removeFile
                        }
                      />

                    )
                  )}

                </div>

              </SortableContext>

            </DndContext>


            {/* PROCESSING */}

            {loading && (

              <div
                className="
                  fixed
                  bottom-7
                  left-1/2
                  -translate-x-1/2
                  w-[420px]
                  bg-gray-900
                  border
                  border-gray-800
                  rounded-2xl
                  p-4
                  shadow-2xl
                  z-50
                "
              >

                <div
                  className="
                    flex
                    justify-between
                    mb-2
                  "
                >

                  <span
                    className="
                      text-sm
                      text-gray-300
                    "
                  >
                    Merging PDFs
                  </span>

                  <span
                    className="
                      text-sm
                      text-gray-400
                    "
                  >
                    {progress}%
                  </span>

                </div>


                <div
                  className="
                    w-full
                    h-2
                    bg-gray-800
                    rounded-full
                    overflow-hidden
                  "
                >

                  <div
                    className="
                      h-full
                      bg-red-600
                      transition-all
                      duration-300
                    "
                    style={{
                      width:
                        `${progress}%`
                    }}
                  />

                </div>

              </div>

            )}

          </div>

        )}

      </div>

    </ToolWorkspace>
  );
}