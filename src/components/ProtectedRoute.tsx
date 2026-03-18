import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode; // 감싸는 자식 컴포넌트
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // 스토어에서 로그인 여부만 가져온다
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // 로그인하지 않았으면 /login으로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 로그인했으면 자식 컴포넌트를 그대로 렌더링
  return <>{children}</>;
};

export default ProtectedRoute;
