import { http, HttpResponse } from "msw";

// ===== 타입 정의 =====
// 다른 파일에서도 이 타입을 사용할 수 있도록 export
export type UserRole = "admin" | "manager" | "user";
export type UserStatus = "active" | "inactive" | "banned";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

// ===== 가짜 데이터 =====
const fakeUsers: User[] = [
  {
    id: 1,
    name: "김민준",
    email: "minjun.kim@example.com",
    role: "admin",
    status: "active",
    createdAt: "2026-03-01",
  },
  {
    id: 2,
    name: "이서연",
    email: "seoyeon.lee@example.com",
    role: "manager",
    status: "active",
    createdAt: "2026-03-03",
  },
  {
    id: 3,
    name: "박지호",
    email: "jiho.park@example.com",
    role: "user",
    status: "active",
    createdAt: "2026-03-05",
  },
  {
    id: 4,
    name: "최수아",
    email: "sua.choi@example.com",
    role: "user",
    status: "inactive",
    createdAt: "2026-03-07",
  },
  {
    id: 5,
    name: "정우진",
    email: "woojin.jung@example.com",
    role: "user",
    status: "active",
    createdAt: "2026-03-09",
  },
  {
    id: 6,
    name: "강하은",
    email: "haeun.kang@example.com",
    role: "manager",
    status: "active",
    createdAt: "2026-03-11",
  },
  {
    id: 7,
    name: "조현우",
    email: "hyunwoo.jo@example.com",
    role: "user",
    status: "banned",
    createdAt: "2026-03-13",
  },
  {
    id: 8,
    name: "윤지민",
    email: "jimin.yoon@example.com",
    role: "user",
    status: "active",
    createdAt: "2026-03-15",
  },
  {
    id: 9,
    name: "임채원",
    email: "chaewon.lim@example.com",
    role: "user",
    status: "active",
    createdAt: "2026-03-17",
  },
  {
    id: 10,
    name: "한소희",
    email: "sohee.han@example.com",
    role: "manager",
    status: "inactive",
    createdAt: "2026-03-19",
  },
];

// ===== API 핸들러 =====
export const handlers = [
  // --- 로그인 ---
  http.post("/api/login", async ({ request }) => {
    const body = (await request.json()) as { id: string; password: string };

    if (body.id === "admin" && body.password === "1234") {
      return HttpResponse.json(
        {
          token: "fake-jwt-token-abc123",
          user: {
            id: "admin",
            name: "관리자",
            email: "admin@example.com",
            role: "admin",
          },
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      { message: "아이디 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 },
    );
  }),

  // --- 회원 목록 조회 ---
  http.get("/api/users", ({ request }) => {
    const url = new URL(request.url);

    // 검색 파라미터 추출
    const keyword = url.searchParams.get("keyword") ?? "";
    const role = url.searchParams.get("role") ?? "";
    const status = url.searchParams.get("status") ?? "";
    const startDate = url.searchParams.get("startDate") ?? "";
    const endDate = url.searchParams.get("endDate") ?? "";

    let filtered = [...fakeUsers];

    // 검색어 필터: 이름 또는 이메일에 포함되는 경우
    if (keyword) {
      filtered = filtered.filter(
        (u) => u.name.includes(keyword) || u.email.includes(keyword),
      );
    }

    // 권한 필터
    if (role) {
      filtered = filtered.filter((u) => u.role === role);
    }

    // 상태 필터
    if (status) {
      filtered = filtered.filter((u) => u.status === status);
    }

    // 가입일자 범위 필터
    if (startDate) {
      filtered = filtered.filter((u) => u.createdAt >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((u) => u.createdAt <= endDate);
    }

    return HttpResponse.json({ data: filtered, total: filtered.length });
  }),

  // --- 회원 정보 수정 ---
  http.put("/api/users/:id", async ({ params, request }) => {
    // :id → params.id 로 접근 (URL 경로 매개변수)
    const id = Number(params.id);
    const body = (await request.json()) as Partial<User>;
    // Partial<User>: User의 모든 속성이 선택적(optional)인 타입
    // → 일부 필드만 보내서 수정할 수 있다

    const index = fakeUsers.findIndex((u) => u.id === id);
    if (index === -1) {
      return HttpResponse.json(
        { message: "회원을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 기존 데이터에 새 데이터를 병합 (스프레드 연산자)
    fakeUsers[index] = { ...fakeUsers[index], ...body, id };
    // { ...fakeUsers[index] }: 기존 데이터 복사
    // ...body: 새 데이터로 덮어쓰기
    // id: id는 변경되지 않도록 다시 설정

    return HttpResponse.json({ data: fakeUsers[index] }, { status: 200 });
  }),
];
