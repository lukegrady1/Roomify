import React from 'react';
import { MessageCircle } from 'lucide-react';

interface ChatProps {
  listingId: string;
}

// This component has been replaced by the full messaging system
// It's kept for backward compatibility but redirects to proper messaging
const Chat: React.FC<ChatProps> = ({ listingId }) => {
  return (
    <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
      <div className="text-center">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">Use the messaging system</p>
        <p className="text-sm text-gray-500">
          Click "Contact Lister" on the listing page to start a conversation
        </p>
      </div>
    </div>
  );
};

export default Chat; 