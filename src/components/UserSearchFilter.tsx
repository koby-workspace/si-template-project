import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from "antd";
import type { Dayjs } from "dayjs";

// 부모 컴포넌트로 전달될 검색 조건 타입
export interface SearchParams {
  keyword?: string;
  role?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

interface UserSearchFilterProps {
  onSearch: (params: SearchParams) => void;
}

const UserSearchFilter = ({ onSearch }: UserSearchFilterProps) => {
  const [form] = Form.useForm();

  const handleSearch = () => {
    const values = form.getFieldsValue() as {
      keyword?: string;
      role?: string;
      status?: string;
      dateRange?: [Dayjs, Dayjs] | null;
    };

    // DatePicker의 Dayjs 객체를 YYYY-MM-DD 문자열로 변환
    const params: SearchParams = {
      keyword: values.keyword || undefined,
      role: values.role || undefined,
      status: values.status || undefined,
      startDate: values.dateRange?.[0]?.format("YYYY-MM-DD"),
      endDate: values.dateRange?.[1]?.format("YYYY-MM-DD"),
    };

    onSearch(params);
  };

  const handleReset = () => {
    form.resetFields();
    onSearch({});
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <Form form={form} layout="vertical">
        <Row gutter={16} align="bottom">
          {/* 검색어 */}
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="검색어" name="keyword" className="mb-0">
              <Input placeholder="이름 또는 이메일 입력" allowClear />
            </Form.Item>
          </Col>

          {/* 역할 */}
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="역할" name="role" className="mb-0">
              <Select placeholder="전체" allowClear>
                <Select.Option value="admin">관리자</Select.Option>
                <Select.Option value="manager">매니저</Select.Option>
                <Select.Option value="user">일반 회원</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {/* 상태 */}
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="상태" name="status" className="mb-0">
              <Select placeholder="전체" allowClear>
                <Select.Option value="active">활성</Select.Option>
                <Select.Option value="inactive">비활성</Select.Option>
                <Select.Option value="banned">정지</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {/* 가입일 */}
          <Col xs={24} sm={24} md={6}>
            <Form.Item label="가입일" name="dateRange" className="mb-0">
              <DatePicker.RangePicker className="w-full" />
            </Form.Item>
          </Col>

          {/* 버튼 영역 */}
          <Col xs={24} md={{ span: 6, offset: 18 }} className="flex justify-end">
            <Form.Item className="mb-0">
              <Space>
                <Button
                  size="middle"
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                >
                  초기화
                </Button>
                <Button
                  type="primary"
                  size="middle"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                >
                  조회
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default UserSearchFilter;
