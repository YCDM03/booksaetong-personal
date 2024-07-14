'use client';

import Page from '@/components/MyPage/Page';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/contexts/supabase.context';
import Image from 'next/image';
import { useUserStore } from '@/zustand/userStore';
import { LoadingCenter } from '@/components/common/Loading';
import { Notification } from '@/components/common/Alert';
import ImageUploadModal from '@/components/common/Modal/ImageUploadModal';
import SelectArea from '@/components/Auth/SignupPage/SelectArea';

function ProfilePage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);
  const [notification, setNotification] = useState('');
  const { id, nickname, address, profile_url, setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [localNickname, setLocalNickname] = useState(nickname || '');
  const [localAddress, setLocalAddress] = useState(address || '');
  const [localArea, setLocalArea] = useState('');
  const [localSubArea, setLocalSubArea] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const savedArea = localStorage.getItem('localArea');
      const savedSubArea = localStorage.getItem('localSubArea');

      if (id) {
        setLocalNickname(nickname || '');
        const [area, subArea] = (address || '').split(' ');
        setLocalArea(area || savedArea || '');
        setLocalSubArea(subArea || savedSubArea || '');
        setSelectedImage(profile_url);
      } else {
        if (savedArea) setLocalArea(savedArea);
        if (savedSubArea) setLocalSubArea(savedSubArea);
      }
      setIsLoading(false);
    };
    fetchUserData();
  }, [id, nickname, address, profile_url]);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const handleImageUpload = async (file: File) => {
    if (!id) return;

    // 새로운 이미지 업로드 경로 설정
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filePath = `profiles/${id}/${cleanFileName}`;

    // 기존 이미지 삭제
    if (profile_url) {
      const oldFileName = profile_url.split('/').pop();
      if (oldFileName) {
        await supabase.storage.from('avatars').remove([`profiles/${id}/${oldFileName}`]);
      }
    }

    // 새로운 이미지 업로드
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
      upsert: true
    });
    if (uploadError) {
      console.error('업로드에러 :', uploadError);
      setNotification('업로드 중 에러가 발생했습니다.');
      return;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

    if (!data || !data.publicUrl) {
      console.error('public URL 반환에러');
      return;
    }

    const publicURL = data.publicUrl;
    console.log('Public URL:', publicURL);

    const { error: updateError } = await supabase.from('users').update({ profile_url: publicURL }).eq('id', id);
    if (updateError) {
      console.error('프로필 URL을 업데이트하는 중 오류:', updateError);
      return;
    }

    // Zustand 스토어 업데이트
    if (id) {
      setUser(id, useUserStore.getState().email!, localNickname, publicURL, localAddress);
    }
    setNotification('프로필 이미지가 변경되었습니다.');
    setSelectedImage(publicURL);
    setModalOpen(false);
  };

  const handleImageResetClick = async () => {
    const defaultImageUrl = '/assets/img/profile-Image.png';

    // 기존 이미지 삭제
    if (profile_url) {
      const oldFileName = profile_url.split('/').pop();
      if (oldFileName) {
        await supabase.storage.from('avatars').remove([`profiles/${id}/${oldFileName}`]);
      }
    }

    const { error: updateError } = await supabase.from('users').update({ profile_url: defaultImageUrl }).eq('id', id);
    if (updateError) {
      console.error('프로필 URL을 업데이트하는 중 오류:', updateError);
      return;
    }

    // Zustand 스토어 업데이트
    if (id) {
      setUser(id, useUserStore.getState().email!, localNickname, defaultImageUrl, localAddress);
    }
    setNotification('기본 이미지가 적용되었습니다.');
    setSelectedImage(defaultImageUrl);
  };

  const handleSave = async () => {
    if (id) {
      const newAddress = `${localArea} ${localSubArea}`.trim();
      const { error } = await supabase
        .from('users')
        .update({ nickname: localNickname, address: newAddress })
        .eq('id', id);
      if (error) {
        console.error('사용자 데이터를 업데이트하는 중 오류:', error);
      } else {
        // Zustand 스토어 업데이트
        setUser(id, useUserStore.getState().email!, localNickname, profile_url!, newAddress);
        setNotification('프로필 정보가 변경되었습니다.');
      }
    }
    localStorage.setItem('localArea', localArea);
    localStorage.setItem('localSubArea', localSubArea);
  };

  const closeNotification = () => {
    setNotification('');
  };

  if (isLoading) {
    return <LoadingCenter />;
  }

  return (
    <Page title="프로필 수정">
      <div className="flex mt-1 items-start justify-center">
        <div className="w-96 bg-white p-6">
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 flex items-center justify-center">
              <div className="relative w-48 h-48 border-solid border-2">
                {selectedImage ? (
                  <Image
                    src={selectedImage as string}
                    alt="Profile"
                    className="object-cover w-full h-full"
                    width={160}
                    height={160}
                    priority
                  />
                ) : (
                  <Image
                    src="/assets/img/profile-Image.png"
                    alt="Profile"
                    className="object-cover w-full h-full"
                    width={160}
                    height={160}
                    priority
                  />
                )}{' '}
              </div>
            </div>
            <button
              onClick={openModal}
              className="text-xs mt-1 text-gray-600 border-solid border-2 rounded-md hover:bg-hover w-48 h-8"
            >
              프로필사진 변경
            </button>
            <button
              onClick={handleImageResetClick}
              className="text-xs mt-1 text-gray-600 border-solid border-2 rounded-md hover:bg-hover w-48 h-8"
            >
              기본이미지 적용
            </button>
          </div>
          <div className="mt-6 w-full max-w-[12rem] md:max-w-full mx-auto">
            <div className="mb-4">
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                닉네임
              </label>
              <input
                type="text"
                id="nickname"
                value={localNickname}
                onChange={(e) => setLocalNickname(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-400 box-border"
              />
            </div>
            <label htmlFor="nickname" className="block mb-1 text-sm font-medium text-gray-700">
              주&nbsp;&nbsp;&nbsp;소
            </label>
            <div className="p-2 mb-4 border border-gray-300 rounded-md shadow-sm">
              <SelectArea area={localArea} subArea={localSubArea} setArea={setLocalArea} setSubArea={setLocalSubArea} />
            </div>
            <button
              onClick={handleSave}
              className="w-full py-3 px-4 bg-main text-white font-semibold rounded-md shadow-sm hover:bg-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main"
            >
              저장
            </button>
          </div>
        </div>
      </div>

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onUpload={handleImageUpload}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        titleText="프로필 이미지 변경"
        uploadLabelText="이미지 가져오기"
      />

      <Notification message={notification} onClose={closeNotification} />
    </Page>
  );
}

export default ProfilePage;
