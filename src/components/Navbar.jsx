import logo from '../assets/logo.png';

export default function Navbar() {

  return (

    <div className="
      sticky top-0 z-50
      w-full
      border-b border-white/10
      bg-black/40
      backdrop-blur-xl
    ">

      <div className="
        max-w-7xl mx-auto
        px-6 py-4
        flex items-center justify-between
      ">

        {/* LOGO */}

        <div className="flex items-center gap-3 cursor-pointer">

          <img
            src={logo}
            alt="QuickPDF"
            className="w-40 object-contain"
          />

        </div>

        {/* NAV LINKS */}

        <div className="
          hidden md:flex
          items-center gap-8
          text-sm text-gray-300
        ">

          <a
            href="#tools"
            className="hover:text-white transition"
          >
            Tools
          </a>

          <a
            href="#features"
            className="hover:text-white transition"
          >
            Features
          </a>

          <a
            href="#footer"
            className="hover:text-white transition"
          >
            Contact
          </a>

        </div>

        {/* BUTTON */}

        <button className="
          bg-red-600 hover:bg-red-700
          px-5 py-2
          rounded-xl
          text-sm font-medium
          transition
        ">
          All Tools
        </button>

      </div>

    </div>
  );
}