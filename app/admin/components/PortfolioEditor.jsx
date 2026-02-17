'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UploadButton } from '@/utils/uploadthing';
import { Trash2, Edit, Plus } from 'lucide-react'; // Assuming lucide-react is installed with shadcn
import { Switch } from '@/components/ui/switch';

export default function PortfolioEditor() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customHtml: '',
    imageUrl: '',
    isLogo: false,
    tags: '',
    link: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    const url = editingItem ? `/api/portfolio/${editingItem._id}` : '/api/portfolio';
    const method = editingItem ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsDialogOpen(false);
        fetchItems();
        resetForm();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      customHtml: item.customHtml || '',
      imageUrl: item.imageUrl || '',
      isLogo: item.isLogo || false,
      tags: item.tags.join(', '),
      link: item.link || ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ title: '', description: '', customHtml: '', imageUrl: '', isLogo: false, tags: '', link: '' });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-500">
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Project' : 'New Project'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required 
                  className="bg-zinc-950 border-zinc-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Image</Label>
                <div className="flex items-center gap-4">
                  {formData.imageUrl && (
                    <img src={formData.imageUrl} alt="Preview" className={`w-16 h-16 rounded border border-zinc-800 ${formData.isLogo ? 'object-contain p-2 bg-zinc-900/10' : 'object-cover'}`} />
                  )}
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res?.[0]) {
                        setFormData({...formData, imageUrl: res[0].ufsUrl});
                      }
                    }}
                    onUploadError={(error) => {
                      alert(`ERROR! ${error.message}`);
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="is-logo" 
                  checked={formData.isLogo}
                  onCheckedChange={(checked) => setFormData({...formData, isLogo: checked})}
                />
                <Label htmlFor="is-logo">Logo Mode (Fixed Width / Contain)</Label>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="bg-zinc-950 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label>Custom HTML (Advanced)</Label>
                <Textarea 
                  value={formData.customHtml}
                  onChange={e => setFormData({...formData, customHtml: e.target.value})}
                  className="bg-zinc-950 border-zinc-700 font-mono text-xs h-32"
                  placeholder="<div style='...'>...</div>"
                />
              </div>

              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input 
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  className="bg-zinc-950 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label>Link URL</Label>
                <Input 
                  value={formData.link} 
                  onChange={e => setFormData({...formData, link: e.target.value})}
                  className="bg-zinc-950 border-zinc-700"
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600">
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <Card key={item._id} className="bg-zinc-950 border-zinc-800 text-zinc-100 overflow-hidden">
            {item.imageUrl && (
              <div className={`h-40 w-full overflow-hidden relative ${item.isLogo ? 'p-4 flex items-center justify-center' : ''}`}>
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className={`w-full h-full ${item.isLogo ? 'object-contain' : 'object-cover'}`} 
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="truncate">{item.title}</CardTitle>
            </CardHeader>
            <CardFooter className="flex justify-end gap-2">
              <Button size="icon" variant="ghost" onClick={() => startEdit(item)}>
                <Edit className="w-4 h-4 text-blue-400" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(item._id)}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
