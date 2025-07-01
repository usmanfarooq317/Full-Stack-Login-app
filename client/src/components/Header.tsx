'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md py-4 px-8">
      <nav className="max-w-4xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition">
          Login App
        </Link>
        <div className="flex flex-row gap-4 items-center">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition duration-300"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-full font-medium hover:bg-blue-50 transition duration-300"
          >
            Login
          </Link>
          <Link
            href="/admin"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-full font-medium hover:bg-blue-50 transition duration-300"
          >
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}