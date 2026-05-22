import { useState, useRef } from 'react';

import { PDFDocument } from 'pdf-lib';

import * as pdfjsLib from 'pdfjs-dist';

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
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (

    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between bg-gray-900 border border-gray-800 p-4 rounded-2xl shadow-md"
    >

      <div
        className="flex items-center gap-4 flex-1 cursor-grab"
        {...attributes}
        {...listeners}
      >

        <img
          src={fileData.thumbnail}
          alt="PDF Preview"
          className="w-16 h-20 object-cover rounded-xl border border-gray-700"
        />

        <div className="text-left min-w-0">

          <p className="text-white text-sm font-medium truncate">
            {fileData.file.name}
          </p>

          <p className="text-gray-400 text-xs mt-1">

            {(fileData.file.size / (1024 * 1024)).toFixed(2)} MB

            {fileData.pageCount && (
              <> • {fileData.pageCount} pages</>
            )}

          </p>

        </div>

      </div>

      <button
        onClick={() => removeFile(index)}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-white transition ml-3 text-sm"
      >
        Remove
      </button>

    </div>
  );
}

export default function MergePDF() {

  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [isDragOver, setIsDragOver] = useState(false);

  const inputRef = useRef(null);

  // ─────────────────────────────────────────────
  // GENERATE THUMBNAIL
  // ─────────────────────────────────────────────

  const generateThumbnail = async (file) => {

    const buffer = await file.arrayBuffer();

    const typedArray =
      new Uint8Array(buffer);

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

    canvas.height = viewport.height;

    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport
    }).promise;

    const blob =
      await new Promise((resolve) =>
        canvas.toBlob(
          resolve,
          'image/jpeg',
          0.6
        )
      );

    const thumbnail =
      URL.createObjectURL(blob);

    return {
      thumbnail,
      buffer,
      pageCount: pdf.numPages
    };
  };

  // ─────────────────────────────────────────────
  // ADD FILES
  // ─────────────────────────────────────────────

  const addFiles = async (newFiles) => {

    const pdfFiles =
      newFiles.filter(
        (file) =>
          file.type === 'application/pdf'
      );

    for (const file of pdfFiles) {

      try {

        const {
          thumbnail,
          buffer,
          pageCount
        } =
          await generateThumbnail(file);

        const newItem = {

          id: crypto.randomUUID(),

          file,

          thumbnail,

          buffer,

          pageCount
        };

        setFiles((prev) => {

          const alreadyExists =
            prev.some(
              (item) =>
                item.file.name === file.name &&
                item.file.size === file.size
            );

          if (alreadyExists) return prev;

          return [...prev, newItem];
        });

      } catch (err) {

        console.error(err);
      }
    }
  };

  // ─────────────────────────────────────────────
  // DROP HANDLER
  // ─────────────────────────────────────────────

  const handleDrop = async (e) => {

    e.preventDefault();

    setIsDragOver(false);

    const droppedFiles =
      Array.from(
        e.dataTransfer.files
      );

    await addFiles(droppedFiles);
  };

  // ─────────────────────────────────────────────
  // REMOVE FILE
  // ─────────────────────────────────────────────

  const removeFile = (index) => {

    URL.revokeObjectURL(
      files[index].thumbnail
    );

    const updated =
      files.filter((_, i) => i !== index);

    setFiles(updated);
  };

  // ─────────────────────────────────────────────
  // DRAG END
  // ─────────────────────────────────────────────

  const handleDragEnd = (event) => {

    const {
      active,
      over
    } = event;

    if (!over || active.id === over.id)
      return;

    const oldIndex =
      files.findIndex(
        (item) => item.id === active.id
      );

    const newIndex =
      files.findIndex(
        (item) => item.id === over.id
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

  const mergePDFs = async () => {

    if (files.length === 0)
      return;

    try {

      setLoading(true);

      setProgress(0);

      const mergedPdf =
        await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {

        const item = files[i];

        const pdf =
          await PDFDocument.load(
            item.buffer,
            {
              ignoreEncryption: true
            }
          );

        const pages =
          await mergedPdf.copyPages(
            pdf,
            pdf.getPageIndices()
          );

        pages.forEach((page) =>
          mergedPdf.addPage(page)
        );

        setProgress(
          Math.round(
            ((i + 1) / files.length) * 100
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

      const a =
        document.createElement('a');

      a.href = url;

      a.download =
        'quickpdf-merged.pdf';

      a.click();

      setTimeout(() => {

        URL.revokeObjectURL(url);

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

  return (

    <div className="w-full max-w-3xl mx-auto text-center px-4">

      {/* HEADER */}

      <h2 className="text-5xl font-bold mb-10 text-white">
        Merge PDF
      </h2>

      {/* UPLOAD BOX */}

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

        className={`border-2 border-dashed rounded-3xl p-14 cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-red-500 bg-red-500/5'
            : 'border-gray-700 bg-gray-900 hover:border-gray-500'
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

        <div className="text-6xl mb-5">
          📄
        </div>

        <p className="text-2xl font-semibold text-white mb-2">
          Drag & drop PDFs here
        </p>

        <p className="text-gray-500 text-sm">
          Fast • Secure • Local Processing
        </p>

      </div>

      {/* FILE LIST */}

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

      {/* PROGRESS */}

      {loading && (

        <div className="mt-6">

          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">

            <div
              className="bg-red-600 h-full transition-all duration-300"
              style={{
                width: `${progress}%`
              }}
            />

          </div>

          <p className="text-gray-400 text-sm mt-2">
            Merging... {progress}%
          </p>

        </div>
      )}

      {/* BUTTON */}

      <button

        onClick={mergePDFs}

        disabled={
          loading ||
          files.length === 0
        }

        className={`mt-8 px-10 py-4 rounded-2xl text-white text-lg font-semibold transition-all duration-200 ${
          loading ||
          files.length === 0
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-red-500/20'
        }`}
      >

        {loading
          ? 'Merging PDFs...'
          : `Merge ${files.length} PDF${files.length !== 1 ? 's' : ''}`}

      </button>

      {/* FOOTER */}

      <div className="flex flex-wrap justify-center gap-6 mt-10 text-gray-500 text-sm">

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

    </div>
  );
}