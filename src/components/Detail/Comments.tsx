import React, { useEffect, useState } from 'react';
import { supabase } from '@/contexts/supabase.context';
import { useUserStore } from '@/zustand/userStore';

interface Comment {
  id: string;
  user_id: string;
  product_id: string;
  contents: string;
  created_at: string;
}

interface User {
  id: string;
  profile_url: string | null; // 프로필 URL이 null일 수 있음을 표시
}

interface CommentsProps {
  productId: string;
  userData: User[]; // User 타입의 배열로 userData를 props로 받음
}

const Comments: React.FC<CommentsProps> = ({ productId, userData }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');

  const { id: loggedInUserId } = useUserStore((state) => ({
    id: state.id
  }));

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data: commentsData, error } = await supabase
          .from('comments')
          .select('*')
          .eq('product_id', productId)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setComments(commentsData || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loggedInUserId) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const { data: newCommentData, error } = await supabase
        .from('comments')
        .insert([{ user_id: loggedInUserId, product_id: productId, contents: newComment }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setComments([newCommentData, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('댓글 추가 오류:', error);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
      if (!confirmDelete) {
        return;
      }

      await supabase.from('comments').delete().eq('id', commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
    }
  };

  const handleUpdate = async (commentId: string, updatedContents: string) => {
    try {
      const { error } = await supabase.from('comments').update({ contents: updatedContents }).eq('id', commentId);

      if (error) {
        throw error;
      }

      setComments(
        comments.map((comment) => (comment.id === commentId ? { ...comment, contents: updatedContents } : comment))
      );
    } catch (error) {
      console.error('댓글 업데이트 오류:', error);
    }
  };

  const getUserProfileUrl = (userId: string): string => {
    const user = userData.find((u) => u.id === userId);
    return user && user.profile_url
      ? user.profile_url
      : `https://wwqtgagcybxbzyouattn.supabase.co/storage/v1/object/public/avatars/default_profile.png`;
  };

  return (
    <div className="w-full lg:w-[1000px] py-8">
      <h6 className="text-2xl font-bold mb-2">댓글</h6>
      {/* 댓글 작성 */}
      <form onSubmit={handleSubmit} className="bg-gray-100 rounded-md p-4 flex items-end mb-4">
        <textarea
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력해주세요."
          className="resize-none flex-1 border-1 border-gray-300 bg-transparent px-2 py-2 rounded-md text-gray-800 focus:outline-none"
        ></textarea>
        <button
          type="submit"
          className="h-10 w-20 bg-black text-white rounded-md transition-colors hover:bg-gray-800 focus:outline-none ml-2"
        >
          등록
        </button>
      </form>

      {/* 댓글 목록 */}
      <div>
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-md p-4 mb-2 flex hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 mr-4">
              <img
                src={getUserProfileUrl(comment.user_id)}
                alt="프로필 이미지"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-bold">{comment.user_id}</p>
              <p className="text-gray-800">{comment.contents}</p>
              {loggedInUserId === comment.user_id && (
                <div className="mt-2">
                  <button
                    onClick={() =>
                      handleUpdate(
                        comment.id,
                        prompt('수정할 내용을 입력해주세요', comment.contents) || comment.contents
                      )
                    }
                    className="text-blue-500 hover:underline mr-2"
                  >
                    수정
                  </button>
                  <button onClick={() => handleDelete(comment.id)} className="text-red-500 hover:underline">
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
