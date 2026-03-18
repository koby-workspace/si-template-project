import axios from "axios";
import { message } from "antd";
import useAuthStore from "../store/useAuthStore";

// axios 인스턴스 생성
// 기본 설정을 공유하는 전용 HTTP 클라이언트를 만든다
const apiClient = axios.create({
  baseURL: "/api",
  // 모든 요청의 URL 앞에 '/api'가 자동으로 붙는다
  // 예: apiClient.get('/users') → GET /api/users

  headers: {
    "Content-Type": "application/json",
    // 모든 요청에 기본적으로 JSON 형식임을 알리는 헤더를 추가
  },
});

// ===== Request 인터셉터 =====
// 모든 요청이 서버로 가기 전에 실행된다
apiClient.interceptors.request.use((config) => {
  // Zustand 스토어에서 토큰을 가져온다
  // useAuthStore.getState(): React 컴포넌트 바깥에서 스토어에 접근하는 방법
  const token = useAuthStore.getState().token;

  if (token) {
    // 토큰이 있으면 Authorization 헤더에 추가
    // 서버는 이 헤더를 보고 인증된 사용자인지 확인한다
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ===== Response 인터셉터 =====
// 서버에서 응답이 온 후 실행된다
apiClient.interceptors.response.use(
  // 성공 응답 처리 (2xx 상태 코드)
  (response) => response.data,
  // response.data만 반환하여 사용 편의성을 높인다
  // 없으면: const res = await apiClient.get('/users'); res.data.xxx
  // 있으면: const data = await apiClient.get('/users'); data.xxx

  // 에러 응답 처리 (4xx, 5xx 상태 코드)
  (error) => {
    const status = error.response?.status;

    if (status === 401 && !error.config?.url?.includes("/login")) {
      // 401(인증 만료)이고, 로그인 요청이 아닌 경우:
      // → 세션이 만료된 것으로 간주하여 강제 로그아웃
      useAuthStore.getState().logout();
      window.location.replace("/login");
    } else if (status !== 401) {
      // 401 외의 에러: 서버 에러 메시지를 토스트로 표시
      message.error(
        error.response?.data?.message ?? "서버 오류가 발생했습니다.",
      );
    }

    // 에러를 다시 throw하여 호출 측에서도 catch할 수 있게 한다
    return Promise.reject(error);
  },
);

export default apiClient;
