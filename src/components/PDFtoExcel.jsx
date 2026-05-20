import { useState } from 'react';

export default function PDFtoExcel() {

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const convertToExcel = async () => {

    if (!file) return;

    setLoading(true);

    const formData = new FormData();

    formData.append('file', file);

    try {

      const res = await fetch(
        'https://quickpdf-d77h.onrender.com/pdf-to-excel',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error('Conversion failed');
      }

      const blob = await res.blob();

      const url =
        URL.createObjectURL(blob);

      const a =
        document.createElement('a');

      a.href = url;

      a.download = 'converted.xlsx';

      a.click();

      URL.revokeObjectURL(url);

    } catch (err) {

      console.error(err);

      alert('Conversion failed');
    }

    setLoading(false);
  };

  return (
    <div className="text-center">

      <h2 className="text-2xl font-semibold mb-6">
        PDF to EXCEL
      </h2>

      <div
        onClick={() =>
          document.getElementById(
            'pdfExcelInput'
          ).click()
        }

        onDragOver={(e) =>
          e.preventDefault()
        }

        onDrop={(e) => {

          e.preventDefault();

          const droppedFile =
            e.dataTransfer.files[0];

          setFile(droppedFile);
        }}

        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-2xl p-10 cursor-pointer hover:border-green-400 hover:bg-gray-700/40 transition"
      >

        <input
          id="pdfExcelInput"
          type="file"
          accept="application/pdf"
          className="hidden"

          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />

        <div className="text-5xl mb-3">
          📗
        </div>

        <p className="text-lg text-gray-300">
          Drag & drop PDF here
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Extract tables into Excel
        </p>

      </div>

      {file && (

        <div className="mt-4 flex justify-between items-center bg-gray-700 px-4 py-2 rounded text-sm text-gray-300">

          <span>
            📄 {file.name}
          </span>

          <button
            onClick={() =>
              setFile(null)
            }

            className="text-red-400 hover:text-red-300"
          >
            ❌
          </button>

        </div>
      )}

      <button
        onClick={convertToExcel}

        disabled={!file || loading}

        className={`mt-4 px-6 py-3 rounded-xl text-white font-medium transition ${
          !file || loading
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600 hover:scale-105'
        }`}
      >

        {loading
          ? 'Converting...'
          : 'Convert to EXCEL'}

      </button>

    </div>
  );
}