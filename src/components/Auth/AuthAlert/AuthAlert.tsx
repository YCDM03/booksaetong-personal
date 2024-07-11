import React, { useEffect } from 'react';

interface AuthAlertProps {
  message: string;
  onClose: () => void;
  forLogin: boolean;
  success: boolean;
}

const AuthAlert: React.FC<AuthAlertProps> = ({ message, onClose, forLogin, success }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <>
      {message && (
        <div
          className={`fixed bottom-5 right-5 ${
            success ? (forLogin ? 'bg-main' : 'bg-sub') : 'bg-danger'
          } text-white px-8 py-6 rounded shadow z-50 w-72`}
        >
          {message}
          <div className="h-1  mt-2 rounded-full overflow-hidden w-full" />
        </div>
      )}
    </>
  );
};

export default AuthAlert;
