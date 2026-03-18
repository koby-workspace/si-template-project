import { useEffect } from "react";
import { Form, Input, Modal, Select, message } from "antd";
import { useUserStore } from "../store/useUserStore";
import type { User, UserRole, UserStatus } from "../mocks/handlers";
import apiClient from "../utils/apiClient";

// Select 컴포넌트에 표시할 옵션들
const roleOptions: { label: string; value: UserRole }[] = [
  { label: "관리자", value: "admin" },
  { label: "매니저", value: "manager" },
  { label: "일반 회원", value: "user" },
];

const statusOptions: { label: string; value: UserStatus }[] = [
  { label: "활성", value: "active" },
  { label: "비활성", value: "inactive" },
  { label: "정지", value: "banned" },
];

const UserDetailModal = () => {
  const { selectedUser, isModalOpen, closeModal, triggerRefresh } =
    useUserStore();
  const [form] = Form.useForm<User>();
  const [messageApi, contextHolder] = message.useMessage();

  // 모달이 열릴 때 선택된 회원 정보를 폼에 채운다
  useEffect(() => {
    if (isModalOpen && selectedUser) {
      form.setFieldsValue(selectedUser);
      // setFieldsValue: 폼의 각 필드를 객체의 값으로 설정
      // { name: '김민준', email: 'minjun@...' } → name 입력에 '김민준', email 입력에 'minjun@...'
    }
  }, [isModalOpen, selectedUser, form]);

  // "저장" 버튼 클릭 시
  const handleOk = async () => {
    try {
      // 폼 유효성 검사 + 값 가져오기
      const values = await form.validateFields();
      // validateFields: 모든 규칙을 검사하고, 통과하면 값을 반환
      // 실패하면 에러를 throw하여 catch로 간다

      // 수정 API 호출
      await apiClient.put(`/users/${selectedUser!.id}`, values);
      // selectedUser!: TypeScript에게 "이 값은 null이 아니다"라고 단언
      // (모달이 열려있으면 selectedUser가 반드시 존재하므로 안전)

      messageApi.success("회원 정보가 저장되었습니다.");
      triggerRefresh(); // 목록 새로고침
      closeModal(); // 모달 닫기
    } catch {
      // 유효성 검사 실패 또는 API 에러
      // 폼 검사 실패는 Form이 자동으로 에러 메시지를 표시
      // HTTP 에러는 apiClient 인터셉터가 처리
    }
  };

  return (
    <>
      {/* contextHolder: message.useMessage()가 메시지를 표시할 위치 */}
      {contextHolder}

      <Modal
        title="회원 상세 / 수정"
        open={isModalOpen} // 모달 표시 여부
        onOk={handleOk} // "저장" 버튼 클릭 시
        onCancel={closeModal} // "취소" 버튼 또는 X 클릭 시
        okText="저장" // OK 버튼 텍스트 변경
        cancelText="취소" // Cancel 버튼 텍스트 변경
        destroyOnClose // 닫을 때 내부 DOM을 완전히 제거 (폼 초기화 보장)
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            label="이름"
            name="name"
            rules={[{ required: true, message: "이름을 입력하세요." }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="이메일"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "올바른 이메일을 입력하세요.",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="역할" name="role" rules={[{ required: true }]}>
            <Select options={roleOptions} />
          </Form.Item>

          <Form.Item label="상태" name="status" rules={[{ required: true }]}>
            <Select options={statusOptions} />
          </Form.Item>

          <Form.Item label="가입일" name="createdAt">
            <Input disabled />
            {/* disabled: 읽기 전용. 가입일은 수정할 수 없다 */}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserDetailModal;
