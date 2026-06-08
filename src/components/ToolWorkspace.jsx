import Navbar from './Navbar';

export default function ToolWorkspace({
  title,
  children,
  sidebar
}) {
  return (
    <>
      <Navbar />

      <div
        className="
          min-h-screen
          bg-gradient-to-br
          from-gray-950
          via-gray-900
          to-black
          text-white
        "
      >

        <div className="border-b border-white/10">

          <h1
            className="
              text-4xl
              font-bold
              text-center
              py-8
            "
          >
            {title}
          </h1>

        </div>

        <div
          className="
            flex
            min-h-[calc(100vh-180px)]
          "
        >

          {/* LEFT WORKSPACE */}

          <div
            className="
              flex-1
              p-8
            "
          >
            {children}
          </div>

          {/* RIGHT PANEL */}

          <div
            className="
              w-[340px]
              border-l
              border-white/10
              bg-black/20
              p-6
            "
          >
            {sidebar}
          </div>

        </div>

      </div>
    </>
  );
}