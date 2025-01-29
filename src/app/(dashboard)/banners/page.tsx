'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { uploadBanner, deleteBanner, fetchBanners } from '@/lib/appwrite';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Banner {
  id: string;
  name: string;
  url: string;
}

const BannersPage = () => {
  const { loggedUser, userLoading } = useAuth();
  const router = useRouter();

  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading && (!loggedUser || loggedUser.role !== 'admin')) {
      router.push('/sign-in');
    }
  }, [loggedUser, userLoading, router]);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const fetchedBanners = await fetchBanners();
        setBanners(fetchedBanners);
      } catch (error) {
        console.error('Error loading banners:', error);
      }
    };

    loadBanners();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file before uploading.');
      return;
    }

    setIsUploading(true);

    try {
      const newBannerId = await uploadBanner(selectedFile);
      const newBanner: Banner = {
        id: newBannerId,
        name: selectedFile.name,
        url: `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_PRODUCT_BUCKET}/files/${newBannerId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`,
      };

      setBanners((prevBanners) => [...prevBanners, newBanner]);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading banner:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);

    try {
      await deleteBanner(id);
      setBanners((prevBanners) => prevBanners.filter((banner) => banner.id !== id));
    } catch (error) {
      console.error('Error deleting banner:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Loader2 className="animate-spin text-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Banners Management</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload a Banner</h2>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="mb-4"
        />
        <Button onClick={handleUpload} disabled={isUploading}>
          {isUploading ? <Loader2 className="animate-spin" /> : 'Upload Banner'}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <Card key={banner.id}>
            <img src={banner.url} alt={banner.name} className="w-full h-40 object-cover rounded-t" />
            <CardContent>
              <p className="font-semibold">{banner.name}</p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="destructive"
                onClick={() => handleDelete(banner.id)}
                disabled={isDeleting === banner.id}
              >
                {isDeleting === banner.id ? <Loader2 className="animate-spin" /> : 'Delete'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BannersPage;