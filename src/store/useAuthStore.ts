import { create } from "zustand";

// 로그인한 사용자 정보의 타입 정의
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
}

// 스토어의 전체 상태와 액션 타입 정의
interface AuthState {
  isAuthenticated: boolean; // 로그인 여부
  user: AuthUser | null; // 로그인한 사용자 정보 (비로그인 시 null)
  token: string | null; // API 인증 토큰
  login: (user: AuthUser, token: string) => void; // 로그인 액션
  logout: () => void; // 로그아웃 액션
}

const useAuthStore = create<AuthState>((set) => ({
  // --- 초기 상태 ---
  isAuthenticated: false,
  user: null,
  token: null,

  // --- 액션(상태를 변경하는 함수) ---
  // login: user와 token을 받아 로그인 상태로 변경
  login: (user, token) => set({ isAuthenticated: true, user, token }),

  // logout: 모든 인증 정보를 초기화
  logout: () => set({ isAuthenticated: false, user: null, token: null }),
}));

export default useAuthStore;
