import React, { useEffect, useState } from 'react';

interface EditCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent: string;
  onSubmit: (updatedContent: string) => void;
  titleText?: string;
}

const EditCommentModal: React.FC<EditCommentModalProps> = ({
  isOpen,
  onClose,
  initialContent,
  onSubmit,
  titleText
}) => {
  const [updatedContent, setUpdatedContent] = useState(initialContent);

  // 초기 콘텐츠가 변경될 때마다 상태 업데이트
  useEffect(() => {
    if (isOpen) {
      setUpdatedContent(initialContent);
    }
  }, [isOpen, initialContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(updatedContent);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-10 rounded-lg shadow-lg w-96">
        <h2 className="text-lg text-gray-900 mb-4 text-center font-bold">댓글 수정</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            rows={4}
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
            className="resize-none w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-main"
            placeholder="댓글 내용을 입력하세요."
            autoFocus
          />
          <div className="flex justify-center space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              닫기
            </button>
            <button type="submit" className="py-2 px-4 bg-main text-white rounded-md hover:bg-hover">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCommentModal;
