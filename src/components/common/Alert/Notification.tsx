import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <>
      {message && (
        <div className="fixed bottom-5 right-5 bg-main text-white px-8 py-6 rounded shadow z-50 w-72">
          {message}
          <div className="h-1 bg-white mt-2 rounded-full overflow-hidden w-full">
            <div className="bg-gray-400 h-full animate-shrink"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;
