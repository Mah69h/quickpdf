import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Navbar() {

  return (

    <header
      className="
        sticky top-0 z-50
        w-full
        bg-[#0b1120]/95
        backdrop-blur-md
        border-b border-white/5
      "
    >

      <div
        className="
          w-full
          h-[72px]
          px-6 lg:px-8
          flex items-center justify-between
        "
      >

{/* LEFT SECTION */}

<div className="flex items-center gap-0">

<Link to="/" className="flex items-center">
  <img
    src={logo}
    alt="QuickPDF"
    className="
      w-[300px]
      object-contain
      cursor-pointer
      -ml-4
    "
  />
</Link>

  <nav
    className="
      hidden md:flex
      items-center
      gap-20
    "
  >
            <div className="relative group">

              <button
                className="
                  flex items-center gap-2
                  text-sm font-medium
                  text-gray-300
                  hover:text-white
                  transition
                "
              >
                ALL PDF TOOLS
                <span>▾</span>
              </button>

              {/* MEGA MENU COMING NEXT */}
<div
  className="
    absolute top-full left-0
    mt-4
    w-[800px]
    bg-[#111827]
    border border-gray-800
    rounded-3xl
    p-8
    shadow-2xl
    opacity-0 invisible
    group-hover:opacity-100
    group-hover:visible
    transition-all duration-200
  "
>

  <div className="grid grid-cols-4 gap-8">

    {/* ORGANIZE */}

    <div>

      <h3 className="text-red-500 font-semibold mb-4">
        ORGANIZE
      </h3>

      <div className="space-y-3 text-sm">

        <Link to="/merge-pdf" className="block text-gray-300 hover:text-white">
          Merge PDF
        </Link>

        <Link to="/split-pdf" className="block text-gray-300 hover:text-white">
          Split PDF
        </Link>

        <Link to="/delete-pages" className="block text-gray-300 hover:text-white">
          Delete Pages
        </Link>

        <Link to="/extract-pages" className="block text-gray-300 hover:text-white">
          Extract Pages
        </Link>

        <Link to="/reorder-pages-pdf" className="block text-gray-300 hover:text-white">
          Reorder Pages
        </Link>

      </div>

    </div>

    {/* CONVERT */}

    <div>

      <h3 className="text-red-500 font-semibold mb-4">
        CONVERT
      </h3>

      <div className="space-y-3 text-sm">

        <Link to="/jpg-to-pdf" className="block text-gray-300 hover:text-white">
          JPG to PDF
        </Link>

        <Link to="/pdf-to-jpg" className="block text-gray-300 hover:text-white">
          PDF to JPG
        </Link>

        <Link to="/word-to-pdf" className="block text-gray-300 hover:text-white">
          Word to PDF
        </Link>

        <Link to="/pdf-to-word" className="block text-gray-300 hover:text-white">
          PDF to Word
        </Link>

      </div>

    </div>

    {/* EDIT */}

    <div>

      <h3 className="text-red-500 font-semibold mb-4">
        EDIT
      </h3>

      <div className="space-y-3 text-sm">

        <Link to="/watermark-pdf" className="block text-gray-300 hover:text-white">
          Watermark PDF
        </Link>

        <Link to="/page-numbers-pdf" className="block text-gray-300 hover:text-white">
          Page Numbers
        </Link>

        <Link to="/crop-pdf" className="block text-gray-300 hover:text-white">
          Crop PDF
        </Link>

        <Link to="/rotate-pdf" className="block text-gray-300 hover:text-white">
          Rotate PDF
        </Link>

      </div>

    </div>

    {/* OPTIMIZE */}

    <div>

      <h3 className="text-red-500 font-semibold mb-4">
        OPTIMIZE
      </h3>

      <div className="space-y-3 text-sm">

        <Link to="/compress-pdf" className="block text-gray-300 hover:text-white">
          Compress PDF
        </Link>

        <Link to="/metadata-remover-pdf" className="block text-gray-300 hover:text-white">
          Metadata Remover
        </Link>

      </div>

    </div>

  </div>

</div>
            </div>

<Link
  to="/pricing"
  className="
    text-sm font-medium
    text-gray-300
    hover:text-white
    transition
  "
>
  PRICING
</Link>

<Link
  to="/about"
  className="
    text-sm font-medium
    text-gray-300
    hover:text-white
    transition
  "
>
  ABOUT US
</Link>

<Link
  to="/contact"
  className="
    text-sm font-medium
    text-gray-300
    hover:text-white
    transition
  "
>
  CONTACT
</Link>

                </nav>

</div>

          {/* RIGHT */}

          <div
            className="
              flex items-center gap-5
            "
          >

            <button
              className="
                text-gray-300
                hover:text-white
                text-sm font-medium
                transition
              "
            >
              Login
            </button>

            <button
              className="
                bg-red-600
                hover:bg-red-700
                text-white
                px-5 py-2.5
                rounded-xl
                text-sm font-medium
                transition
                shadow-lg shadow-red-600/20
              "
            >
              Sign up
            </button>

          </div>

        </div>

      </header>
  );
}