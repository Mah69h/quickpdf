import {
  Routes,
  Route
} from 'react-router-dom';

import Home from './pages/Home';

import MergePDF from './components/MergePDF';
import SplitPDF from './components/SplitPDF';
import CompressPDF from './components/CompressPDF';

import JPGtoPDF from "./components/JPGtoPDF";
import PDFtoJPG from "./components/PDFtoJPG";

import WordToPDF from "./components/WordToPDF";
import PPTtoPDF from "./components/PPTtoPDF";
import ExcelToPDF from "./components/ExcelToPDF";
import HTMLtoPDF from "./components/HTMLtoPDF";

import PDFtoWORD from "./components/PDFtoWORD";
import PDFtoPPT from "./components/PDFtoPPT";
import PDFtoExcel from "./components/PDFtoExcel";
import DeletePages from './components/DeletePages';
import RotatePDF from './components/RotatePDF';
import ExtractPages from './components/ExtractPages';
import WatermarkPDF from './components/WatermarkPDF';
import PageNumbersPDF from './components/PageNumbersPDF';
import ReorderPagesPDF from './components/ReorderPagesPDF';

function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/merge-pdf"
        element={<MergePDF />}
      />

      <Route
        path="/split-pdf"
        element={<SplitPDF />}
      />

      <Route
        path="/compress-pdf"
        element={<CompressPDF />}
      />

      <Route
        path="/jpg-to-pdf"
        element={<JPGtoPDF />}
      />

      <Route
        path="/pdf-to-jpg"
        element={<PDFtoJPG />}
      />

      <Route
        path="/word-to-pdf"
        element={<WordToPDF />}
      />

      <Route
        path="/ppt-to-pdf"
        element={<PPTtoPDF />}
      />

      <Route
        path="/excel-to-pdf"
        element={<ExcelToPDF />}
      />

      <Route
        path="/html-to-pdf"
        element={<HTMLtoPDF />}
      />

      <Route
        path="/pdf-to-word"
        element={<PDFtoWORD />}
      />

      <Route
        path="/pdf-to-ppt"
        element={<PDFtoPPT />}
      />

      <Route
        path="/pdf-to-excel"
        element={<PDFtoExcel />}
      />

      <Route
        path="/delete-pages"
        element={<DeletePages />}
      />

      <Route
        path="/rotate-pdf"
        element={<RotatePDF />}
      />

      <Route
        path="/extract-pages"
        element={<ExtractPages />}
      />

      <Route
        path="/watermark-pdf"
        element={<WatermarkPDF />}
      />

      <Route
        path="/page-numbers-pdf"
        element={<PageNumbersPDF />}
      />

      <Route
        path="/reorder-pages-pdf"
        element={<ReorderPagesPDF />}
      />

    </Routes>
  );
}

export default App;