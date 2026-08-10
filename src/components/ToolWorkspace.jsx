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
          min-h-[calc(100vh-86px)]
          bg-gradient-to-br
          from-gray-950
          via-gray-900
          to-black
          text-white
        "
      >

        <div className="flex min-h-[calc(100vh-86px)]">

          {/* LEFT WORKSPACE */}
          <div className="flex-1 px-8 pt-3 pb-8">
            {children}
          </div>

          {/* RIGHT PANEL */}
          <div
            className="
              w-[340px]
              border-l
              border-white/10
              bg-black/20
              px-6
              pt-3
              pb-6
            "
          >
            {sidebar}
          </div>

        </div>

      </div>
    </>
  );
}