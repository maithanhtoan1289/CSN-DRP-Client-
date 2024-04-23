import React, { useState } from "react";
import {
    Layout,
    Menu,
    Typography,
    Avatar,
    Drawer,
    Button,
    Row,
    Col,
    Dropdown,
    Badge,
    Image,
    theme,
} from "antd";
import {
    MenuOutlined,
    CloseOutlined,
    BellOutlined,
    HomeOutlined,
    ThunderboltOutlined,
    ExclamationCircleOutlined,
    ProfileOutlined,
} from "@ant-design/icons";
import { Grid } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { logoutUser } from "../../features/Users/usersSlice";

const { useBreakpoint } = Grid;

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

function getItem(label, key, icon, path) {
    return {
        key,
        label,
        path,
    };
}

const items = [
    getItem("Đăng nhập", "/login", "/login"),
    getItem("Đăng ký", "/register", "/register"),
    getItem("Trang chủ", "/", "/"),
    getItem("Tin tức", "/news", "/news"),
    getItem("Vấn đề", "/problem", "/problem"),
    getItem("Sự cố", "/incident", "/incident"),
];

const HeaderComponent = ({ children }) => {
    const dispatch = useDispatch();
    const screens = useBreakpoint();
    const location = useLocation();
    const navigate = useNavigate();

    const isExtraSmall = screens.xs; // Màn hình rất nhỏ (dưới 576px)
    // const isSmall = screens.sm; // Màn hình nhỏ (từ 576px đến 768px)
    // const isMedium = screens.md; // Màn hình trung bình (từ 768px đến 992px)
    // const isLarge = screens.lg; // Màn hình lớn (từ 992px đến 1200px)
    // const isExtraLarge = screens.xl; // Màn hình rất lớn (từ 1200px trở lên)

    const userInfo = useSelector((state) => state?.user?.userInfo);

    const [visible, setVisible] = useState(false);

    const {
        token: { borderRadiusLG },
    } = theme.useToken();

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const handleNavigateRescueHistory = () => {
        navigate("/rescue-history");
    };

    const handleLogout = () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");

        dispatch(logoutUser());

        navigate("/login");
    };

    const bellMenu = (
        <Menu>
            <Menu.Item key="1">Thông báo 1</Menu.Item>
            <Menu.Item key="2">Thông báo 2</Menu.Item>
            <Menu.Item key="3">Thông báo 3</Menu.Item>
        </Menu>
    );

    const userMenu = (
        <Menu>
            {userInfo?.role === "ROLE_RESCUER" && (
                <Menu.Item key="1" onClick={handleNavigateRescueHistory}>
                    Lịch sử cứu hộ
                </Menu.Item>
            )}
            <Menu.Item key="2">
                <Link to="/infomation-user">Hồ sơ cá nhân</Link>
            </Menu.Item>
            <Menu.Item key="3">
                <Link to="/history-incedent">Lịch sử hoạt động</Link>
            </Menu.Item>
            <Menu.Item key="4" onClick={handleLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout
            style={{
                backgroundColor: borderRadiusLG,
            }}
        >
            <Header
                style={{
                    position: "fixed",
                    zIndex: 1,
                    width: "100%",
                    padding: "0 20px",
                    background: "#ffa447",
                }}
            >
                <Row>
                    {isExtraSmall && (
                        <Col
                            span={24}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Image width={30} src="/logo.png" preview={false} />

                            <div>
                                <Button
                                    style={{
                                        padding: 0,
                                    }}
                                    type="text"
                                    onClick={showDrawer}
                                >
                                    <MenuOutlined
                                        style={{
                                            fontSize: "24px",
                                            color: "#fff",
                                        }}
                                    />
                                </Button>
                                <Drawer
                                    title={
                                        <span style={{ color: "white" }}>
                                            CSN & DRP
                                        </span>
                                    }
                                    placement="right"
                                    closable={false}
                                    onClose={onClose}
                                    visible={visible}
                                    width="100%"
                                    style={{ backgroundColor: "#001529" }}
                                >
                                    {userInfo && (
                                        <div
                                            style={{
                                                marginTop: "20px",
                                                textAlign: "center",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                }}
                                            >
                                                <Avatar src="https://avatar.iran.liara.run/public/29" />
                                                <Badge dot>
                                                    <BellOutlined
                                                        style={{
                                                            fontSize: "20px",
                                                            color: "#fff",
                                                        }}
                                                    />
                                                </Badge>
                                            </div>

                                            <Title
                                                level={5}
                                                style={{
                                                    color: "#fff",
                                                    marginBottom: "10px",
                                                }}
                                            >
                                                Xin chào, {userInfo?.name}
                                            </Title>
                                        </div>
                                    )}

                                    <Menu
                                        theme="light"
                                        selectedKeys={[location.pathname]}
                                        mode="inline"
                                    >
                                        {items.map((item) => (
                                            <Menu.Item key={item.key}>
                                                <Link to={item.path}>
                                                    {item.label}
                                                </Link>
                                            </Menu.Item>
                                        ))}
                                    </Menu>

                                    {/* <Link to="/user/login">Đăng nhập</Link>
                  <Link to="/user/register">Đăng ký</Link>
                  <Link to="/">Trang chủ</Link> */}

                                    <Button
                                        onClick={onClose}
                                        type="text"
                                        style={{
                                            position: "absolute",
                                            top: "10px",
                                            right: "0px",
                                        }}
                                    >
                                        <CloseOutlined
                                            style={{
                                                fontSize: "24px",
                                                color: "#fff",
                                            }}
                                        />
                                    </Button>
                                </Drawer>
                            </div>
                        </Col>
                    )}
                    {!isExtraSmall && (
                        <>
                            <Col
                                span={6}
                                flex="auto"
                                style={{
                                    display: "flex",
                                    justifyContent: "start",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    width={30}
                                    src="/logo.png"
                                    preview={false}
                                />
                                <Typography.Title
                                    level={1}
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        color: "white",
                                        marginLeft: "10px",
                                        marginBottom: 0,
                                    }}
                                >
                                    CSN & DRP
                                </Typography.Title>
                            </Col>
                            <Col
                                span={12}
                                flex="auto"
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "20px",
                                }}
                            >
                                <Link to="/">
                                    <HomeOutlined
                                        style={{
                                            fontSize: "20px",
                                            color: "white",
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: "white",
                                            marginLeft: "4px",
                                        }}
                                    >
                                        Trang chủ
                                    </Text>
                                </Link>

                                <Link to="/news">
                                    <ProfileOutlined
                                        style={{
                                            fontSize: "20px",
                                            color: "white",
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: "white",
                                            marginLeft: "4px",
                                        }}
                                    >
                                        Tin tức
                                    </Text>
                                </Link>

                                <Link to="/problem">
                                    <ThunderboltOutlined
                                        style={{
                                            fontSize: "20px",
                                            color: "white",
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: "white",
                                            marginLeft: "4px",
                                        }}
                                    >
                                        Vấn đề
                                    </Text>
                                </Link>
                                <Link to="/incident">
                                    <ExclamationCircleOutlined
                                        style={{
                                            fontSize: "20px",
                                            color: "white",
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: "white",
                                            marginLeft: "4px",
                                        }}
                                    >
                                        Sự cố
                                    </Text>
                                </Link>
                            </Col>
                            <Col
                                span={6}
                                flex="auto"
                                style={{
                                    display: "flex",
                                    justifyContent: "end",
                                    alignItems: "center",
                                }}
                            >
                                {userInfo ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: "20px",
                                        }}
                                    >
                                        <Dropdown
                                            overlay={bellMenu}
                                            placement="bottomLeft"
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <Badge dot>
                                                    <BellOutlined
                                                        style={{
                                                            fontSize: "20px",
                                                            color: "#fff",
                                                        }}
                                                    />
                                                </Badge>
                                            </div>
                                        </Dropdown>
                                        <Dropdown
                                            overlay={userMenu}
                                            placement="bottomRight"
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <Avatar
                                                    src={userInfo?.avatar}
                                                />
                                                <div
                                                    style={{
                                                        marginLeft: "8px",
                                                    }}
                                                >
                                                    <Text
                                                        strong
                                                        style={{
                                                            color: "white",
                                                        }}
                                                    >
                                                        Xin chào,{" "}
                                                        {userInfo?.name}
                                                    </Text>
                                                </div>
                                            </div>
                                        </Dropdown>
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: "20px",
                                        }}
                                    >
                                        <Button
                                            type="default"
                                            style={{
                                                color: "#ffa447",
                                                fontWeight: "bold",
                                                border: "none",
                                            }}
                                        >
                                            <Link to="/register">Đăng ký</Link>
                                        </Button>
                                        <Button
                                            type="default"
                                            style={{
                                                color: "#ffa447",
                                                fontWeight: "bold",
                                                border: "none",
                                            }}
                                        >
                                            <Link to="/login">Đăng nhập</Link>
                                        </Button>
                                    </div>
                                )}
                            </Col>
                        </>
                    )}
                </Row>
            </Header>

            <Content
                style={{
                    backgroundColor: borderRadiusLG,
                    margin: "64px 20px",
                }}
            >
                {children}
            </Content>

            <Footer
                style={{
                    background: "rgba(19, 19, 19, 1)",
                    padding: "24px 20px",
                }}
            >
                <Row
                    justify="space-between"
                    align="start"
                    style={{ height: "100%" }}
                    gutter={[16, 16]}
                >
                    <Col>
                        <Row align="middle">
                            <Image width={30} src="/logo.png" preview={false} />
                            <Typography.Title
                                level={1}
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    color: "white",
                                    marginLeft: "10px",
                                    marginBottom: 0,
                                }}
                            >
                                CSN & DRP
                            </Typography.Title>
                        </Row>

                        <Typography.Title
                            level={1}
                            style={{
                                fontSize: "13px",
                                fontWeight: "400",
                                color: "white",
                                marginTop: "15px",
                            }}
                        >
                            Dịch vụ cứu hộ nhanh chóng và đáng tin cậy.
                        </Typography.Title>
                    </Col>

                    <Col>
                        <Row align="middle">
                            <Typography.Title
                                level={1}
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    color: "white",
                                }}
                            >
                                Tư cách thành viên
                            </Typography.Title>
                        </Row>

                        <Typography.Title
                            level={1}
                            style={{
                                fontSize: "13px",
                                fontWeight: "400",
                                color: "white",
                                marginTop: "15px",
                            }}
                        >
                            An toàn vị trí
                        </Typography.Title>

                        <Typography.Title
                            level={1}
                            style={{
                                fontSize: "13px",
                                fontWeight: "400",
                                color: "white",
                                marginTop: "15px",
                            }}
                        >
                            Láy xe an toàn
                        </Typography.Title>

                        <Typography.Title
                            level={1}
                            style={{
                                fontSize: "13px",
                                fontWeight: "400",
                                color: "white",
                                marginTop: "15px",
                            }}
                        >
                            An toàn kỹ thuật số
                        </Typography.Title>

                        <Typography.Title
                            level={1}
                            style={{
                                fontSize: "13px",
                                fontWeight: "400",
                                color: "white",
                                marginTop: "15px",
                            }}
                        >
                            Hỗ trợ khẩn cấp
                        </Typography.Title>
                    </Col>

                    <Col>
                        <Row align="middle">
                            <Typography.Title
                                level={1}
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    color: "white",
                                }}
                            >
                                Tài nguyên
                            </Typography.Title>
                        </Row>

                        <Typography.Title
                            level={1}
                            style={{
                                fontSize: "13px",
                                fontWeight: "400",
                                color: "white",
                                marginTop: "15px",
                            }}
                        >
                            Trung tâm trợ giúp
                        </Typography.Title>

                        <Typography.Title
                            level={1}
                            style={{
                                fontSize: "13px",
                                fontWeight: "400",
                                color: "white",
                                marginTop: "15px",
                            }}
                        >
                            Blog
                        </Typography.Title>

                        <Typography.Title
                            level={1}
                            style={{
                                fontSize: "13px",
                                fontWeight: "400",
                                color: "white",
                                marginTop: "15px",
                            }}
                        >
                            Bảo vệ thành viên
                        </Typography.Title>

                        <Typography.Title
                            level={1}
                            style={{
                                fontSize: "13px",
                                fontWeight: "400",
                                color: "white",
                                marginTop: "15px",
                            }}
                        >
                            Học hỏi
                        </Typography.Title>
                    </Col>
                </Row>
            </Footer>
        </Layout>
    );
};

export default HeaderComponent;
