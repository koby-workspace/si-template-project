import { useState } from "react";
import { Layout, Menu } from "antd";
import { DashboardOutlined, TeamOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

// 메뉴 항목 정의
const menuItems = [
  {
    key: "/",
    icon: <DashboardOutlined />,
    label: "대시보드",
  },
  {
    key: "/users",
    icon: <TeamOutlined />,
    label: "회원 관리",
  },
];

const Sidebar = () => {
  // collapsed: 사이드바가 접혀있는지 여부
  const [collapsed, setCollapsed] = useState(false);
  // useNavigate: 프로그래밍 방식으로 URL을 이동하는 함수
  const navigate = useNavigate();
  // useLocation: 현재 URL 정보를 가져오는 훅
  const location = useLocation();

  return (
    <Sider
      collapsible // 접기/펼치기 버튼 표시
      collapsed={collapsed} // 현재 접힘 상태
      onCollapse={setCollapsed} // 접기/펼치기 시 상태 업데이트
      width={220} // 펼쳐진 상태의 너비
      collapsedWidth={64} // 접힌 상태의 너비
      theme="dark" // 어두운 테마
    >
      {/* 로고 영역 */}
      <div className="flex items-center justify-center h-16 text-white font-bold text-lg border-b border-white/10">
        {collapsed ? "SI" : "SI Admin"}
      </div>

      {/* 메뉴 */}
      <Menu
        theme="dark"
        mode="inline" // 세로 방향 메뉴
        selectedKeys={[location.pathname]} // 현재 URL에 해당하는 메뉴 항목 강조
        items={menuItems}
        onClick={({ key }) => navigate(key)} // 메뉴 클릭 시 해당 URL로 이동
        className="mt-2"
      />
    </Sider>
  );
};

export default Sidebar;
