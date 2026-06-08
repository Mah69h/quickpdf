import Navbar from './Navbar';

export default function ToolLayout({
  title,
  children
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
          px-6
          py-12
        "
      >

        <div className="max-w-6xl mx-auto">

          <h1
            className="
              text-4xl
              font-bold
              text-center
              mb-10
            "
          >
            {title}
          </h1>

          {children}

        </div>

      </div>
    </>
  );
}