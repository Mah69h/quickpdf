export default function ConvertPDF({ setTool }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">Convert PDF</h2>

      {/* Convert TO PDF */}
      <div className="mb-10">
        <h3 className="text-lg mb-3 text-gray-400">Convert TO PDF</h3>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setTool && setTool('jpg-to-pdf')}
            className="px-4 py-3 bg-gray-700 rounded-lg text-white hover:bg-blue-500 transition"
          >
            JPG to PDF
          </button>

         <button
          onClick={() => setTool && setTool('word-to-pdf')}
         className="px-4 py-3 bg-gray-700 rounded-lg text-white hover:bg-blue-500 transition"
         >
            WORD to PDF
          </button>

          <button 
           onClick={() => setTool && setTool('ppt-to-pdf')}
         className="px-4 py-3 bg-gray-700 rounded-lg text-white hover:bg-blue-500 transition"
         >
            PowerPoint to PDF
          </button>

          <button 
             onClick={() => setTool && setTool('excel-to-pdf')}
         className="px-4 py-3 bg-gray-700 rounded-lg text-white hover:bg-blue-500 transition"
         >
            Excel to PDF
          </button>

          <button
          onClick={() => setTool && setTool('html-to-pdf')}
         className="px-4 py-3 bg-gray-700 rounded-lg text-white hover:bg-blue-500 transition"
         >
            HTML to PDF
          </button>
        </div>
      </div>

      {/* Convert FROM PDF */}
      <div>
        <h3 className="text-lg mb-3 text-gray-400">Convert FROM PDF</h3>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setTool && setTool('pdf-to-jpg')}
            className="px-4 py-3 bg-gray-700 rounded-lg text-white hover:bg-green-500 transition"
          >
            PDF to JPG
          </button>

          <button 
           onClick={() => setTool && setTool('pdf-to-word')}
            className="px-4 py-3 bg-gray-700 rounded-lg text-white hover:bg-green-500 transition"
          >
            PDF to Word
          </button>

          <button 
           onClick={() => setTool && setTool('pdf-to-ppt')}
            className="px-4 py-3 bg-gray-700 rounded-lg text-white hover:bg-green-500 transition"
          >
            PDF to PowerPoint
          </button>

          <button
          onClick={() => setTool && setTool('pdf-to-excel')}
            className="px-4 py-3 bg-gray-700 rounded-lg text-white hover:bg-green-500 transition"
          >
            PDF to Excel
          </button>

          {/* <button className="px-4 py-3 bg-gray-700 rounded-lg text-white opacity-50 cursor-not-allowed">
            PDF to PDF/A
          </button> */}
        </div>
      </div>
    </div>
  );
}