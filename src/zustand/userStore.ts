import { SocketAddress } from 'net';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  address: string;
  email: string;
  nickname: string;
  sub: string;
}

export interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoggedIn: false,
  login: (user) => set({ user, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false })
}));

export default useUserStore;
