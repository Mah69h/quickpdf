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
          min-h-[calc(100vh-72px)]
          bg-gradient-to-br
          from-gray-950
          via-gray-900
          to-black
          text-white
        "
      >

        <div className="flex min-h-[calc(100vh-72px)]">

          {/* MAIN WORKSPACE */}

          <main
            className="
              flex-1
              min-w-0
              p-8
              overflow-hidden
            "
          >
            {children}
          </main>


          {/* RIGHT SIDEBAR */}

          <aside
            className="
              w-[340px]
              flex-shrink-0
              border-l
              border-white/10
              bg-black/20
              p-6
            "
          >
            {sidebar}
          </aside>

        </div>

      </div>
    </>
  );
}