import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/Users/usersSlice";
import {
    UserOutlined,
    ThunderboltOutlined,
    HeatMapOutlined,
    UserSwitchOutlined,
    HistoryOutlined,
    LogoutOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
    Breadcrumb,
    Layout,
    Menu,
    theme,
    Image,
    Typography,
    Avatar,
    Dropdown,
} from "antd";
import "../../App.css";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import AdminProblemIncident from "../tables/AdminProblemIncident";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

function getItem(label, key, icon, path) {
    return {
        key,
        icon,
        label,
        path,
    };
}

const items = [
    getItem(
        "Quản lý thiên tai",
        "/admin/natural-disaster",
        <ThunderboltOutlined />,
        "/admin/natural-disaster"
    ),
    getItem(
        "Quản lý sự cố",
        "/admin/problem",
        <HeatMapOutlined />,
        "/admin/problem"
    ),
    getItem(
        "Quản lý người dùng",
        "/admin/user",
        <UserOutlined />,
        "/admin/user"
    ),
    getItem(
        "Quản lý nhân sự",
        "/admin/employee",
        <UserSwitchOutlined />,
        "/admin/employee"
    ),
    getItem(
        "Lịch sử thiên tai",
        "/admin/history-natural-disaster",
        <HistoryOutlined />,
        "/admin/history-natural-disaster"
    ),
    getItem(
        "Lịch sử sự cố",
        "/admin/history-problem",
        <HistoryOutlined />,
        "/admin/history-problem"
    ),
    getItem(
        "Sự cố tuyến đường",
        "/admin/problem-incident",
        <ExclamationCircleOutlined />,
        "/admin/problem-incident"
    ),
];

const LayoutAdmin = ({ children }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const getBreadcrumbName = (pathname) => {
        const selectedItem = items.find((item) => item.path === pathname);
        return selectedItem ? selectedItem.label : "Unknown";
    };

    const handleLogout = () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");

        dispatch(logoutUser());
    };

    const menu = (
        <Menu>
            <Menu.Item key="1" icon={<LogoutOutlined />} onClick={handleLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Layout
                style={{
                    minHeight: "100vh",
                }}
            >
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    style={{
                        backgroundColor: colorBgContainer,
                    }}
                >
                    <div
                        className="demo-logo-vertical"
                        style={{
                            height: "32px",
                            margin: "16px",
                            background: "rgba(255, 255, 255, .2)",
                            borderRadius: "6px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <Image width={30} src="/logo.png" preview={false} />

                        {!collapsed && (
                            <>
                                <Typography.Title
                                    level={1}
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        color: "#FFA447",
                                        textAlign: "center",
                                        marginTop: "10px",
                                    }}
                                >
                                    CSN & DRP
                                </Typography.Title>
                            </>
                        )}
                    </div>
                    <Menu
                        theme="light"
                        selectedKeys={[location.pathname]}
                        mode="inline"
                    >
                        {items.map((item) => (
                            <Menu.Item key={item.key} icon={item.icon}>
                                <Link to={item.path}>{item.label}</Link>
                            </Menu.Item>
                        ))}
                    </Menu>
                </Sider>
                <Layout>
                    <Header
                        style={{
                            padding: 0,
                            background: colorBgContainer,
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            paddingRight: "37px",
                        }}
                    >
                        <Dropdown overlay={menu} trigger={["hover"]}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <Avatar size="large" src="/admin-logo.png" />
                                <Text style={{ marginLeft: "8px" }}>ADMIN</Text>
                            </div>
                        </Dropdown>
                    </Header>

                    <Content
                        style={{
                            margin: "0 16px",
                        }}
                    >
                        <Breadcrumb
                            style={{
                                margin: "16px 0",
                            }}
                        >
                            <Breadcrumb.Item>
                                {getBreadcrumbName(location.pathname)}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                padding: 24,
                                minHeight: 360,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            {children}
                        </motion.div>
                    </Content>
                </Layout>
            </Layout>
        </motion.div>
    );
};
export default LayoutAdmin;
