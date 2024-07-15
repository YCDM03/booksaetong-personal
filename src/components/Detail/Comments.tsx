import React, { useEffect, useState } from 'react';
import { supabase } from '@/contexts/supabase.context';
import { useUserStore } from '@/zustand/userStore';
import Image from 'next/image';
import EditCommentModal from './EditCommentModal';
import DetailModal from './DetailModal';
import { useRouter } from 'next/navigation';

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
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoginAlertModalOpen, setLoginAlertModalOpen] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState<string | null>(null);
  const [currentCommentContent, setCurrentCommentContent] = useState('');
  const router = useRouter();

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
      setLoginAlertModalOpen(true);
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
  const handleDelete = async () => {
    if (currentCommentId) {
      try {
        await supabase.from('comments').delete().eq('id', currentCommentId);
        setComments(comments.filter((comment) => comment.id !== currentCommentId));
      } catch (error) {
        console.error('댓글 삭제 오류:', error);
      } finally {
        setDeleteModalOpen(false);
        setCurrentCommentId(null);
      }
    }
  };

  const openDeleteModal = (commentId: string) => {
    setCurrentCommentId(commentId);
    setDeleteModalOpen(true);
  };

  //수정
  const openEditModal = (commentId: string) => {
    const commentToUpdate = comments.find((comment) => comment.id === commentId);
    if (commentToUpdate) {
      setCurrentCommentId(commentId);
      setCurrentCommentContent(commentToUpdate.contents);
      setEditModalOpen(true);
    }
  };

  const handleEditSubmit = async (updatedContent: string) => {
    if (currentCommentId) {
      try {
        const { data: updatedComment, error } = await supabase
          .from('comments')
          .update({ contents: updatedContent, updated_at: new Date().toISOString() })
          .eq('id', currentCommentId)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setComments(comments.map((comment) => (comment.id === currentCommentId ? updatedComment : comment)));
      } catch (error) {
        console.error('댓글 수정 오류:', error);
      } finally {
        setEditModalOpen(false);
        setCurrentCommentId(null);
        setCurrentCommentContent('');
      }
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
          <div key={comment.id}>
            <div className="bg-white rounded-md p-4 mb-2 flex hover:bg-gray-50 transition-colors">
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
                    <button onClick={() => openEditModal(comment.id)} className="text-blue-500 hover:underline mr-2">
                      수정
                    </button>
                    <button onClick={() => openDeleteModal(comment.id)} className="text-red-500 hover:underline">
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

      {/* 수정 모달 */}
      <EditCommentModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialContent={currentCommentContent}
        onSubmit={handleEditSubmit}
      />

      {/* 삭제 확인 모달 */}
      <DetailModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDelete} />

      {/* 로그인 경고 모달 */}
      <DetailModal
        isOpen={isLoginAlertModalOpen}
        onClose={() => setLoginAlertModalOpen(false)}
        onConfirm={() => {
          setLoginAlertModalOpen(false);
          router.push('/login');
        }}
        title="로그인 필요"
        message="댓글을 작성하려면 로그인이 필요합니다."
        confirmText="로그인"
        hideCancelButton
      />
    </div>
  );
};

export default Comments;
