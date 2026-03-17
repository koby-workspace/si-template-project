import { Layout, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Header: AntHeader } = Layout;

const Header = () => {
  return (
    <AntHeader className="flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm">
      <span className="text-gray-500 text-sm">관리자 시스템</span>

      <div className="flex items-center gap-2">
        <Avatar size={32} icon={<UserOutlined />} className="bg-blue-500" />
        <span className="text-sm font-medium text-gray-800">관리자</span>
      </div>
    </AntHeader>
  );
};

export default Header;
