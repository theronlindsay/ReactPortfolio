'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, X } from 'lucide-react';
import { UploadButton } from '@/utils/uploadthing';
import IconRenderer from '@/components/IconRenderer';

export default function ProfileEditor() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    aboutText: '',
    imageUrl: '',
    socialLinks: []
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (data.success && data.data) {
        setFormData({
            aboutText: data.data.aboutText || '',
            imageUrl: data.data.imageUrl || '',
            socialLinks: data.data.socialLinks || []
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        alert('Profile saved successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addLink = () => {
    setFormData({
      ...formData,
      socialLinks: [...formData.socialLinks, { platform: '', url: '', icon: '' }]
    });
  };

  const removeLink = (index) => {
    const newLinks = [...formData.socialLinks];
    newLinks.splice(index, 1);
    setFormData({ ...formData, socialLinks: newLinks });
  };

  const updateLink = (index, field, value) => {
    const newLinks = [...formData.socialLinks];
    newLinks[index][field] = value;
    setFormData({ ...formData, socialLinks: newLinks });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Card className="bg-zinc-950 border-zinc-800 text-zinc-100 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <Label className="text-base">Profile Image</Label>
            <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                {formData.imageUrl ? (
                    <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-2 border-zinc-700 group">
                        <img src={formData.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-8 h-8 text-red-500" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                        <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                                if (res && res[0]) {
                                    setFormData({ ...formData, imageUrl: res[0].ufsUrl });
                                }
                            }}
                            onUploadError={(error) => {
                                alert(`ERROR! ${error.message}`);
                            }}
                        />
                    </div>
                )}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base">About Me</Label>
            <Textarea 
              value={formData.aboutText}
              onChange={e => setFormData({...formData, aboutText: e.target.value})}
              className="bg-zinc-950 border-zinc-700 min-h-[200px] text-base p-4"
            />
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Label className="text-base">Social Links</Label>
              <Button type="button" onClick={addLink} variant="outline" size="sm" className="border-green-600 text-green-500 hover:bg-green-900/20">
                <Plus className="w-4 h-4 mr-2" /> Add Link
              </Button>
            </div>
            
            {formData.socialLinks.map((link, index) => (
              <div key={index} className="flex gap-4 items-end p-6 border border-zinc-800 rounded-xl bg-zinc-900/30 relative group">
                <div className="space-y-2 flex-1">
                  <Label className="text-xs text-zinc-400">Platform</Label>
                  <Input 
                    value={link.platform} 
                    onChange={e => updateLink(index, 'platform', e.target.value)}
                    placeholder="GitHub"
                    className="bg-zinc-950 border-zinc-700"
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label className="text-xs text-zinc-400">Icon Class (FontAwesome)</Label>
                  <Input 
                    value={link.icon} 
                    onChange={e => updateLink(index, 'icon', e.target.value)}
                    placeholder="fa-brands fa-github"
                    className="bg-zinc-950 border-zinc-700"
                  />
                </div>
                <div className="space-y-2 flex-[2]">
                  <Label className="text-xs text-zinc-400">URL</Label>
                  <Input 
                    value={link.url} 
                    onChange={e => updateLink(index, 'url', e.target.value)}
                    placeholder="https://..."
                    className="bg-zinc-950 border-zinc-700"
                  />
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button type="button" size="icon-xs" variant="ghost" onClick={() => removeLink(index)} className="hover:bg-red-900/20 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
              </div>
            ))}
          </div>

          <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-500 text-lg py-6">
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
