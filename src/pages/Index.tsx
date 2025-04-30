
import React from 'react';
import { LinkList } from '../components/LinkList';
import { Header } from '../components/Header';
import { LinkProvider } from '../contexts/LinkContext';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <LinkProvider>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <LinkList />
        </main>
      </LinkProvider>
    </div>
  );
};

export default Index;
