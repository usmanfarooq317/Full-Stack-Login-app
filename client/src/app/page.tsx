'use client';

import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-20">
      <main className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
          Welcome to the Login App
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-12">
          An end-to-end login and registration system crafted with best practices in security and modern development.
        </p>

        {/* Project Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <Image
                src="/nextjs-icon.svg"
                alt="Next.js Icon"
                width={40}
                height={40}
                className="mr-3"
              />
              <h2 className="text-2xl font-semibold text-gray-800">Frontend: Next.js</h2>
            </div>
            <p className="text-gray-600">
              The frontend is powered by <strong>Next.js</strong>, a React framework that delivers
              server-side rendering, static site generation, and a seamless developer experience.
              With Tailwind CSS, the UI is responsive, modern, and highly customizable, ensuring a
              delightful user experience across devices.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <Image
                src="/nestjs-icon.svg"
                alt="NestJS Icon"
                width={40}
                height={40}
                className="mr-3"
              />
              <h2 className="text-2xl font-semibold text-gray-800">Backend: NestJS</h2>
            </div>
            <p className="text-gray-600">
              The backend is built with <strong>NestJS</strong>, a progressive Node.js framework that
              provides a robust, scalable architecture. It handles authentication and user management
              through RESTful APIs, ensuring secure and efficient communication with the frontend.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <Image
                src="/postgresql-icon.svg"
                alt="PostgreSQL Icon"
                width={40}
                height={40}
                className="mr-3"
              />
              <h2 className="text-2xl font-semibold text-gray-800">Database: PostgreSQL</h2>
            </div>
            <p className="text-gray-600">
              User data is securely stored in <strong>PostgreSQL</strong>, a powerful open-source
              relational database. Managed with Prisma ORM, it ensures efficient data operations and
              seamless integration with the NestJS backend.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <svg
                className="w-10 h-10 text-blue-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-800">APIs: POST & GET</h2>
            </div>
            <p className="text-gray-600">
              The app leverages <strong>RESTful APIs</strong> with POST and GET methods for secure
              user registration, login, and data retrieval. These APIs enable smooth communication
              between the frontend and backend, powered by Axios for reliable HTTP requests.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition duration-300"
          >
            Get Started - Register
          </a>
          <a
            href="/login"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-full font-medium hover:bg-blue-50 transition duration-300"
          >
            Login
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-gray-600 text-center">
        <p>© 2025 Login App. Built with passion and modern technologies.</p>
      </footer>
    </div>
  );
}