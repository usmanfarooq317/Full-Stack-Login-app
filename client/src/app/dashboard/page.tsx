'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      router.push('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/auth/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user data');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Dashboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
      <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          router.push('/login');
        }}
        className="mt-6 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}