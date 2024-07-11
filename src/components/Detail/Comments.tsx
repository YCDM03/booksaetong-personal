'use client';

import React, { useState } from 'react';

const Comments = () => {
  const [comments, setComments] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 여기에 댓글 등록 로직 추가
  };

  return (
    <div className="w-full lg:w-[1000px] py-8">
      <h6 className="text-2xl font-bold mb-2">댓글</h6>
      {/* 댓글 작성 */}
      <div className="bg-gray-100 rounded-md p-4 flex items-end">
        <textarea
          rows={3}
          placeholder="댓글을 입력해주세요."
          className="resize-none flex-1 border-1 border-gray-300 bg-transparent px-2 py-2 rounded-md text-gray-800 focus:outline-none"
        ></textarea>
        <button
          type="submit"
          className="h-10 w-20 bg-black text-white rounded-md transition-colors hover:bg-gray-800 focus:outline-none ml-2"
          onClick={() => handleSubmit}
        >
          등록
        </button>
      </div>

      {/* 댓글 목록 */}
    </div>
  );
};

export default Comments;
