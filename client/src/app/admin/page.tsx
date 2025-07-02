'use client';

import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  password?: string;
}

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [editUser, setEditUser] = useState<User | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email: email.trim().toLowerCase(),
        password,
      });
      localStorage.setItem('token', response.data.access_token);
      const usersResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${response.data.access_token}` },
      });
      setUsers(usersResponse.data);
      setIsAdminLoggedIn(true);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      console.error('Admin login error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to log in or fetch user data. Please ensure backend is running.');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/users`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers([...users, response.data]);
      setNewUser({ name: '', email: '', password: '' });
      setError('');
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      console.error('Create user error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to create user.');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      const token = localStorage.getItem('token');
      const updateData: { name: string; email: string; password?: string } = {
        name: editUser.name,
        email: editUser.email,
      };
      if (editUser.password) {
        updateData.password = editUser.password;
      }
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/${editUser.id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map((user) => (user.id === editUser.id ? response.data : user)));
      setEditUser(null);
      setError('');
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      console.error('Update user error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to update user.');
    }
  };

  const handleDeleteUser = async (id: number, email: string) => {
    if (email === 'admin@gmail.com') return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== id));
      setError('');
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      console.error('Delete user error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to delete user.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isAdminLoggedIn) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(response.data);
        } catch (err: unknown) {
          const error = err as AxiosError<{ message?: string }>;
          console.error('Fetch users error:', error.response?.data || error.message);
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

      {/* Create User Form */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Create New User</h3>
        <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="new-name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="new-name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="new-email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="new-email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="new-password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Create User
            </button>
          </div>
        </form>
      </div>

      {/* Update User Form */}
      {editUser && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Edit User (ID: {editUser.id})</h3>
          <form onSubmit={handleUpdateUser} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="edit-name"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="edit-email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="edit-password" className="block text-sm font-medium text-gray-700">Password (optional)</label>
              <input
                type="password"
                id="edit-password"
                value={editUser.password || ''}
                onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>
            <div className="sm:col-span-3 flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Update User
              </button>
              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* User List */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
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
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {user.email === 'admin@gmail.com' ? (
                      <span className="text-gray-400">No actions allowed</span>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditUser({ ...user, password: '' })}
                          className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
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