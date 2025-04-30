
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

export interface Link {
  id: string;
  url: string;
  title: string;
  description: string;
  createdAt: string;
}

interface LinkContextType {
  links: Link[];
  addLink: (url: string, title: string, description: string) => void;
  updateLink: (id: string, url: string, title: string, description: string) => void;
  deleteLink: (id: string) => void;
}

const LinkContext = createContext<LinkContextType | undefined>(undefined);

export const LinkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [links, setLinks] = useState<Link[]>([]);

  // Load links from localStorage on component mount
  useEffect(() => {
    const savedLinks = localStorage.getItem('pocket-links');
    if (savedLinks) {
      try {
        setLinks(JSON.parse(savedLinks));
      } catch (error) {
        console.error('Failed to parse saved links:', error);
        toast.error('Не удалось загрузить сохраненные ссылки');
      }
    }
  }, []);

  // Save links to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pocket-links', JSON.stringify(links));
  }, [links]);

  const addLink = (url: string, title: string, description: string) => {
    const newLink: Link = {
      id: Date.now().toString(),
      url,
      title,
      description,
      createdAt: new Date().toISOString(),
    };

    setLinks((prevLinks) => [newLink, ...prevLinks]);
    toast.success('Ссылка добавлена');
  };

  const updateLink = (id: string, url: string, title: string, description: string) => {
    setLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.id === id ? { ...link, url, title, description } : link
      )
    );
    toast.success('Ссылка обновлена');
  };

  const deleteLink = (id: string) => {
    setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
    toast.success('Ссылка удалена');
  };

  return (
    <LinkContext.Provider value={{ links, addLink, updateLink, deleteLink }}>
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
