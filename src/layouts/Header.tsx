import { Layout, Avatar, Dropdown } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();
  // 스토어에서 사용자 정보와 로그아웃 함수 가져오기
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // 드롭다운 메뉴 클릭 핸들러
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      logout(); // 스토어 상태 초기화
      navigate("/login", { replace: true }); // 로그인 페이지로 이동
    }
  };

  // 프로필 드롭다운 메뉴 항목
  const profileMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <SettingOutlined />,
      label: "프로필 설정",
    },
    {
      type: "divider", // 구분선
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "로그아웃",
      danger: true, // 빨간색으로 표시 (위험한 작업임을 표시)
    },
  ];

  return (
    <AntHeader className="flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm">
      <span className="text-gray-500 text-sm">관리자 시스템</span>

      {/* Dropdown: 클릭하면 메뉴가 펼쳐지는 컴포넌트 */}
      <Dropdown
        menu={{ items: profileMenuItems, onClick: handleMenuClick }}
        placement="bottomRight" // 메뉴가 아래-오른쪽에 표시
        trigger={["click"]} // 클릭 시 메뉴 열기 (기본은 hover)
      >
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors">
          <Avatar size={32} icon={<UserOutlined />} className="bg-blue-500" />
          <div className="flex flex-col leading-tight">
            {/* user?.name: user가 null이 아닐 때만 .name에 접근 (옵셔널 체이닝) */}
            {/* ?? '관리자': user?.name이 null/undefined이면 '관리자' 표시 (null 병합 연산자) */}
            <span className="text-sm font-medium text-gray-800">
              {user?.name ?? "관리자"}
            </span>
            <span className="text-xs text-gray-400">{user?.email ?? ""}</span>
          </div>
        </div>
      </Dropdown>
    </AntHeader>
  );
};

export default Header;
