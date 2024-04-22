import React, { useEffect } from "react";
import { Row, Col, Breadcrumb, Table, Tag, Spin, Empty } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllRescueHistory } from "../../features/Users/usersSlice";

const RescueHistory = () => {
  const dispatch = useDispatch();
  const rescueHistoryList = useSelector((state) => state?.user?.list);
  const isLoading = useSelector((state) => state?.user?.isLoading);

  useEffect(() => {
    dispatch(getAllRescueHistory());
  }, [dispatch]);

  // Sắp xếp danh sách theo ngày kết thúc từ gần nhất đến xa nhất
  const sortedRescueHistoryList = [...rescueHistoryList].sort((a, b) => {
    return new Date(b.end_date) - new Date(a.end_date);
  });

  const renderStatusTag = (status) => {
    const statusMap = {
      "kết thúc": { color: "green", text: "Kết thúc" },
      "chưa kết thúc": { color: "volcano", text: "Chưa kết thúc" },
    };
    const { color, text } = statusMap[status] || {
      color: "geekblue",
      text: status,
    };
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    { title: "STT", render: (_, __, index) => index + 1 },
    { title: "Tên người gặp nạn", dataIndex: "name" },
    { title: "Số điện thoại", dataIndex: "phone" },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      render: (text) => text || "Chưa cập nhật",
    },
    {
      title: "Kiểu gặp nạn",
      dataIndex: "type",
      render: (text) => text || "Chưa cập nhật",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      render: (text) =>
        text ? new Date(text).toLocaleDateString() : "Chưa cập nhật",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      render: (text) =>
        text ? new Date(text).toLocaleDateString() : "Chưa cập nhật",
    },
    { title: "Trạng thái", dataIndex: "status", render: renderStatusTag },
  ];

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    <>
      <Breadcrumb style={{ margin: "20px 0" }}>
        <Breadcrumb.Item>Lịch sử cứu hộ</Breadcrumb.Item>
      </Breadcrumb>
      <Row
        gutter={[16, 16]}
        style={{
          minHeight: "400px",
        }}
      >
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          {sortedRescueHistoryList && sortedRescueHistoryList.length > 0 ? (
            <Table
              columns={columns}
              dataSource={sortedRescueHistoryList}
              rowKey="id"
              pagination={{ pageSize: 6 }}
            />
          ) : (
            <Empty description="Không có dữ liệu" />
          )}
        </Col>
      </Row>
    </>
  );
};

export default RescueHistory;
