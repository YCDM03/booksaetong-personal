import { create } from 'zustand';
import { LoginUser } from '@/types/auth/auth.type';

export interface UserState {
  user: LoginUser | null;
  isLoggedIn: boolean;
  login: (user: LoginUser) => void;
  logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoggedIn: false,
  login: (user) => set({ user, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false })
}));

export default useUserStore;
