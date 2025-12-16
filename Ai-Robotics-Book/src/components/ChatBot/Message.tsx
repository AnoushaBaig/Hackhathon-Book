// Individual chat message component
import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';

interface MessageProps {
  content: string;
  role: 'user' | 'assistant';
  timestamp?: Date;
}

const Message: React.FC<MessageProps> = ({ content, role, timestamp }) => {
  const { colorMode } = useColorMode();

  return (
    <div className={`chatbot-message ${role} ${colorMode}`}>
      <div className="chatbot-message-content">
        {content}
      </div>
      {timestamp && (
        <div className="chatbot-message-timestamp">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  );
};

export default Message;