// LayoutWrapper component to wrap the chatbot with the main layout
import React from 'react';
import ChatBot from './index';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  return (
    <>
      {children}
      <ChatBot />
    </>
  );
};

export default LayoutWrapper;