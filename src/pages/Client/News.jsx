import React from "react";
import { Row, Col, theme, Breadcrumb } from "antd";

const News = () => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  return (
    <>
      <Breadcrumb
        style={{
          margin: "20px 0",
        }}
      >
        <Breadcrumb.Item>Tin tức</Breadcrumb.Item>
      </Breadcrumb>
      <Row gutter={[16, 16]}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={24}
          style={{
            height: "500px",
            background: borderRadiusLG,
          }}
        >
          <Row
            style={{
              height: "450px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Col
              span={24}
              style={{
                height: "450px",
                backgroundColor: "#B7E5B4",
                borderRadius: "10px",
              }}
            ></Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default News;
