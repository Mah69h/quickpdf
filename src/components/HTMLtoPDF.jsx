import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function HTMLtoPDF() {

  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const previewRef = useRef(null);

  const generatePDF = async () => {

    if (!html.trim()) return;

    setLoading(true);

    try {

      const canvas = await html2canvas(
        previewRef.current
      );

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth =
        pdf.internal.pageSize.getWidth();

      const pdfHeight =
        (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      pdf.save("html-to-pdf.pdf");

    } catch (err) {

      console.error(err);

      alert("Failed to generate PDF");
    }

    setLoading(false);
  };

  return (
    <div className="text-center">

      <h2 className="text-2xl font-semibold mb-6">
        HTML to PDF
      </h2>

      <textarea
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        placeholder="Paste HTML code here..."
        className="w-full h-52 bg-gray-800 text-white rounded-xl p-4 outline-none border border-gray-700 focus:border-blue-400"
      />

      <div className="mt-6">

        <h3 className="text-lg text-gray-400 mb-3">
          Live Preview
        </h3>

        <div
          ref={previewRef}
          className="bg-white text-black rounded-xl p-6 min-h-[200px] text-left overflow-auto"
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />

      </div>

      <button
        onClick={generatePDF}
        disabled={!html || loading}
        className={`mt-6 px-6 py-3 rounded-xl text-white font-medium transition ${
          !html || loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600 hover:scale-105"
        }`}
      >

        {loading
          ? "Generating..."
          : "Convert to PDF"}

      </button>

    </div>
  );
}