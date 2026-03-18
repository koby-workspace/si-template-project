import { useEffect, useState } from "react";
import { Button, Input, Space, Table, Tag, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { User } from "../mocks/handlers";
import { useUserStore } from "../store/useUserStore";
import UserDetailModal from "../components/UserDetailModal";
import apiClient from "../utils/apiClient";

const { Title } = Typography;

// 역할/상태의 영문 코드를 한글로 변환하는 맵핑
const roleLabel: Record<User["role"], string> = {
  admin: "관리자",
  manager: "매니저",
  user: "일반 회원",
};

const statusColor: Record<User["status"], string> = {
  active: "green",
  inactive: "default",
  banned: "red",
};

const statusLabel: Record<User["status"], string> = {
  active: "활성",
  inactive: "비활성",
  banned: "정지",
};

const UserListPage = () => {
  const [users, setUsers] = useState<User[]>([]); // 회원 목록 데이터
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [searchName, setSearchName] = useState(""); // 실제 검색어 (API 호출에 사용)
  const [inputValue, setInputValue] = useState(""); // 입력 중인 값 (화면에 표시)
  const { openModal, refreshTrigger } = useUserStore();

  // 회원 목록을 API에서 가져오는 함수
  const fetchUsers = async (name: string) => {
    setLoading(true);
    try {
      const data = await apiClient.get<never, { data: User[]; total: number }>(
        "/users",
        {
          params: name ? { name } : undefined,
          // params: 쿼리 파라미터. { name: '김' } → /api/users?name=김
        },
      );
      setUsers(data.data);
    } finally {
      // finally: 성공이든 실패든 항상 실행
      setLoading(false);
    }
  };

  // searchName 또는 refreshTrigger가 변경될 때마다 데이터를 다시 불러온다
  useEffect(() => {
    fetchUsers(searchName);
  }, [searchName, refreshTrigger]);

  // 검색 버튼 클릭 또는 Enter
  const handleSearch = () => {
    setSearchName(inputValue);
    // inputValue를 searchName에 설정 → useEffect가 감지하여 fetchUsers 실행
  };

  // Ant Design Table의 컬럼(열) 정의
  const columns: ColumnsType<User> = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "이름", dataIndex: "name", key: "name", width: 120 },
    { title: "이메일", dataIndex: "email", key: "email" },
    {
      title: "역할",
      dataIndex: "role",
      key: "role",
      width: 110,
      // render: 셀의 내용을 커스텀하는 함수
      // role 값('admin')을 한글 라벨('관리자')로 변환하여 표시
      render: (role: User["role"]) => roleLabel[role],
    },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      width: 90,
      // Tag: 색상이 있는 라벨 컴포넌트
      render: (status: User["status"]) => (
        <Tag color={statusColor[status]}>{statusLabel[status]}</Tag>
      ),
    },
    { title: "가입일", dataIndex: "createdAt", key: "createdAt", width: 120 },
    {
      title: "관리",
      key: "action",
      width: 100,
      // render의 두 번째 인자 record: 해당 행의 전체 데이터
      render: (_, record) => (
        <Button size="small" onClick={() => openModal(record)}>
          상세/수정
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Title level={4} className="mb-4">
        회원 목록
      </Title>

      {/* 검색 영역 */}
      <Space className="mb-4">
        <Input
          placeholder="이름으로 검색"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 220 }}
          allowClear
          onClear={() => {
            setInputValue("");
            setSearchName("");
          }}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          조회
        </Button>
      </Space>

      {/* 회원 테이블 */}
      <Table<User>
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10, showTotal: (total) => `총 ${total}명` }}
        size="middle"
      />

      {/* 상세/수정 모달 */}
      <UserDetailModal />
    </div>
  );
};

export default UserListPage;
