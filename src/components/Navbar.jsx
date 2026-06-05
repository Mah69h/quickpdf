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

        {/* LEFT */}

        <div className="flex items-center gap-10">

          <img
            src={logo}
            alt="QuickPDF"
            className="
              h-12
              object-contain
              cursor-pointer
            "
          />

          <nav
            className="
              hidden md:flex
              items-center gap-8
            "
          >

            {/* TOOLS */}

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
                Tools
                <span>▾</span>
              </button>

              {/* MEGA MENU COMING NEXT */}

            </div>

            <a
              href="/pricing"
              className="
                text-sm font-medium
                text-gray-300
                hover:text-white
                transition
              "
            >
              Pricing
            </a>

            <a
              href="/about"
              className="
                text-sm font-medium
                text-gray-300
                hover:text-white
                transition
              "
            >
              About Us
            </a>

            <a
              href="/contact"
              className="
                text-sm font-medium
                text-gray-300
                hover:text-white
                transition
              "
            >
              Contact
            </a>

          </nav>

        </div>

        {/* RIGHT */}

        <div
          className="
            flex items-center gap-5
          "
        >

          {/* SEARCH */}

          <button
            className="
              hidden md:flex
              text-xl
              text-gray-400
              hover:text-white
              transition
            "
          >
            🔍
          </button>

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