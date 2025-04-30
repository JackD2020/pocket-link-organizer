
import React from 'react';
import { LinkList } from '../components/LinkList';
import { Header } from '../components/Header';
import { LinkProvider } from '../contexts/LinkContext';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <LinkProvider>
        <Header />
        <main className="container mx-auto px-4 py-6 md:py-8">
          <LinkList />
        </main>
      </LinkProvider>
    </div>
  );
};

export default Index;
