import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  selectedImage: string | ArrayBuffer | null;
  setSelectedImage: (image: string | ArrayBuffer | null) => void;
  titleText?: string;
  uploadLabelText?: string;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  selectedImage,
  setSelectedImage,
  titleText = '프로필 이미지 변경',
  uploadLabelText = '이미지 가져오기'
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-10 rounded-lg shadow-lg">
        <h2 className="text-lg text-gray-900 mb-4 text-center font-bold">{titleText}</h2>
        <div className="w-64 h-64 bg-gray-300 mb-4 rounded-lg flex items-center justify-center">
          {selectedImage ? (
            <Image
              src={selectedImage as string}
              alt="Profile"
              className="w-full h-full object-cover rounded-lg"
              width={256}
              height={256}
            />
          ) : (
            <span className="text-gray-400">미리보기</span>
          )}
        </div>
        <input type="file" accept="image/*" className="hidden" id="file-input" onChange={handleImageChange} />
        <label
          htmlFor="file-input"
          className="mb-4 px-4 py-2 border rounded-lg flex items-center justify-center cursor-pointer"
        >
          <Image src="/assets/img/plus.png" alt="PlusIcon" width={12} height={12} className="mr-2" />
          {uploadLabelText}
        </label>
        <div className="flex space-x-2">
          <button
            onClick={handleImageUpload}
            className="w-full py-2 px-4 bg-main text-white font-semibold rounded-md shadow-sm hover:bg-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main"
          >
            저장
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-main text-white font-semibold rounded-md shadow-sm hover:bg-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
