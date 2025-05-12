
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { getLinks, saveLinks, Link as LinkType } from '../services/linkService';

export interface Link extends LinkType {}

interface LinkContextType {
  links: Link[];
  addLink: (url: string, title: string, description: string) => void;
  updateLink: (id: string, url: string, title: string, description: string) => void;
  deleteLink: (id: string) => void;
  isLoading: boolean;
}

const LinkContext = createContext<LinkContextType | undefined>(undefined);

export const LinkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load links from the server on component mount
  useEffect(() => {
    const fetchLinks = async () => {
      setIsLoading(true);
      try {
        const serverLinks = await getLinks();
        setLinks(serverLinks);
      } catch (error) {
        console.error('Failed to fetch links:', error);
        toast.error('Не удалось загрузить ссылки с сервера');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
  }, []);

  // Save links to the server whenever they change
  const persistLinks = async (updatedLinks: Link[]) => {
    try {
      await saveLinks(updatedLinks);
    } catch (error) {
      console.error('Failed to save links:', error);
      toast.error('Не удалось сохранить ссылки на сервере');
    }
  };

  const addLink = (url: string, title: string, description: string) => {
    const newLink: Link = {
      id: Date.now().toString(),
      url,
      title,
      description,
      tags: [],
      createdAt: new Date().toISOString(),
    };

    const updatedLinks = [newLink, ...links];
    setLinks(updatedLinks);
    persistLinks(updatedLinks);
    toast.success('Ссылка добавлена');
  };

  const updateLink = (id: string, url: string, title: string, description: string) => {
    const updatedLinks = links.map((link) =>
      link.id === id ? { ...link, url, title, description } : link
    );
    setLinks(updatedLinks);
    persistLinks(updatedLinks);
    toast.success('Ссылка обновлена');
  };

  const deleteLink = (id: string) => {
    const updatedLinks = links.filter((link) => link.id !== id);
    setLinks(updatedLinks);
    persistLinks(updatedLinks);
    toast.success('Ссылка удалена');
  };

  return (
    <LinkContext.Provider value={{ links, addLink, updateLink, deleteLink, isLoading }}>
      {children}
    </LinkContext.Provider>
  );
};

export const useLinks = () => {
  const context = useContext(LinkContext);
  if (context === undefined) {
    throw new Error('useLinks must be used within a LinkProvider');
  }
  return context;
};
