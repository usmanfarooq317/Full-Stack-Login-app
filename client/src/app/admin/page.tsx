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

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // Authenticate admin via backend /auth/login
      const response = await axios.post('http://localhost:3000/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });
      localStorage.setItem('token', response.data.access_token);
      // Fetch all users after successful login
      const usersResponse = await axios.get('http://localhost:3000/auth/users', {
        headers: { Authorization: `Bearer ${response.data.access_token}` },
      });
      setUsers(usersResponse.data);
      setIsAdminLoggedIn(true);
    } catch (err: any) {
      console.error('Admin login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to log in or fetch user data. Please ensure backend is running.');
    }
  };

  // Check if already logged in and fetch users
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isAdminLoggedIn) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get('http://localhost:3000/auth/users', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(response.data);
        } catch (err: any) {
          console.error('Fetch users error:', err.response?.data || err.message);
          setIsAdminLoggedIn(false);
          setError('Session expired. Please log in again.');
        }
      };
      fetchUsers();
    }
  }, [isAdminLoggedIn]);

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleAdminLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login as Admin
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Dashboard - Registered Users</h2>
      {users.length === 0 ? (
        <p className="text-gray-600 text-center">No registered users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Created At</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="px-4 py-2 text-sm text-gray-600">{user.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{user.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{user.email}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {new Date(user.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button
        onClick={() => {
          localStorage.removeItem('token');
          setIsAdminLoggedIn(false);
          setEmail('');
          setPassword('');
          setUsers([]);
        }}
        className="mt-6 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}