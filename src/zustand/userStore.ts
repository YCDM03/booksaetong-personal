import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type UserState = {
  id: string | null;
  email: string | null;
  nickname: string | null;
  profile_url: string | null;
  address: string | null;
  setUser: (id: string, email: string, nickname: string, profile_url: string, address: string) => void;
};

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        id: null,
        email: null,
        nickname: null,
        profile_url: null,
        address: null,
        setUser: (id, email, nickname, profile_url, address) => set({ id, email, nickname, profile_url, address })
      }),
      {
        name: 'user-storage' // key 이름
      }
    )
  )
);
