import { useState } from 'react';
import MergePDF from './components/MergePDF';
import SplitPDF from './components/SplitPDF';
import CompressPDF from './components/CompressPDF';
import JPGtoPDF from "./components/JPGtoPDF";
import PDFtoJPG from "./components/PDFtoJPG";
import ConvertPDF from "./components/ConvertPDF";
import WordToPDF from "./components/WordToPDF";
import PPTtoPDF from "./components/PPTtoPDF";
import ExcelToPDF from "./components/ExcelToPDF";
import HTMLtoPDF from "./components/HTMLtoPDF";
import PDFtoWORD from "./components/PDFtoWORD";
import PDFtoPPT from "./components/PDFtoPPT";
import PDFtoExcel from "./components/PDFtoExcel";

function App() {
  const [tool, setTool] = useState('merge');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col items-center justify-center px-4">

  <h1 className="text-5xl font-bold mb-8 tracking-wide">
    PDF Toolkit
  </h1>

  <div className="flex gap-4 mb-8 bg-gray-800 p-2 rounded-xl">
    <button
  className={`px-6 py-2 rounded-lg transition transform hover:scale-105 active:scale-95 ${
    tool === 'merge'
      ? 'bg-blue-500 shadow-lg'
      : 'text-gray-400 hover:text-white'
  }`}
  onClick={() => setTool('merge')}
>
  Merge
  </button>

   <button
  className={`px-6 py-2 rounded-lg transition transform hover:scale-105 active:scale-95 ${
    tool === 'split'
      ? 'bg-blue-500 shadow-lg'
      : 'text-gray-400 hover:text-white'
  }`}
  onClick={() => setTool('split')}
>
  Split
  </button>
     <button
  className={`px-6 py-2 rounded-lg transition transform hover:scale-105 active:scale-95 ${
    tool === 'compress'
      ? 'bg-blue-500 shadow-lg'
      : 'text-gray-400 hover:text-white'
  }`}
  onClick={() => setTool('compress')}
>
  Compress
  </button>

  <button 
  className={`px-6 py-2 rounded-lg transition transform hover:scale-105 active:scale-95 ${
    tool === 'convert'
      ? 'bg-blue-500 shadow-lg'
      : 'text-gray-400 hover:text-white'
  }`}
  onClick={() => setTool('convert')}>
  Convert PDF
</button>
  
  </div>

 <div className="bg-gray-800/70 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-lg min-h-[350px] transition-all duration-300">
 {tool === 'merge' && <MergePDF />}
{tool === 'split' && <SplitPDF />}
{tool === 'compress' && <CompressPDF />}
{tool === 'convert' && (
  <ConvertPDF setTool={setTool} />
)}

{tool === "jpg-to-pdf" && (
  <JPGtoPDF setTool={setTool} />
)}
{tool === "pdf-to-jpg" && (
  <PDFtoJPG setTool={setTool} />
)}
{tool === 'word-to-pdf' && (
  <WordToPDF />
)}
{tool === 'ppt-to-pdf' && (
  <PPTtoPDF />
)}
{tool === 'excel-to-pdf' && (
  <ExcelToPDF />
)}
{tool === 'html-to-pdf' && (
  <HTMLtoPDF />
)}
{tool === 'pdf-to-word' && (
  <PDFtoWORD />
)}
{tool === 'pdf-to-ppt' && (
  <PDFtoPPT />
)}
{tool === 'pdf-to-excel' && (
  <PDFtoExcel />
)}
  </div>
  </div>
  );
}

export default App;