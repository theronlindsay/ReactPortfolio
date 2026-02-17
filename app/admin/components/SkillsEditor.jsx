'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Trash2, Edit, Plus } from 'lucide-react';

// Dynamic import for EmojiPicker to avoid SSR issues
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });
import IconRenderer from '@/components/IconRenderer';

export default function SkillsEditor() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Icon', // 'Icon' or 'Emoji'
    value: '', // FA class or Emoji char
    category: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/skills');
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
    const url = editingItem ? `/api/skills/${editingItem._id}` : '/api/skills';
    const method = editingItem ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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
      await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      type: item.type,
      value: item.value,
      category: item.category || ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ name: '', type: 'Icon', value: '', category: '' });
    setShowEmojiPicker(false);
  };

  const onEmojiClick = (emojiObject) => {
    setFormData({ ...formData, value: emojiObject.emoji });
    setShowEmojiPicker(false);
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
              <Plus className="w-4 h-4 mr-2" /> Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 overflow-visible">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Skill' : 'New Skill'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Skill Name</Label>
                <Input 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required 
                  className="bg-zinc-950 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <RadioGroup 
                  defaultValue={formData.type} 
                  onValueChange={(val) => setFormData({...formData, type: val, value: ''})}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Icon" id="r-icon" />
                    <Label htmlFor="r-icon">FontAwesome Icon</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Emoji" id="r-emoji" />
                    <Label htmlFor="r-emoji">Emoji</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2 relative">
                <Label>Value</Label>
                {formData.type === 'Icon' ? (
                  <Input 
                    value={formData.value} 
                    onChange={e => setFormData({...formData, value: e.target.value})}
                    placeholder="e.g. fa-brands fa-react"
                    className="bg-zinc-950 border-zinc-700"
                  />
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-full justify-start text-2xl border-zinc-700 bg-zinc-950"
                    >
                      {formData.value || 'Select Emoji'}
                    </Button>
                    {showEmojiPicker && (
                      <div className="absolute top-full left-0 z-50 mt-2">
                        <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Input 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  placeholder="e.g. Frontend, DevOps"
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

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map(item => (
          <Card key={item._id} className="bg-zinc-950 border-zinc-800 text-zinc-100 flex flex-col items-center justify-center p-4">
            <div className="text-4xl mb-2 text-blue-400">
              {item.type === 'Emoji' ? (
                <span>{item.value}</span>
              ) : (
                <IconRenderer className={item.value} /> 
              )}
            </div>
            <h3 className="font-semibold text-center">{item.name}</h3>
            <p className="text-xs text-zinc-500">{item.category}</p>
            <div className="flex gap-2 mt-4">
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => startEdit(item)}>
                <Edit className="w-3 h-3 text-blue-400" />
              </Button>
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDelete(item._id)}>
                <Trash2 className="w-3 h-3 text-red-400" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
