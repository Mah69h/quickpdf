import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Home() {

  const tools = [

    {
      title: 'Merge PDF',
      icon: '📄',
      path: '/merge-pdf',
      desc: 'Combine PDFs into one file'
    },

    {
      title: 'Split PDF',
      icon: '✂️',
      path: '/split-pdf',
      desc: 'Extract pages from PDF'
    },

    {
      title: 'Compress PDF',
      icon: '📉',
      path: '/compress-pdf',
      desc: 'Reduce PDF file size'
    },

    {
      title: 'JPG to PDF',
      icon: '🖼️',
      path: '/jpg-to-pdf',
      desc: 'Convert images to PDF'
    },

    {
      title: 'PDF to JPG',
      icon: '🌄',
      path: '/pdf-to-jpg',
      desc: 'Convert PDF pages to images'
    },

    {
      title: 'Word to PDF',
      icon: '📝',
      path: '/word-to-pdf',
      desc: 'DOCX to PDF converter'
    },

    {
      title: 'PDF to Word',
      icon: '📘',
      path: '/pdf-to-word',
      desc: 'Convert PDF into DOCX'
    },

    {
      title: 'PPT to PDF',
      icon: '📊',
      path: '/ppt-to-pdf',
      desc: 'PowerPoint to PDF'
    },

    {
      title: 'PDF to PPT',
      icon: '📽️',
      path: '/pdf-to-ppt',
      desc: 'Convert PDF into PPT'
    },

    {
      title: 'Excel to PDF',
      icon: '📗',
      path: '/excel-to-pdf',
      desc: 'Excel spreadsheet to PDF'
    },

    {
      title: 'PDF to Excel',
      icon: '📈',
      path: '/pdf-to-excel',
      desc: 'Extract tables into Excel'
    }

  ];

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white px-6 py-12">

      {/* LOGO */}

      <div className="flex justify-center mb-14">

        <img
          src={logo}
          alt="QuickPDF"
          className="w-[260px] md:w-[340px]"
        />

      </div>

      {/* HEADING */}

      <div className="text-center mb-14">

        <h1 className="text-5xl font-bold mb-4">
          Every PDF Tool You Need
        </h1>

        <p className="text-gray-400 text-lg">
          Fast • Secure • Free PDF Tools
        </p>

      </div>

      {/* GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {tools.map((item, index) => (

          <Link
            key={index}
            to={item.path}

            className="
              bg-gray-900
              border border-gray-800
              hover:border-red-500
              hover:bg-gray-800
              rounded-3xl
              p-7
              text-left
              transition-all duration-300
              hover:-translate-y-1
            "
          >

            <div className="text-5xl mb-5">
              {item.icon}
            </div>

            <h2 className="text-2xl font-semibold mb-2">
              {item.title}
            </h2>

            <p className="text-gray-400">
              {item.desc}
            </p>

          </Link>

        ))}

      </div>

    </div>
  );
}