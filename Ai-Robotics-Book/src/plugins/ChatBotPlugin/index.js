// Global ChatBot Plugin for Docusaurus
import React from 'react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import ChatBot from '../../components/ChatBot';

// This component will be rendered globally
const GlobalChatBot = () => {
  const doc = useDoc();

  // Only render on docs pages, or render everywhere
  // For now, we'll render it on all pages
  return <ChatBot />;
};

export default GlobalChatBot;