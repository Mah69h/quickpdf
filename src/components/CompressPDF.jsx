import { useState, useRef } from 'react';

export default function CompressPDF() {

  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [level, setLevel] = useState('ebook');

  const [isDragOver, setIsDragOver] = useState(false);

  const inputRef = useRef(null);

  // FORMAT SIZE
  const formatSize = (bytes) => {

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // HANDLE FILE
  const handleFile = (selectedFiles) => {

  const pdfFiles =
    Array.from(selectedFiles).filter(
      (file) =>
        file.type === 'application/pdf'
    );

  if (pdfFiles.length === 0) {

    alert('Please upload valid PDFs');

    return;
  }

  setResult(null);

  setFiles((prev) => [
    ...prev,
    ...pdfFiles
  ]);
};

  // DROP
  const handleDrop = (e) => {

    e.preventDefault();

    setIsDragOver(false);

    handleFile(e.dataTransfer.files);
  };

  // COMPRESS
  const compressPDF = async () => {

    if (files.length === 0) return;

    try {

      setLoading(true);

      const formData =
        new FormData();

       formData.append(
        'file',
         files[0]
  );

      formData.append(
        'level',
        level
      );
     
  const response = await fetch(
  'https://quickpdf-2qeo.onrender.com/compress',
  {
    method: 'POST',
    body: formData,
    mode: 'cors'
  }
);

      if (!response.ok) {
        throw new Error(
          'Compression failed'
        );
      }

      const blob =
        await response.blob();

      const originalSize =
         files[0].size;

      const compressedSize =
        blob.size;

      const reduction =
        (
          (
            (
              originalSize -
              compressedSize
            ) /
            originalSize
          ) * 100
        ).toFixed(1);

      setResult({
        original: originalSize,
        compressed: compressedSize,
        reduction
      });

      const url =
        URL.createObjectURL(blob);

      const a =
        document.createElement('a');

      a.href = url;

      a.download =
        'quickpdf-compressed.pdf';

      a.click();

      setTimeout(() => {

        URL.revokeObjectURL(url);

      }, 5000);

    } catch (err) {

      console.error(err);

      alert(
        'Compression failed'
      );

    } finally {

      setLoading(false);
    }
  };
  const compressionLabel = {
  screen: 'Maximum compression with lower quality',
  ebook: 'Best balance between quality and size',
  printer: 'Highest quality with smaller reduction'
};

  return (

    <div className="w-full max-w-2xl mx-auto text-center">

      {/* HEADER */}

      <h2 className="text-3xl font-bold text-white mb-6">
        Compress PDF
      </h2>

      {/* UPLOAD BOX */}

     {files.length === 0 && (

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

    className={`border-2 border-dashed rounded-3xl p-12 cursor-pointer transition ${
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

      onChange={(e) =>
        handleFile(
          e.target.files
        )
      }
    />

    <div className="text-6xl mb-4">
      📉
    </div>

    <p className="text-xl text-white font-medium">
      Drag & drop PDFs here
    </p>

    <p className="text-sm text-gray-500 mt-2">
      Fast • Secure • Local Processing
    </p>

  </div>
)}

      {/* FILE CARD */}

     {files.length > 0 && (

  <div className="mt-6 space-y-3">

    {files.map((file, index) => (

      <div
        key={index}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center justify-between"
      >

        <div className="text-left min-w-0">

          <p className="text-white font-medium truncate">
            {file.name}
          </p>

          <p className="text-gray-500 text-sm mt-1">
            {formatSize(file.size)}
          </p>

        </div>

        <button
          onClick={() => {

            setFiles(
              files.filter(
                (_, i) => i !== index
              )
            );
          }}

          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-white transition"
        >
          Remove
        </button>

      </div>
    ))}

    {/* ADD MORE */}

    <button
      onClick={() =>
        inputRef.current?.click()
      }

      className="w-full border-2 border-dashed border-gray-700 hover:border-red-500 rounded-2xl py-5 text-gray-400 hover:text-white transition text-3xl"
    >
      +
    </button>

  </div>
)}

      {/* COMPRESSION LEVEL */}

      {files.length > 0 && (

        <div className="mt-6">

          <select
            value={level}

            onChange={(e) =>
              setLevel(
                e.target.value
              )
            }

            className="w-full bg-gray-900 border border-gray-700 focus:border-red-500 outline-none rounded-2xl px-5 py-4 text-white"
          >

            <option value="screen">
              Extreme Compression
            </option>

            <option value="ebook">
              Recommended Compression
            </option>

            <option value="printer">
              Less Compression
            </option>

          </select>
          <p className="text-sm text-gray-500 mt-2 text-left">
  {compressionLabel[level]}
</p>

        </div>
      )}

      {/* RESULT */}

      {result && (

        <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-2xl p-5 text-left">

          <p className="text-green-400 font-medium">
            Compression Complete
          </p>

          <div className="mt-3 text-sm text-gray-300 space-y-1">

            <p>
              Original:
              {' '}
              {formatSize(
                result.original
              )}
            </p>

            <p>
              Compressed:
              {' '}
              {formatSize(
                result.compressed
              )}
            </p>

            <p>
              Reduced:
              {' '}
              {result.reduction}%
            </p>

          </div>

        </div>
      )}

      {/* BUTTON */}

      {files.length > 0 && (

        <button
          onClick={compressPDF}

          disabled={loading}

          className={`mt-6 w-full py-4 rounded-2xl text-white font-medium transition flex items-center justify-center gap-2 ${
            loading
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >

          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Compressing PDF...
            </>
          ) : (
            'Compress PDF'
          )}

        </button>
      )}

      {/* FOOTER */}

      <div className="flex justify-center gap-6 mt-10 text-gray-600 text-xs">

        <div>
          🔒 Local Processing
        </div>

        <div>
          ⚡ Smart Compression
        </div>

        <div>
          ∞ No Limits
        </div>

      </div>

    </div>
  );
}