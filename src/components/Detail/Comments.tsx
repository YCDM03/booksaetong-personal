import React, { useEffect, useState } from 'react';
import { supabase } from '@/contexts/supabase.context';
import { useUserStore } from '@/zustand/userStore';
import Image from 'next/image';

interface Comment {
  id: string;
  user_id: string;
  product_id: string;
  contents: string;
  created_at: string;
  updated_at?: string;
  profile_url: string | null;
  email: string;
}

interface User {
  id: string;
  profile_url: string | null;
  email: string;
}

interface CommentsProps {
  productId: string;
  userData: User[];
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
        console.error('댓글 불러오기 오류:', error);
      }
    };

    fetchComments();
  }, [productId]);

  //저장
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loggedInUserId) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const { data: newCommentData, error } = await supabase
        .from('comments')
        .insert([
          {
            user_id: loggedInUserId,
            product_id: productId,
            contents: newComment
          }
        ])
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

  //삭제
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

  const handleUpdate = async (commentId: string) => {
    try {
      const commentToUpdate = comments.find((comment) => comment.id === commentId);

      if (!commentToUpdate) {
        throw new Error('댓글을 찾을 수 없습니다.');
      }

      const updatedContents = prompt('수정할 내용을 입력해주세요', commentToUpdate.contents);

      if (updatedContents === null) {
        // 사용자가 취소 버튼을 눌렀을 때
        return;
      }

      // UI 즉시 반영
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, contents: updatedContents, updated_at: new Date().toISOString() }
            : comment
        )
      );

      const { data: updatedComment, error } = await supabase
        .from('comments')
        .update({ contents: updatedContents, updated_at: new Date().toISOString() })
        .eq('id', commentId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // 실제 서버 데이터 반영 후 UI 업데이트
      setComments(comments.map((comment) => (comment.id === commentId ? updatedComment : comment)));
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

  const getUserEmail = (userId: string): string => {
    const user = userData.find((u) => u.id === userId);

    if (user) {
      return user.email;
    } else {
      return '알 수 없음';
    }
  };

  const formatTime = (isoTimeString: string): string => {
    const date = new Date(isoTimeString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const renderUpdatedText = (comment: Comment) => {
    if (comment.updated_at) {
      return <span className="text-xs text-gray-400 ml-2">(수정됨)</span>;
    }
    return null;
  };

  return (
    <div className="w-full lg:w-[1000px] py-8">
      <h6 className="text-2xl font-bold my-[20px]">댓글</h6>
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
          className="h-10 w-20 bg-main text-white rounded-md transition-colors hover:bg-sub focus:outline-none ml-2"
        >
          등록
        </button>
      </form>

      <div>
        {comments.map((comment) => (
          <div>
            <div key={comment.id} className="bg-white rounded-md p-4 mb-2 flex hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 mr-4 relative">
                <Image
                  src={getUserProfileUrl(comment.user_id)}
                  alt="프로필 이미지"
                  fill
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="flex-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{getUserEmail(comment.user_id)}</p>
                </div>
                <div className="text-gray-800 inline-block" style={{ whiteSpace: 'pre-wrap' }}>
                  {comment.contents}
                </div>
                {renderUpdatedText(comment)}
                <p className="text-xs text-gray-400 mt-2">{formatTime(comment.created_at)}</p>
                {loggedInUserId === comment.user_id && (
                  <div className="mt-4">
                    <button onClick={() => handleUpdate(comment.id)} className="text-blue-500 hover:underline mr-2">
                      수정
                    </button>
                    <button onClick={() => handleDelete(comment.id)} className="text-red-500 hover:underline">
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
            {comments.length > 0 && <hr className="my-2 border-gray-100" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
