
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLinks } from '../contexts/LinkContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

export const Header: React.FC = () => {
  const { addLink, isLoading } = useLinks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Add http:// if the URL doesn't have a protocol
    const formattedUrl = url.match(/^https?:\/\//) ? url : `http://${url}`;
    
    addLink(formattedUrl, title, description);
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setUrl('');
    setTitle('');
    setDescription('');
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 shadow-md">
      <div className="container mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-primary">Pocket Link</h1>
          <p className="text-muted-foreground">Организатор ваших ссылок</p>
        </div>
        
        <Button onClick={() => setIsDialogOpen(true)} className="w-full md:w-auto" disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" /> Добавить ссылку
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle>Добавить новую ссылку</DialogTitle>
              <DialogDescription>
                Введите информацию о ссылке и нажмите "Сохранить".
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">URL<span className="text-red-500">*</span></Label>
                <Input 
                  id="url" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder="https://example.com"
                  required
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Название</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Пример названия"
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Добавьте описание ссылки..."
                  rows={3}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  className="border-gray-600 hover:bg-gray-700"
                >
                  Отмена
                </Button>
                <Button type="submit">Сохранить</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};
