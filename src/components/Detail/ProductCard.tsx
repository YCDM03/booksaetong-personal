import React, { useEffect, useState } from 'react';
import SwiperSlider from '../common/Swiper/Slider';
import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/outline';
import { supabase } from '@/contexts/supabase.context';
import { useUserStore } from '@/zustand/userStore';
import Image from 'next/image';
import Loading from '../common/Loading/LoadingCenter';
import { Product } from '@/api/detail/allProducts';
import { useRouter } from 'next/navigation';
import DetailModal from './DetailModal';
import { Notification } from '../common/Alert';

interface ProductCardProps {
  products: Product[];
  productImages: { [key: string]: string[] };
}

const ProductCard: React.FC<ProductCardProps> = ({ products, productImages }) => {
  const [liked, setLiked] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userProfileUrl, setUserProfileUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const router = useRouter();

  const { id: loggedInUserId } = useUserStore((state) => ({
    id: state.id
  }));

  useEffect(() => {
    const fetchLikedStatus = async () => {
      if (loggedInUserId && products.length > 0) {
        try {
          const { data, error } = await supabase
            .from('product_likes')
            .select('id')
            .eq('user_id', loggedInUserId)
            .eq('product_id', products[0].id);

          if (error) {
            if (error.code === 'PGRST116') {
              setLiked(false);
            } else {
              throw error;
            }
          } else if (data?.length > 0) {
            setLiked(true);
          }
        } catch (error) {
          console.error('좋아요 상태 가져오기 오류:', error);
        }
      }
    };

    const fetchUserData = async () => {
      if (products.length > 0) {
        try {
          const userId = products[0].user_id;
          const { data, error } = await supabase.from('users').select('email, profile_url').eq('id', userId).single();

          if (error) {
            throw error;
          } else if (data) {
            setUserEmail(data.email);
            setUserProfileUrl(
              data.profile_url ||
                'https://wwqtgagcybxbzyouattn.supabase.co/storage/v1/object/public/avatars/default_profile.png'
            );
          }
        } catch (error) {
          console.error('사용자 데이터 가져오기 오류:', error);
        }
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchLikedStatus(), fetchUserData()]);
      setIsLoading(false);
    };

    fetchData();
  }, [loggedInUserId, products]);

  const toggleLike = async (productId: string) => {
    if (!loggedInUserId) {
      alert('로그인이 필요합니다.');
      return;
    }

    const newLikedStatus = !liked;
    setLiked(newLikedStatus);

    try {
      if (newLikedStatus) {
        await supabase.from('product_likes').insert({
          user_id: loggedInUserId,
          product_id: productId
        });
      } else {
        await supabase.from('product_likes').delete().eq('user_id', loggedInUserId).eq('product_id', productId);
      }
    } catch (error) {
      console.error('좋아요 토글 오류:', error);
    }
  };

  const formatPrice = (price: number): string => {
    const formatted = new Intl.NumberFormat('en-US').format(price);
    return `${formatted}원`;
  };

  const handleDelete = async () => {
    if (productIdToDelete) {
      try {
        if (productImages[productIdToDelete]) {
          for (const imageUrl of productImages[productIdToDelete]) {
            const { error: deleteError } = await supabase.storage
              .from('avatars')
              .remove([`products/${imageUrl.split('/').pop()}`]);
            if (deleteError) {
              throw deleteError;
            }
          }
        }

        await supabase.from('comments').delete().eq('product_id', productIdToDelete);
        await supabase.from('product_likes').delete().eq('product_id', productIdToDelete);
        await supabase.from('products').delete().eq('id', productIdToDelete);

        setNotificationMessage('글이 성공적으로 삭제되었습니다.');
        router.push('/');
      } catch (error) {
        console.error('글 삭제 오류:', error);
        setNotificationMessage('삭제 중 오류가 발생했습니다.');
      } finally {
        setProductIdToDelete(null);
        setIsModalOpen(false);
      }
    }
  };

  const openDeleteModal = (productId: string) => {
    setProductIdToDelete(productId);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {notificationMessage && (
        <Notification message={notificationMessage} onClose={() => setNotificationMessage('정말로?')} />
      )}
      {products.length > 0 && (
        <div className="container flex justify-center my-10">
          <div className="min-w-[1200px] h-[480px] border-transparent rounded-md flex justify-center items-center place-content-evenly shadow-detail">
            <div className="w-[460px] h-[400px] overflow-hidden">
              {productImages[products[0].id] ? (
                <SwiperSlider images={productImages[products[0]?.id]} />
              ) : (
                <p>이미지를 불러오는 중...</p>
              )}
            </div>
            <div className="rounded-md w-[400px] h-[400px] flex flex-col justify-between p-4 ml-[40px]">
              <div>
                <p className="text-lg font-medium text-[16px] mb-1">[ {products[0].category} ]</p>
                <div className="flex">
                  <p className="font-bold text-3xl mr-5">{products[0].title}</p>
                  <div className="flex items-center">
                    <HeartIcon
                      className={`h-7 w-7 cursor-pointer ${
                        liked ? 'text-red-600 fill-current' : 'text-gray-400 stroke-current'
                      }`}
                      onClick={() => toggleLike(products[0].id)}
                    />
                  </div>
                </div>
                <p className="text-[#6A7280] mt-4">{products[0].address}</p>
                <p className="my-5 text-lg font-bold">{formatPrice(products[0].price)}</p>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Image
                    src={userProfileUrl}
                    alt="유저 프로필 이미지"
                    className=" w-14 h-14 rounded-full object-cover fill mr-2"
                    width={56}
                    height={56}
                  />
                  <div>
                    <p className="mb-1 text-sm">{userEmail}</p>
                    <p className="text-[#6A7280] text-sm">{products[0].address}</p>
                  </div>
                </div>
                {loggedInUserId === products[0].user_id && (
                  <div className="flex space-x-4 mt-6">
                    <Link href={`/edit/${products[0].id}`}>
                      <button className="bg-main text-white font-medium w-40 py-2.5 px-4 rounded-md hover:bg-hover">
                        글 수정하기
                      </button>
                    </Link>
                    <button
                      className="bg-red-600 text-white font-medium w-40 py-2.5 px-4 rounded-md hover:bg-red-700"
                      onClick={() => openDeleteModal(products[0].id)}
                    >
                      글 삭제하기
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <DetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleDelete} />
    </>
  );
};

export default ProductCard;
