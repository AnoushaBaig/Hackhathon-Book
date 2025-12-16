// Individual chat message component (JavaScript version)
import React from 'react';

const Message = ({ content, role, timestamp }) => {
  return (
    <div className={`chatbot-message ${role}`}>
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