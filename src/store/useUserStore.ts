import { create } from "zustand";
import type { User } from "../mocks/handlers";

interface UserStore {
  selectedUser: User | null; // 현재 선택된(모달에서 보고 있는) 회원
  isModalOpen: boolean; // 상세/수정 모달 열림 여부
  refreshTrigger: number; // 목록 새로고침 트리거
  setSelectedUser: (user: User | null) => void;
  openModal: (user: User) => void;
  closeModal: () => void;
  triggerRefresh: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  selectedUser: null,
  isModalOpen: false,
  refreshTrigger: 0,

  setSelectedUser: (user) => set({ selectedUser: user }),

  // 모달 열기: 선택된 회원 설정 + 모달 열기를 동시에
  openModal: (user) => set({ selectedUser: user, isModalOpen: true }),

  // 모달 닫기: 모달 닫기 + 선택 해제를 동시에
  closeModal: () => set({ isModalOpen: false, selectedUser: null }),

  // 목록 새로고침: 숫자를 1 증가시켜 useEffect를 재실행시킨다
  triggerRefresh: () =>
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));
