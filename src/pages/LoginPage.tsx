import { Card, Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import type { AuthUser } from "../store/useAuthStore";
import apiClient from "../utils/apiClient";

// 폼의 입력값 타입 정의
interface LoginFormValues {
  id: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  // Form.useForm: Ant Design 폼의 인스턴스를 생성. 폼의 값을 프로그래밍으로 제어할 수 있다.
  const [form] = Form.useForm<LoginFormValues>();

  // 폼 제출 시 실행되는 함수
  const handleSubmit = async (values: LoginFormValues) => {
    try {
      // MSW가 가로채서 가짜 응답을 보내준다
      const data = await apiClient.post<
        never,
        { token: string; user: AuthUser }
      >("/login", values);

      // Zustand 스토어에 로그인 정보 저장
      login(data.user, data.token);

      // 대시보드로 이동 (replace: 뒤로가기로 로그인 페이지에 돌아오지 못하게)
      navigate("/", { replace: true });
    } catch {
      // 로그인 실패 시 에러 메시지 표시
      message.error("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm shadow-lg rounded-xl">
        {/* 제목 영역 */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-gray-800">관리자 로그인</h1>
          <p className="text-sm text-gray-400 mt-1">시스템에 로그인하세요</p>
        </div>

        {/* 로그인 폼 */}
        <Form
          form={form}
          layout="vertical" // 라벨이 입력 위에 위치
          onFinish={handleSubmit} // 유효성 검사 통과 후 실행
          requiredMark={false} // 필수 항목 * 표시 숨김
        >
          <Form.Item
            name="id"
            rules={[{ required: true, message: "아이디를 입력하세요." }]}
          >
            <Input
              prefix={<UserOutlined />} // 입력 앞에 아이콘 표시
              placeholder="아이디"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "비밀번호를 입력하세요." }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="비밀번호"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit" size="large" block>
              로그인
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
