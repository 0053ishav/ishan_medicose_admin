'use client';

import React, { useState, useEffect } from 'react';
import { fetchUsers } from '@/lib/appwrite';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

interface User {
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  dateOfBirth: string;
  state: string;
  cart: string[];
  phone: string;
  wish: string[];
}

const UsersPage = () => {
  const { loggedUser, userLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading && (!loggedUser || loggedUser.role !== 'admin')) {
      router.push('/sign-in');
    }
  }, [loggedUser, userLoading, router]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetchUsers();
        const formattedUsers = response.map((user: any) => ({
          email: user.email,
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
          city: user.city,
          postalCode: user.postalCode,
          dateOfBirth: user.dateOfBirth,
          state: user.state,
          cart: user.cart,
          phone: user.phone,
          wish: user.wish,
        }));
        setUsers(formattedUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Users Management</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border ">
          <thead>
            <tr className="">
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Address</th>
              <th className="border px-4 py-2">Cart</th>
              <th className="border px-4 py-2">Wishlist</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.userId} className={index % 2 === 0 ? '' : 'bg-gray-50'}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">
                  {user.firstName} {user.lastName}
                </td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.phone}</td>
                <td className="border px-4 py-2">
                  {user.address}, {user.city}, {user.state} - {user.postalCode}
                </td>
                <td className="border px-4 py-2">
                  {user.cart.length > 0 ? user.cart.join(', ') : 'None'}
                </td>
                <td className="border px-4 py-2">
                  {user.wish.length > 0 ? user.wish.join(', ') : 'None'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;