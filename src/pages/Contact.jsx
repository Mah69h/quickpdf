import Navbar from "../components/Navbar";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-20">

        {/* HERO */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Contact Us
          </h1>

          <p className="text-gray-400 text-lg mt-5 max-w-2xl mx-auto leading-8">
            Have a question, suggestion, or found an issue?
            We'd love to hear from you.
          </p>
        </div>

        {/* CONTACT CONTENT */}
        <div className="mt-14 grid md:grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-8">

            <h2 className="text-2xl font-semibold">
              Get in touch
            </h2>

            <p className="text-gray-400 mt-3 leading-7">
              Whether you need help with QuickPDF or have
              feedback about our tools, send us a message.
            </p>

            <div className="mt-8 space-y-5">

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center">
                  ✉️
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <p className="text-white">
                    support@quickpdf.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center">
                  💬
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Support
                  </p>

                  <p className="text-white">
                    We're here to help.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT — FORM */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-8">

            <h2 className="text-2xl font-semibold mb-6">
              Send us a message
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="space-y-5"
            >

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Your name"
                  className="
                    w-full
                    bg-gray-950
                    border border-gray-800
                    rounded-xl
                    px-4 py-3
                    text-white
                    placeholder-gray-600
                    outline-none
                    focus:border-red-500
                    transition
                  "
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="
                    w-full
                    bg-gray-950
                    border border-gray-800
                    rounded-xl
                    px-4 py-3
                    text-white
                    placeholder-gray-600
                    outline-none
                    focus:border-red-500
                    transition
                  "
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Message
                </label>

                <textarea
                  rows="5"
                  placeholder="How can we help?"
                  className="
                    w-full
                    bg-gray-950
                    border border-gray-800
                    rounded-xl
                    px-4 py-3
                    text-white
                    placeholder-gray-600
                    outline-none
                    focus:border-red-500
                    transition
                    resize-none
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  w-full
                  bg-red-600
                  hover:bg-red-500
                  text-white
                  font-semibold
                  py-3
                  rounded-xl
                  transition
                  shadow-lg
                  shadow-red-600/20
                "
              >
                Send Message
              </button>

            </form>

          </div>

        </div>

      </main>
    </div>
  );
}