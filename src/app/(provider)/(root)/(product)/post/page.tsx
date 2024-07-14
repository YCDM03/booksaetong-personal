'use client';

import { useState } from 'react';
import type { NextPage } from 'next';
import KakaoMap from '@/components/common/KakaoMap';
import Image from 'next/image';
import { supabase } from '@/contexts/supabase.context';
import { uuid } from 'uuidv4';
import { useUserStore } from '@/zustand/userStore';
import { useRouter } from 'next/navigation';
import { Notification } from '@/components/common/Alert';

const PostPage: NextPage = () => {
  const router = useRouter();
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
  const { id } = useUserStore((state) => ({ id: state.id }));

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
      setSelectedFiles([...selectedFiles, ...Array.from(files)]);
    }
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

  const handleImageClick = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  const handleMarkerPositionChange = (position: { lat: number; lng: number; address: string }) => {
    setMarkerPosition({ latitude: position.lat, longitude: position.lng });
    setAddress(position.address);
  };

  const imageUpload = async (selectedFile: File) => {
    const filePath = `products/${uuid()}_${Date.now()}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, selectedFile);
    if (uploadError) {
      console.error('업로드 오류:', uploadError);
      return;
    }

    const { data } = await supabase.storage.from('avatars').getPublicUrl(filePath);
    return data?.publicUrl;
  };

  const handleSubmit = async () => {
    if (!title) return setNotification({ message: '제목이 없습니다.', type: 'error' });
    if (!category) return setNotification({ message: '카테고리를 선택하세요.', type: 'error' });
    if (!price) return setNotification({ message: '금액이 없습니다.', type: 'error' });
    if (!contents) return setNotification({ message: '내용이 없습니다.', type: 'error' });
    if (images.length === 0) return setNotification({ message: '사진을 등록하세요.', type: 'error' });
    if (!address) return setNotification({ message: '주소가 없습니다.', type: 'error' });
    if (confirm('작성을 완료하시겠습니까?')) {
      try {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .insert([
            {
              user_id: id,
              title,
              category,
              price: parseFloat(price),
              contents,
              latitude: markerPosition.latitude,
              longitude: markerPosition.longitude,
              address
            }
          ])
          .select();

        if (productError) throw productError;

        const imageUrls = await Promise.all(selectedFiles.map((file) => imageUpload(file)));
        if (imageUrls.length !== selectedFiles.length) {
          deleteProduct(productData[0].id);
          throw new Error('이미지 업로드 오류');
        }

        const imageInsertData = imageUrls.map((imageUrl) => ({
          product_id: productData[0].id,
          image_url: imageUrl
        }));

        const { error: imageError } = await supabase.from('product_images').insert(imageInsertData);
        if (imageError) {
          deleteProduct(productData[0].id);
          throw imageError;
        }

        setTitle('');
        setCategory('');
        setPrice('');
        setContents('');
        setAddress('');
        setImages([]);
        setSelectedFiles([]);
        setCurrentIndex(0);
        setMarkerPosition({ latitude: 0, longitude: 0 });

        router.push('/');
      } catch (error) {
        console.error('데이터 저장 중 오류 발생:', onmessage);
      }
    } else {
      console.log('작성이 취소되었습니다.');
    }
  };

  const deleteProduct = async (productsId: string | number) => {
    const { error } = await supabase.from('products').delete().eq('Id', productsId);
    if (error) {
      console.error('상품 삭제 오류:', error.message);
    }
  };

  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };

  return (
    <div className="flex flex-col h-auto p-2 md:p-28">
      <div className="flex-grow relative border-2 border-bg-main rounded-lg flex flex-col p-4 md:p-10">
        <div className="mb-6">
          <p className="text-xl font-bold text-gray-800">판매등록하기</p>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          <div className="flex flex-col w-full md:w-1/2 space-y-4">
            <div className="flex flex-col space-y-1">
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

          <div className="flex flex-col w-full md:w-1/2 space-y-4">
            <div className="flex flex-col space-y-1">
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
                  <p className="text-gray-600">거래 희망 위치</p>
                  <KakaoMap onMarkerAddressChange={handleMarkerPositionChange} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-main text-white rounded-md shadow hover:bg-hover focus:outline-none"
          >
            작성 완료
          </button>
        </div>
      </div>
      {notification.message && <Notification message={notification.message} onClose={closeNotification} />}
    </div>
  );
};

export default PostPage;
