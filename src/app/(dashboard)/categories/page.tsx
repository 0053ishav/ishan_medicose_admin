'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/lib/appwrite';
import Image from 'next/image';
import { Loader2, Trash2, Edit2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

interface Category {
  id: string;
  categoryName: string;
  categoryImageUrl: string;
}

const CategoriesPage = () => {
  const { loggedUser, userLoading } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImageUrl, setCategoryImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const [editedCategoryImageUrl, setEditedCategoryImageUrl] = useState('');

  useEffect(() => {
    if (!userLoading && (!loggedUser || loggedUser.role !== "admin")) {
      router.push("/sign-in");
    }
  }, [loggedUser, userLoading, router]);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await fetchCategories();
        if (response) {
          setCategories(
            response.map((res: any) => ({
              id: res.$id,
              categoryName: res.categoryName,
              categoryImageUrl: res.categoryImageUrl,
            }))
          );
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories.');
      }
    };

    fetchAllCategories();
  }, []);

  if (userLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Loader2 className="animate-spin text-foreground" />
      </div>
    );
  }

  if (!loggedUser || loggedUser.role !== "admin") return null;

  const handleCreateCategory = async () => {
    if (!categoryName || !categoryImageUrl) {
      setError('Both category name and image URL are required.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await createCategory({ categoryName, categoryImageUrl });

      setCategories([...categories, {
        id: response.$id,
        categoryName: response.categoryName,
        categoryImageUrl: response.categoryImageUrl,
      }]);

      setCategoryName('');
      setCategoryImageUrl('');
    } catch (err) {
      console.error('Error creating category:', err);
      setError('Failed to create category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editedCategoryName || !editedCategoryImageUrl) {
      setError('Both category name and image URL are required.');
      return;
    }

    setError(null);

    try {
      const response = await updateCategory(id, {
        categoryName: editedCategoryName,
        categoryImageUrl: editedCategoryImageUrl,
      });

      setCategories(categories.map((cat) =>
        cat.id === id ? { id: response.$id, categoryName: response.categoryName, categoryImageUrl: response.categoryImageUrl } : cat
      ));
      setEditingCategoryId(null);
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category. Please try again.');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Categories Management</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Create a Category</h2>
        <Input placeholder="Category Name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="mb-4" />
        <Input placeholder="Category Image URL" value={categoryImageUrl} onChange={(e) => setCategoryImageUrl(e.target.value)} className="mb-4" />
        <Button onClick={handleCreateCategory} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : 'Create Category'}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <div className="flex items-center justify-center h-40">
              <Image src={category.categoryImageUrl} alt={category.categoryName} width={200} height={40} className="object-cover rounded-t" />
            </div>
            <CardContent>
              {editingCategoryId === category.id ? (
                <>
                  <Input placeholder="Category Name" value={editedCategoryName} onChange={(e) => setEditedCategoryName(e.target.value)} className="mb-2" />
                  <Input placeholder="Category Image URL" value={editedCategoryImageUrl} onChange={(e) => setEditedCategoryImageUrl(e.target.value)} className="mb-2" />
                </>
              ) : (
                <p className="font-semibold">{category.categoryName}</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              {editingCategoryId === category.id ? (
                <>
                  <Button onClick={() => handleUpdateCategory(category.id)} className="mr-2"><Save className="w-4 h-4" /></Button>
                  <Button variant="outline" onClick={() => setEditingCategoryId(null)}>Cancel</Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => { setEditingCategoryId(category.id); setEditedCategoryName(category.categoryName); setEditedCategoryImageUrl(category.categoryImageUrl); }} className="mr-2"><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="destructive" onClick={() => handleDeleteCategory(category.id)}><Trash2 className="w-4 h-4" /></Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
