import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  hideCancelButton?: boolean;
}

const DetailModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = '확인',
  message = '정말로 삭제하시겠습니까?',
  confirmText = '확인',
  cancelText = '취소',
  hideCancelButton = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-10 rounded-lg shadow-lg w-96">
        <h2 className="text-lg text-gray-900 mb-4 text-center font-bold">{title}</h2>
        <p className="text-center mb-6">{message}</p>
        <div className="flex justify-center space-x-2 mt-4">
          {!hideCancelButton && (
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
