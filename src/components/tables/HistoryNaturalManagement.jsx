import React, { useEffect, Suspense, useState } from "react";
import { Table, Select, Typography, Row, Col, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllHistoryNaturalDisasterByPageAndLimit } from "../../features/Histories/historyNaturalDisastersSlice";
import "../../App.css";
const { Option } = Select;
const { Text } = Typography;

const HistoryNaturalManagement = () => {
  const dispatch = useDispatch();
  const historyNaturals = useSelector((state) => state.historyNatural?.list);
  const totalPages = useSelector((state) => state.historyNatural?.totalPages);
  const currentPage = useSelector((state) => state.historyNatural?.currentPage);

  const [pageSize, setPageSize] = useState(7);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: pageSize,
  });

  useEffect(() => {
    dispatch(getAllHistoryNaturalDisasterByPageAndLimit({ pagination }));
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
      title: "Thương vong",
      dataIndex: "casualty_rate",
    },
    // {
    //   title: "Tình trạng",
    //   dataIndex: "address",
    //   render: (text) => {
    //     if (text === null || text === undefined || text.trim() === "") {
    //       return "Chưa cập nhật";
    //     }
    //     return text;
    //   },
    // },
    // {
    //   title: "Số điện thoại",
    //   dataIndex: "phone",
    //   render: (text) => {
    //     if (text === null || text === undefined || text.trim() === "") {
    //       return "Chưa cập nhật";
    //     }
    //     return text;
    //   },
    // },
    {
      title: "Tình trạng",
      dataIndex: "status",
      render: (_, { status }) => {
        let color =
          status === "hoàn thành"
            ? "green"
            : status === "chưa hoàn thành"
            ? "volcano"
            : "geekblue";

        let tagText =
          status === "hoàn thành" || status === "chưa hoàn thành"
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
        {historyNaturals && historyNaturals.length ? (
          <>
            <Table
              columns={columns}
              dataSource={historyNaturals}
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

export default HistoryNaturalManagement;
