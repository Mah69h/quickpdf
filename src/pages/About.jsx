import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-20">

        {/* HERO */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            About QuickPDF
          </h1>

          <p className="text-gray-400 text-lg mt-5 max-w-2xl mx-auto leading-8">
            Simple, fast and privacy-focused PDF tools designed
            to make working with documents easier.
          </p>
        </div>

        {/* STORY */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">

          <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold mb-4">
              Why QuickPDF?
            </h2>

            <p className="text-gray-400 leading-7">
              Working with PDFs shouldn't require complicated
              software or confusing interfaces. QuickPDF is built
              to provide straightforward tools that let you
              complete common PDF tasks quickly.
            </p>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold mb-4">
              Our Approach
            </h2>

            <p className="text-gray-400 leading-7">
              We focus on a clean interface, fast processing and
              privacy-conscious document handling so you can
              work with your files without unnecessary complexity.
            </p>
          </div>

        </div>

        {/* FEATURES */}
        <div className="mt-8 grid sm:grid-cols-3 gap-5">

          <div className="border border-gray-800 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold">
              Fast
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Get your PDF tasks done quickly.
            </p>
          </div>

          <div className="border border-gray-800 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold">
              Privacy Focused
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Designed with privacy in mind.
            </p>
          </div>

          <div className="border border-gray-800 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="font-semibold">
              Simple
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Powerful tools without unnecessary complexity.
            </p>
          </div>

        </div>

      </main>
    </div>
  );
}