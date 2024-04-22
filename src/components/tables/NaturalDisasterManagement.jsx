import React, { memo, useEffect, Suspense, useState } from "react";
import { Table, Tag, Select, Typography, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllNaturalDisasterByPageAndLimit } from "../../features/NaturalDisaster/naturalDisastersSlice";
import "../../App.css";
const { Option } = Select;
const { Text } = Typography;

const NaturalDisasterManagement = () => {
  const dispatch = useDispatch();
  const naturalDisasters = useSelector((state) => state.naturalDisaster?.list);
  const totalPages = useSelector((state) => state.naturalDisaster?.totalPages);
  const currentPage = useSelector(
    (state) => state.naturalDisaster?.currentPage
  );

  const [pageSize, setPageSize] = useState(7);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: pageSize,
  });

  useEffect(() => {
    dispatch(getAllNaturalDisasterByPageAndLimit({ pagination }));
  }, [dispatch, pagination]);

  const columns = [
    {
      title: "STT",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Thiên tai",
      dataIndex: "name",
    },
    {
      title: "Loại thiên tai",
      dataIndex: "type",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      render: (text) => {
        if (text) {
          return new Date(text).toLocaleDateString();
        } else {
          return "Chưa cập nhật";
        }
      },
    },
    {
      title: "Vùng ảnh hưởng",
      dataIndex: "effected_area",
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      render: (_, { status }) => {
        let color =
          status === "kết thúc"
            ? "green"
            : status === "chưa kết thúc"
            ? "volcano"
            : "geekblue";

        let tagText =
          status === "kết thúc" || status === "chưa kết thúc"
            ? status.charAt(0).toUpperCase() + status.slice(1)
            : status;

        return (
          <Tag color={color} key={status}>
            {tagText}
          </Tag>
        );
      },
    },
  ];

  // const onChange = (pagination, filters, sorter, extra) => {
  //   console.log("params", pagination, filters, sorter, extra);
  // };

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;

    setPagination({
      page: current,
      limit: pageSize,
    });
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setPagination({
      ...pagination,
      limit: value,
    });
  };

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        {naturalDisasters && naturalDisasters.length ? (
          <>
            <Table
              columns={columns}
              dataSource={naturalDisasters}
              rowKey="id"
              pagination={{
                pageSize: pagination.limit,
                total: totalPages * pagination.limit,
                current: currentPage,
              }}
              onChange={handleTableChange}
            />

            <Row justify="end">
              <Col
                style={{
                  marginTop: "4px",
                  marginRight: "10px",
                }}
              >
                <Text>Tổng số dòng trên trang:</Text>
              </Col>
              <Col>
                <Select defaultValue={pageSize} onChange={handlePageSizeChange}>
                  <Option value={1}>1 / trang</Option>
                  <Option value={2}>2 / trang</Option>
                  <Option value={3}>3 / trang</Option>
                  <Option value={4}>4 / trang</Option>
                  <Option value={5}>5 / trang</Option>
                  <Option value={6}>6 / trang</Option>
                  <Option value={7}>7 / trang</Option>
                </Select>
              </Col>
            </Row>
          </>
        ) : (
          <div className="gray-table">
            <div className="loading-effect"></div>
          </div>
        )}
      </Suspense>
    </>
  );
};

export default memo(NaturalDisasterManagement);
