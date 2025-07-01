'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Login App</h1>
        <nav>
          <Link href="/login" className="px-4 py-2 hover:bg-blue-700 rounded transition">Login</Link>
          <Link href="/register" className="px-4 py-2 hover:bg-blue-700 rounded transition ml-2">Register</Link>
        </nav>
      </div>
    </header>
  );
}