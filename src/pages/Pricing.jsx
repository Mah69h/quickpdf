import Navbar from "../components/Navbar";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-20">

        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold">
            Simple, transparent pricing
          </h1>

          <p className="text-gray-400 mt-4">
            Powerful PDF tools without complicated plans.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">

          {/* FREE */}
          <div className="border border-gray-800 bg-gray-900/60 rounded-3xl p-8">
            <h2 className="text-xl font-semibold">
              Free
            </h2>

            <p className="text-gray-500 mt-2">
              Everything you need for everyday PDF tasks.
            </p>

            <div className="text-4xl font-bold mt-6">
              ₹0
              <span className="text-sm text-gray-500 font-normal">
                {" "}forever
              </span>
            </div>

            <ul className="mt-8 space-y-4 text-sm text-gray-300">
              <li>✓ PDF tools</li>
              <li>✓ Local processing</li>
              <li>✓ No account required</li>
              <li>✓ Fast processing</li>
            </ul>

            <button className="w-full mt-8 py-3 rounded-xl border border-gray-700 hover:bg-gray-800 transition">
              Get Started
            </button>
          </div>


          {/* PRO */}
          <div className="border border-red-500/30 bg-red-500/5 rounded-3xl p-8 relative">

            <div className="absolute top-5 right-5 bg-red-600 text-xs px-3 py-1 rounded-full">
              PRO
            </div>

            <h2 className="text-xl font-semibold">
              Pro
            </h2>

            <p className="text-gray-500 mt-2">
              For users who need more from QuickPDF.
            </p>

            <div className="text-4xl font-bold mt-6">
              Coming Soon
            </div>

            <ul className="mt-8 space-y-4 text-sm text-gray-300">
              <li>✓ Advanced PDF tools</li>
              <li>✓ Larger file limits</li>
              <li>✓ Batch processing</li>
              <li>✓ Premium features</li>
            </ul>

            <button
              disabled
              className="w-full mt-8 py-3 rounded-xl bg-gray-800 text-gray-500 cursor-not-allowed"
            >
              Coming Soon
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}