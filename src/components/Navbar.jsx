import logo from '../assets/logo.png';

export default function Navbar() {

  return (

    <header className="
      sticky top-0 z-50
      w-full
      bg-[#0b1120]/95
      backdrop-blur-md
      border-b border-white/5
    ">

      <div className="
  w-full
  pl-0 pr-4 md:pl-0 md:pr-10
  h-[72px]
  flex items-center justify-between
">

        {/* LEFT SIDE */}

        <div className="flex items-center gap-4">

          {/* LOGO */}

          <img
            src={logo}
            alt="QuickPDF"
            className="
              w-[300px]
              object-contain
              cursor-pointer
            "
          />

          {/* NAV LINKS */}

          <nav className="
            hidden md:flex
            items-center gap-10
          ">

            <a
              href="#tools"
              className="
                text-sm font-medium
                text-gray-300
                hover:text-white
                transition
              "
            >
              MERGE PDF
            </a>

            <a
              href="#tools"
              className="
                text-sm font-medium
                text-gray-300
                hover:text-white
                transition
              "
            >
              SPLIT PDF
            </a>

            <a
              href="#tools"
              className="
                text-sm font-medium
                text-gray-300
                hover:text-white
                transition
              "
            >
              COMPRESS PDF
            </a>

            <a
              href="#tools"
              className="
                text-sm font-medium
                text-gray-300
                hover:text-white
                transition
              "
            >
              CONVERT PDF
            </a>

          </nav>

        </div>

        {/* RIGHT SIDE */}

        <div className="
          flex items-center gap-5
        ">

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