import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type HeaderAlertStore = {
  message: string | null;
  forLogin: boolean;
  success: boolean;
  setSuccessAlert: (message: string, forLogin?: boolean, success?: boolean) => void;
  setErrorAlert: (message: string) => void;
  clearAlert: () => void;
};

export const useHeaderAlertStore = create<HeaderAlertStore>()(
  devtools(
    persist(
      (set) => ({
        message: '',
        forLogin: false,
        success: false,
        setSuccessAlert: (message, forLogin?, success?) => set({ message, forLogin, success }),
        setErrorAlert: (message) => set({ message, success: false }),
        clearAlert: () => set({ message: null, forLogin: false, success: false })
      }),
      {
        name: 'header-alert' // key 이름
      }
    )
  )
);
