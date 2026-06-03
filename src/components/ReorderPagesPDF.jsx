import { useState, useRef } from 'react';

import { PDFDocument } from 'pdf-lib';

import * as pdfjsLib from 'pdfjs-dist';

import {
  DndContext,
  closestCenter
} from '@dnd-kit/core';

import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

function SortablePage({ page }) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: page.id
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
      {...attributes}
      {...listeners}
      className="
        bg-gray-900
        border border-gray-800
        rounded-2xl
        p-3
        cursor-grab
      "
    >

      <img
        src={page.thumbnail}
        alt=""
        className="
          w-full
          rounded-lg
          border border-gray-700
        "
      />

      <p className="
        text-white
        text-sm
        mt-2
        text-center
      ">
        Page {page.pageNumber}
      </p>

    </div>
  );
}

export default function ReorderPagesPDF() {

  const [pages, setPages] =
    useState([]);

  const [pdfBuffer, setPdfBuffer] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const inputRef = useRef(null);

  const loadPDF = async (file) => {

    try {

      const buffer =
        await file.arrayBuffer();

      setPdfBuffer(
        buffer.slice(0)
      );

      const pdf =
        await pdfjsLib.getDocument({
          data: buffer.slice(0)
        }).promise;

      const pageItems = [];

      for (
        let i = 1;
        i <= pdf.numPages;
        i++
      ) {

        const page =
          await pdf.getPage(i);

        const viewport =
          page.getViewport({
            scale: 0.4
          });

        const canvas =
          document.createElement(
            'canvas'
          );

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

        pageItems.push({

          id:
            crypto.randomUUID(),

          pageNumber: i,

          thumbnail:
            canvas.toDataURL(
              'image/jpeg',
              0.7
            )
        });
      }

      setPages(pageItems);

    } catch (err) {

      console.error(err);

      alert(
        'Failed to load PDF'
      );
    }
  };

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
        pages.findIndex(
          (p) =>
            p.id === active.id
        );

      const newIndex =
        pages.findIndex(
          (p) =>
            p.id === over.id
        );

      setPages(
        arrayMove(
          pages,
          oldIndex,
          newIndex
        )
      );
    };

  const reorderPDF =
    async () => {

      try {

        setLoading(true);

        setProgress(0);

        const sourcePDF =
          await PDFDocument.load(
            pdfBuffer
          );

        const newPDF =
          await PDFDocument.create();

        for (
          let i = 0;
          i < pages.length;
          i++
        ) {

          const [copiedPage] =
            await newPDF.copyPages(
              sourcePDF,
              [
                pages[i]
                  .pageNumber - 1
              ]
            );

          newPDF.addPage(
            copiedPage
          );

          setProgress(
            Math.round(
              ((i + 1) /
                pages.length) *
                100
            )
          );
        }

        const bytes =
          await newPDF.save();

        const blob =
          new Blob(
            [bytes],
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
          'quickpdf-reordered.pdf';

        a.click();

        URL.revokeObjectURL(
          url
        );

      } catch (err) {

        console.error(err);

        alert(
          'Failed to reorder PDF'
        );

      } finally {

        setLoading(false);

        setProgress(0);
      }
    };

  return (

    <div className="w-full max-w-5xl mx-auto text-center">

      <h2 className="
        text-3xl
        font-bold
        text-white
        mb-6
      ">
        Reorder Pages
      </h2>

      {pages.length === 0 && (

        <div
          onClick={() =>
            inputRef.current?.click()
          }
          className="
            border-2
            border-dashed
            border-gray-700
            hover:border-red-500
            bg-gray-900
            rounded-3xl
            p-12
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
              loadPDF(
                e.target.files[0]
              )
            }
          />

          <div className="text-6xl mb-4">
            📑
          </div>

          <p className="
            text-xl
            text-white
          ">
            Upload PDF
          </p>

        </div>
      )}

      {pages.length > 0 && (

        <>
          <p className="
            text-gray-500
            mb-5
          ">
            Drag pages to reorder
          </p>

          <DndContext
            collisionDetection={
              closestCenter
            }
            onDragEnd={
              handleDragEnd
            }
          >

            <SortableContext
              items={pages.map(
                (p) => p.id
              )}
              strategy={
                rectSortingStrategy
              }
            >

              <div className="
                grid
                grid-cols-2
                md:grid-cols-4
                gap-4
              ">

                {pages.map(
                  (page) => (

                    <SortablePage
                      key={page.id}
                      page={page}
                    />

                  )
                )}

              </div>

            </SortableContext>

          </DndContext>

          {loading && (

            <div className="
              mt-6
            ">

              <div className="
                w-full
                bg-gray-700
                rounded-full
                h-3
              ">

                <div
                  className="
                    bg-red-600
                    h-full
                  "
                  style={{
                    width:
                      `${progress}%`
                  }}
                />

              </div>

              <p className="
                text-gray-400
                mt-2
              ">
                {progress}%
              </p>

            </div>
          )}

          <button
            onClick={
              reorderPDF
            }
            disabled={loading}
            className="
              mt-6
              w-full
              py-4
              rounded-2xl
              bg-red-600
              hover:bg-red-700
              text-white
              font-medium
            "
          >
            Reorder PDF
          </button>
        </>
      )}

    </div>
  );
}