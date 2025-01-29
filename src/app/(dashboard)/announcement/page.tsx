'use client'

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { fetchAnnouncement, updateAnnouncement, deleteAnnouncement, createAnnouncement } from '@/lib/appwrite'; // Assuming this is the correct import path
import { Loader2, PenIcon, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

// Sample announcement data
interface Announcement {
  id: string;
  message: string;
  isActive: boolean;
}

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [message, setMessage] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(false);


  const { loggedUser, userLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!userLoading && (!loggedUser || loggedUser.role !== "admin")) {
      router.push("/sign-in");
    }
  }, [loggedUser, userLoading, router]);

  if (userLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
          <Loader2 className="animate-spin text-foreground"/>
      </div>
    ) 
  }
    
  if (!loggedUser || loggedUser.role !== "admin") return null;


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchAnnouncement();
        if (response) {

          const result = response.documents.map((res: any) => ({
            id: res.$id,
            message: res.message,
            isActive: res.isActive,
          }))
          setAnnouncements(result);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleCreate = async () => {
    if (message) {
      const newAnnouncement = {
        message,
        isActive,
      };

      try {
        const response = await createAnnouncement(newAnnouncement);
        const createdAnnouncement = { ...newAnnouncement, id: response.$id };
        setAnnouncements([...announcements, createdAnnouncement]);
        resetForm();
      } catch (error) {
        console.error("Error creating announcement:", error);
      }
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditing(announcement);
    setMessage(announcement.message);
    setIsActive(announcement.isActive);
  };

  const handleUpdate = async () => {
    if (editing) {
      const updatedAnnouncement: Announcement = {
        ...editing,
        message,
        isActive,
      };
      try {
        await updateAnnouncement(updatedAnnouncement.id, {message, isActive});
        setAnnouncements(
          announcements.map((announcement) =>
            announcement.id === updatedAnnouncement.id ? updatedAnnouncement : announcement
          )
        );
        resetForm();
      } catch (error) {
        console.error("Error updating announcement:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAnnouncement(id);
      setAnnouncements(announcements.filter((announcement) => announcement.id !== id));
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const resetForm = () => {
    setMessage('');
    setIsActive(false);
    setEditing(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Announcements</h1>

      <div className="mb-6">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter announcement message"
          className="w-full mb-4"
        />
        <div className="flex items-center mb-4">
          <label className="mr-2">Active</label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive((prev) => !prev)}
          />
        </div>
        <Button onClick={editing ? handleUpdate : handleCreate}>
          {editing ? 'Update Announcement' : 'Create Announcement'}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Message</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            announcements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell>{announcement.message}</TableCell>
                <TableCell>{announcement.isActive ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(announcement)} className="mr-2 mb-2">
                    <PenIcon/>
                  </Button>
                  <Button
                    onClick={() => handleDelete(announcement.id)}
                    variant="destructive"
                  >
                    <Trash2/>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AnnouncementPage;