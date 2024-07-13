'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/contexts/supabase.context';
import { v4 as uuidv4 } from 'uuid';
import KakaoMap from '@/components/common/KakaoMap';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/zustand/userStore';
import { Notification } from '@/components/common/Alert';

const EditPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const productId = params.id;
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [contents, setContents] = useState('');
  const [markerPosition, setMarkerPosition] = useState({ latitude: 0, longitude: 0 });
  const [address, setAddress] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const { id } = useUserStore((state) => ({
    id: state.id
  }));

  // 이미지 업로드 함수
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
      setSelectedFiles([...selectedFiles, ...Array.from(files)]);
    }
  };

  // 이미지 삭제 함수
  const handleImageClick = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  const handleNext = () => {
    if (currentIndex < images.length - 4) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMarkerPositionChange = (position: { lat: number; lng: number; address: string }) => {
    setMarkerPosition({ latitude: position.lat, longitude: position.lng });
    setAddress(position.address); // 주소 정보 업데이트
  };

  // 폼 제출 처리
  const handleSubmit = async () => {
    if (!title) return setNotification({ message: '제목이 없습니다.', type: 'error' });
    if (!category) return setNotification({ message: '카테고리를 선택하세요.', type: 'error' });
    if (!price) return setNotification({ message: '금액이 없습니다.', type: 'error' });
    if (!contents) return setNotification({ message: '내용이 없습니다.', type: 'error' });
    if (images.length === 0) return setNotification({ message: '사진을 등록하세요.', type: 'error' });
    if (!address) return setNotification({ message: '주소가 없습니다.', type: 'error' });
    if (title && category && price && contents && address && images.length > 0) {
      let imageUrls = images;
      if (selectedFiles.length > 0) {
        // 새 이미지가 있을 경우 업로드
        imageUrls = await Promise.all(selectedFiles.map((file) => imageUpload(file)));
      }
      if (confirm('작성을 완료하시겠습니까?')) {
        try {
          // 기존 상품 업데이트
          const { error: updateError } = await supabase
            .from('products')
            .update({
              title,
              category,
              price: parseFloat(price),
              contents,
              latitude: markerPosition.latitude,
              longitude: markerPosition.longitude,
              address
            })
            .eq('id', productId);

          if (updateError) {
            throw updateError;
          }

          setNotification({ message: '상품 데이터가 성공적으로 업데이트되었습니다.', type: 'success' });
          // 이미지 데이터 업로드 및 업데이트
          const imageUrls = await Promise.all(selectedFiles.map((file) => imageUpload(file)));
          if (imageUrls.length !== selectedFiles.length) {
            throw new Error('이미지 업로드 중 문제가 발생했습니다.');
          }

          if (selectedFiles.length > 0) {
            const { error: deleteError } = await supabase.from('product_images').delete().eq('product_id', productId);

            if (deleteError) {
              throw deleteError;
            }
          }

          const imageInsertData = imageUrls.map((imageUrl) => ({
            product_id: productId,
            image_url: imageUrl
          }));

          const { error: insertError } = await supabase.from('product_images').insert(imageInsertData);

          if (insertError) {
            throw insertError;
          }

          console.log('이미지 데이터를 저장했습니다.');

          // 필드 초기화
          setTitle('');
          setCategory('');
          setPrice('');
          setContents('');
          setAddress('');
          setImages([]);
          setSelectedFiles([]);
          setCurrentIndex(0);
          setMarkerPosition({ latitude: 0, longitude: 0 });

          console.log('모든 데이터 저장을 완료했습니다.');
          router.push('/');
        } catch (error) {
          console.error('데이터 저장 중 오류 발생:', onmessage);
        }
      } else {
        console.log('작성이 취소되었습니다.');
      }
    }
  };

  // 이미지 업로드 함수
  const imageUpload = async (selectedFile: File) => {
    const filePath = `products/${uuidv4()}_${Date.now()}`;

    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, selectedFile);
    if (uploadError) {
      console.error('업로드 에러:', uploadError);
      throw uploadError;
    }

    const { data } = await supabase.storage.from('avatars').getPublicUrl(filePath);

    if (!data || !data.publicUrl) {
      console.error('public URL 반환 에러');
      throw new Error('public URL을 가져올 수 없습니다.');
    }

    return data.publicUrl;
  };

  useEffect(() => {
    // 기존 상품 데이터 불러오기
    const fetchProductData = async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', productId).single();

      if (id !== null && id !== undefined && id !== data.user_id) {
        router.push('/login');
        return;
      }

      if (error) {
        console.error('상품 데이터 불러오기 오류:', error);
      } else {
        debugger;
        setTitle(data.title);
        setCategory(data.category);
        setPrice(data.price.toString());
        setContents(data.contents);
        setMarkerPosition({ latitude: data.latitude, longitude: data.longitude });
        setAddress(data.address);
      }

      // 기존 이미지 데이터 불러오기
      const { data: imageData, error: imageError } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', productId);

      if (imageError) {
        console.error('이미지 데이터 불러오기 오류:', imageError);
      } else {
        setImages(imageData.map((img) => img.image_url));
      }
    };

    fetchProductData();
  }, [productId, id]);

  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };

  return (
    <div className="flex flex-col h-auto p-2 md:p-28">
      {/* 전체 컨테이너 */}

      <div className="flex-grow relative border-2 border-bg-main rounded-lg flex flex-col p-4 md:p-10">
        {/* 판매 등록 폼 컨테이너 */}

        <div className="mb-6">
          {/* 제목 */}
          <p className="text-xl font-bold text-gray-800">내 글 수정하기</p>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* 왼쪽 폼 필드 컨테이너 */}

          <div className="flex flex-col w-full md:w-1/2 space-y-4">
            <div className="flex flex-col space-y-1">
              {/* 제목 입력 필드 */}
              <label htmlFor="title" className="text-sm text-gray-700">
                제목
              </label>
              <input
                type="text"
                id="title"
                className="border border-gray-300 px-2 py-1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-1">
              {/* 카테고리 선택 필드 */}
              <label htmlFor="category" className="text-sm text-gray-700">
                카테고리
              </label>
              <select
                id="category"
                className="border border-gray-300 px-2 py-1"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">카테고리를 선택하세요</option>
                <option value="경제경영">경제경영</option>
                <option value="만화">만화</option>
                <option value="사회과학">사회과학</option>
                <option value="소설/시/희곡">소설/시/희곡</option>
                <option value="어린이">어린이</option>
                <option value="에세이">에세이</option>
                <option value="유아">유아</option>
                <option value="인문학">인문학</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label htmlFor="price" className="text-sm text-gray-700">
                금액
              </label>
              <input
                type="text"
                id="price"
                className="border border-gray-300 px-2 py-1"
                value={price}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) && value.length <= 10) {
                    setPrice(value);
                  } else {
                    alert('숫자만 입력 가능합니다.');
                  }
                }}
                maxLength={10}
              />
            </div>

            <div className="flex flex-col space-y-1">
              {/* 내용 입력 필드 */}
              <label htmlFor="contents" className="text-sm text-gray-700">
                내용
              </label>
              <textarea
                id="contents"
                rows={4}
                className="border border-gray-300 px-2 py-1"
                value={contents}
                onChange={(e) => setContents(e.target.value)}
              />
            </div>
          </div>

          {/* 오른쪽 이미지 업로드 및 지도 컨테이너 */}
          <div className="flex flex-col w-full md:w-1/2 space-y-4">
            <div className="flex flex-col space-y-1">
              {/* 이미지 업로드 필드 */}
              <label htmlFor="image" className="text-sm text-gray-600">
                사진 등록
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                className="hidden "
                multiple
                onChange={handleImageUpload}
              />
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => document.getElementById('image')?.click()}
                  className="border border-gray-400 px-2 py-1 rounded-md bg-white"
                >
                  이미지 등록
                </button>

                <p className="text-sm text-gray-600">등록된 사진 수: {images.length}</p>
              </div>

              <div className="mt-2 relative w-full">
                {/* 이미지 미리보기 및 삭제 */}
                {images.length > 4 && currentIndex > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 p-1 bg-transparent focus:outline-none"
                  >
                    {'<'}
                  </button>
                )}
                <div className="flex space-x-0 overflow-x-auto">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="w-40 h-32 border border-gray-300 rounded-md overflow-hidden">
                      {images[currentIndex + index] && (
                        <div className="relative" onClick={() => handleImageClick(currentIndex + index)}>
                          <Image
                            src={images[currentIndex + index]}
                            alt={`preview-${index}`}
                            width={300}
                            height={300}
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm cursor-pointer hover:bg-opacity-70">
                            삭제
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {currentIndex < images.length - 4 && (
                  <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 bg-transparent focus:outline-none"
                  >
                    {'>'}
                  </button>
                )}
                <div className="mt-4">
                  {/* 거래 희망 위치 */}
                  <p className="text-gray-600">거래 희망 위치</p>
                  <KakaoMap onMarkerAddressChange={handleMarkerPositionChange} initialPosition={markerPosition} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          {/* 작성 완료 버튼 */}
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-main text-white rounded-md shadow hover:bg-hover focus:outline-none"
          >
            수정 완료
          </button>
        </div>
      </div>
      {notification.message && <Notification message={notification.message} onClose={closeNotification} />}
    </div>
  );
};

export default EditPage;
