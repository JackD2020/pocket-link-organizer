
import React, { useState } from 'react';
import { useLinks, Link } from '../contexts/LinkContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2, Link as LinkIcon } from 'lucide-react';

export const LinkList: React.FC = () => {
  const { links, updateLink, deleteLink } = useLinks();
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (link: Link) => {
    setEditingLink(link);
    setUrl(link.url);
    setTitle(link.title);
    setDescription(link.description);
    setIsDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLink && url) {
      const formattedUrl = url.match(/^https?:\/\//) ? url : `http://${url}`;
      updateLink(editingLink.id, formattedUrl, title, description);
      setIsDialogOpen(false);
      setEditingLink(null);
    }
  };

  const handleOpenUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center md:text-left">Ваши ссылки</h2>
      
      {links.length === 0 ? (
        <div className="text-center p-8 md:p-12 border rounded-lg bg-gray-800/30 border-gray-700">
          <LinkIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Нет сохраненных ссылок</h3>
          <p className="mt-2 text-muted-foreground">Начните добавлять ссылки с помощью кнопки "Добавить ссылку"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {links.map((link) => (
            <Card key={link.id} className="link-card bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div 
                  className="cursor-pointer mb-2" 
                  onClick={() => handleOpenUrl(link.url)}
                >
                  <h3 className="text-lg font-medium text-primary hover:underline truncate">
                    {link.title || link.url}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                </div>
                {link.description && (
                  <p className="mt-2 text-sm line-clamp-3">{link.description}</p>
                )}
                <p className="mt-4 text-xs text-muted-foreground">
                  Добавлено: {formatDate(link.createdAt)}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-0">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleEdit(link)}
                  className="hover:bg-gray-700"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteLink(link.id)}
                  className="hover:bg-gray-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle>Редактировать ссылку</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-url">URL<span className="text-red-500">*</span></Label>
              <Input 
                id="edit-url" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                placeholder="https://example.com"
                required
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-title">Название</Label>
              <Input 
                id="edit-title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Пример названия"
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Описание</Label>
              <Textarea 
                id="edit-description" 
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
                  setEditingLink(null);
                }}
                className="border-gray-600 hover:bg-gray-700"
              >
                Отмена
              </Button>
              <Button type="submit">Обновить</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
