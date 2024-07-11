'use client';

import { useState } from 'react';
import type { NextPage } from 'next';
import KakaoMap from '@/components/common/KakaoMap';
import Image from 'next/image';

const PostPage: NextPage = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [content, setContent] = useState('');
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 }); // 마커의 초기 위치는 임의로 설정

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
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

  const handleMarkerPositionChange = (position: { lat: number; lng: number }) => {
    setMarkerPosition(position);
  };

  const handleSubmit = () => {
    if (title && category && price && content) {
      if (confirm('작성을 완료하시겠습니까?')) {
        // 여기서 슈퍼베이스에 데이터 저장 로직 구현
        console.log('데이터를 저장합니다.');
        console.log({
          title,
          category,
          price,
          content,
          images,
          markerPosition
        });

        // 저장 후 필드 초기화
        setTitle('');
        setCategory('');
        setPrice('');
        setContent('');
        setImages([]);
        setCurrentIndex(0);
        setMarkerPosition({ lat: 0, lng: 0 }); // 마커 초기 위치 초기화
        // 파일 업로드 필드 초기화
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        console.log('작성이 취소되었습니다.');
      }
    } else {
      alert('제목, 카테고리, 금액, 내용을 모두 입력해주세요.');
    }
  };

  return (
    <div className="flex flex-col h-[800px]">
      <div className="flex-grow relative border-2 border-gray-300 mx-20 mt-10 mb-2 rounded-lg flex flex-col">
        <div className="absolute top-4 left-4 z-10">
          <p className="text-xl font-bold text-gray-800">판매등록하기</p>
        </div>
        <div className="absolute top-20 left-5 z-10 w-1/3 space-y-4">
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
            <input
              type="text"
              id="category"
              className="border border-gray-300 px-2 py-1"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
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
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="content" className="text-sm text-gray-700">
              내용
            </label>
            <textarea
              id="content"
              rows={4}
              className="border border-gray-300 px-2 py-1"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
        <div className="absolute top-20 right-16 z-10 w-538">
          <div className="flex flex-col space-y-1">
            <label htmlFor="image" className="text-sm text-gray-600">
              사진 등록
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              className="border border-gray-400 px-2 py-1 rounded-md"
              multiple
              onChange={handleImageUpload}
            />
            <div className="mt-2 relative" style={{ width: '538px' }}>
              {images.length > 4 && currentIndex > 0 && (
                <button
                  onClick={handlePrevious}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 p-1 bg-transparent focus:outline-none"
                >
                  {'<'}
                </button>
              )}
              <div className="flex space-x-0">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="w-40 h-40 border border-gray-300 rounded-md overflow-hidden">
                    {images[currentIndex + index] && (
                      <Image
                        src={images[currentIndex + index]}
                        alt={`preview-${index}`}
                        width={300}
                        height={300}
                        className="object-cover"
                      />
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
              <div className="absolute top-44 bottom-0 left-0 right-0 z-0">
                <p className="text-gray-600">거래 희망 위치</p>
                <KakaoMap onMarkerAddressChange={handleMarkerPositionChange} />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 z-10">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none"
          >
            작성 완료
          </button>
        </div>
        <hr className="border-t-2 border-gray mt-14 mb-8" />
      </div>
    </div>
  );
};

export default PostPage;
