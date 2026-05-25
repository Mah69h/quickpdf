import { useState } from 'react';

export default function PDFtoWORD() {

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const convertToWord = async () => {

    if (!file) return;

    setLoading(true);

    const formData = new FormData();

    formData.append('file', file);

    try {

      const res = await fetch(
        'https://quickpdf-2qeo.onrender.com/pdf-to-word',
        {
          method: 'POST',
          body: formData,
          mode: 'cors'
        }
      );

      if (!res.ok) {
        throw new Error('Conversion failed');
      }

      const blob = await res.blob();

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;

      a.download = 'converted.docx';

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
        PDF to WORD
      </h2>

      <div
        onClick={() =>
          document.getElementById('pdfWordInput').click()
        }

        onDragOver={(e) => e.preventDefault()}

        onDrop={(e) => {
          e.preventDefault();

          const droppedFile =
            e.dataTransfer.files[0];

          setFile(droppedFile);
        }}

        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-2xl p-10 cursor-pointer hover:border-blue-400 hover:bg-gray-700/40 transition"
      >

        <input
          id="pdfWordInput"
          type="file"
          accept="application/pdf"
          className="hidden"

          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />

        <div className="text-5xl mb-3">📝</div>

        <p className="text-lg text-gray-300">
          Drag & drop PDF here
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Convert PDF into editable Word
        </p>

      </div>

      {file && (

        <div className="mt-4 flex justify-between items-center bg-gray-700 px-4 py-2 rounded text-sm text-gray-300">

          <span>📄 {file.name}</span>

          <button
            onClick={() => setFile(null)}
            className="text-red-400 hover:text-red-300"
          >
            ❌
          </button>

        </div>
      )}

      <button
        onClick={convertToWord}

        disabled={!file || loading}

        className={`mt-4 px-6 py-3 rounded-xl text-white font-medium transition flex items-center justify-center gap-2 mx-auto shadow-lg ${
          !file || loading
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
        }`}
      >

     {loading ? (
  <div className="flex flex-col items-center gap-3">

    <div className="flex items-center gap-2">

      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

      <span>
        Converting PDF to Word...
      </span>

    </div>

    <p className="text-sm text-gray-400">
      Large PDFs may take up to 1 minute
    </p>

  </div>
) : (
  'Convert to WORD'
)}
      </button>

    </div>
  );
}