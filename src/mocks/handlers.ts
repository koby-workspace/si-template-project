import { http, HttpResponse } from "msw";

// 핸들러 = "이 URL로 이런 요청이 오면, 이렇게 응답해라"는 규칙
export const handlers = [
  // POST /api/login 요청을 처리
  http.post("/api/login", async ({ request }) => {
    // 요청 본문(body)을 JSON으로 파싱
    const body = (await request.json()) as { id: string; password: string };

    // 아이디가 'admin'이고 비밀번호가 '1234'이면 성공
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

    // 그 외에는 401 에러
    return HttpResponse.json(
      { message: "아이디 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 },
    );
  }),
];
