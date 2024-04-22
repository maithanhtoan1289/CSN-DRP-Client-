import React from "react";
import { Avatar, Typography } from "antd";
const { Text } = Typography;

export default function Header({ colorBgContainer }) {
  return (
    <>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingRight: "24px",
        }}
      >
        <Avatar size="lagre" src="/admin-logo.png" />
        <Text style={{ marginLeft: "8px" }}>ADMIN</Text>
      </Header>
    </>
  );
}
