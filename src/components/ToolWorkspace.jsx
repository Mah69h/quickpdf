import Navbar from './Navbar';

export default function ToolWorkspace({
  title,
  children,
  sidebar
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">

      <Navbar />

      <div className="flex">

        {/* MAIN WORKSPACE */}
        <main className="flex-1 p-8">
          {children}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside
          className="
    w-[340px]
    border-l
    border-white/10
    bg-black/20
    p-6
    min-h-[calc(100vh-86px)]
          "
        >
          {sidebar}
        </aside>

      </div>

    </div>
  );
}