import React from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-10 rounded-lg shadow-lg w-96">
        <h2 className="text-lg text-gray-900 mb-4 text-center font-bold">삭제 확인</h2>
        <p className="text-center mb-6">정말로 삭제하시겠습니까?</p>
        <div className="flex justify-center space-x-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
