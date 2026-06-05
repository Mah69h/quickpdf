import { Link } from 'react-router-dom';

const categories = [
  {
    title: 'Organize PDF',
    tools: [
      { name: 'Merge PDF', path: '/merge-pdf', icon: '📄' },
      { name: 'Split PDF', path: '/split-pdf', icon: '✂️' },
      { name: 'Reorder PDF', path: '/reorder-pdf', icon: '🔀' },
      { name: 'Extract Pages', path: '/extract-pages', icon: '📑' },
      { name: 'Crop PDF', path: '/crop-pdf', icon: '✂️' },
      { name: 'Rotate PDF', path: '/rotate-pdf', icon: '🔄' }
    ]
  },

  {
    title: 'Convert PDF',
    tools: [
      { name: 'PDF to JPG', path: '/pdf-to-jpg', icon: '🖼️' },
      { name: 'JPG to PDF', path: '/jpg-to-pdf', icon: '📷' },
      { name: 'PDF to PNG', path: '/pdf-to-png', icon: '🌄' },
      { name: 'PNG to PDF', path: '/png-to-pdf', icon: '🖼️' },
      { name: 'PDF to Word', path: '/pdf-to-word', icon: '📝' },
      { name: 'PDF to Excel', path: '/pdf-to-excel', icon: '📊' }
    ]
  },

  {
    title: 'Optimize PDF',
    tools: [
      { name: 'Compress PDF', path: '/compress-pdf', icon: '⚡' },
      { name: 'Watermark PDF', path: '/watermark-pdf', icon: '💧' },
      { name: 'Protect PDF', path: '/protect-pdf', icon: '🔒' },
      { name: 'Remove Metadata', path: '/metadata-remover', icon: '🧹' }
    ]
  }
];

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">

      {categories.map((category) => (

        <div
          key={category.title}
          className="mb-20"
        >

          <h2
            className="
              text-3xl
              font-bold
              text-white
              mb-8
            "
          >
            {category.title}
          </h2>

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              gap-5
            "
          >

            {category.tools.map((tool) => (

              <Link
                key={tool.name}
                to={tool.path}
                className="
                  bg-gray-900
                  border border-gray-800
                  rounded-2xl
                  p-6
                  hover:border-red-500
                  transition
                "
              >

                <div className="text-4xl mb-4">
                  {tool.icon}
                </div>

                <p
                  className="
                    text-white
                    font-medium
                  "
                >
                  {tool.name}
                </p>

              </Link>

            ))}

          </div>

        </div>

      ))}

    </section>
  );
}