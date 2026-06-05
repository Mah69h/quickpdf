import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import Navbar from '../components/Navbar';

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
    },

    {
  title: 'Delete PDF Pages',
  icon: '🗑️',
  path: '/delete-pages',
  tool: 'delete-pages'
},
    {
  title: 'Rotate PDF',
  icon: '🔄',
  path: '/rotate-pdf',
  tool: 'rotate-pdf'
},
    {
  title: 'Extract Pages',
  icon: '📄',
  path: '/extract-pages',
  tool: 'extract-pages'
},
    {
  title: 'Watermark PDF',
  icon: '💧',
  path: '/watermark-pdf',
  tool: 'watermark-pdf'
},
    {
  title: 'Page Numbers PDF',
  icon: '🔢',
  path: '/page-numbers-pdf',
  tool: 'page-numbers-pdf'
},
    {
  title: 'Reorder Pages PDF',
  icon: '📑',
  path: '/reorder-pages-pdf',
  tool: 'reorder-pages-pdf'
},
    {
  title: 'Metadata Remover PDF',
  icon: '🧹',
  path: '/metadata-remover-pdf',
  tool: 'metadata-remover-pdf'
},
    {
  title: 'Crop PDF',
  icon: '✂️',
  path: '/crop-pdf',
  tool: 'crop-pdf'
}

  ];

  return (
    <>
    <Navbar />
    
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white px-6 py-12">

      {/* HEADING */}

      <div className="text-center mb-8">

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
    </>
  );
}