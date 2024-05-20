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
  Modal,
  Form,
  Select,
  Input,
  notification,
  Upload,
  message,
  Radio,
} from "antd";
import {
  MenuOutlined,
  CloseOutlined,
  BellOutlined,
  HomeOutlined,
  ThunderboltOutlined,
  ProfileOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Grid } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import {
  getAllRescueNeeded,
  logoutUser,
} from "../../features/Users/usersSlice";

// New
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { geocoding, reverseGeocoding } from "../../features/Goong/goongSlice";
import {
  addNaturalDisasterVersion1,
  addNaturalDisasterVersion2,
  addNaturalDisasterVersion3,
} from "../../features/NaturalDisaster/naturalDisastersSlice";
import {
  addProblemVersion1,
  addProblemVersion2,
  addProblemVersion3,
} from "../../features/Problems/problemsSlice";
import axios from "axios";
import "../../index.css";

const { useBreakpoint } = Grid;

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

// New
// Define yup validate
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Vui lòng nhập họ và tên")
    .min(5, "Họ và tên phải có ít nhất 5 ký tự")
    .max(30, "Họ và tên chỉ được nhập tối đa 30 ký tự"),
  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .min(10, "Vui lòng nhập tối thiểu 10 số")
    .max(10, "Vui lòng nhập tối thiểu 10 số")
    .test("only-digits", "Số điện thoại không hợp lệ", (value) =>
      /^\d+$/.test(value)
    )
    .matches(/^(03|05|07|08|09)+([0-9]{8})$/, "Số điện thoại không hợp lệ"),
});

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
  getItem("Cứu hộ", "/rescue-seeker", "/rescue-seeker"),
  getItem("Sự cố", "/incident", "/incident"),
];

const HeaderComponent = ({ children }) => {
  const dispatch = useDispatch();
  const screens = useBreakpoint();
  const location = useLocation();
  const navigate = useNavigate();

  // Task 3
  const url = location.pathname;

  // New
  const coordinates = useSelector(
    (state) => state?.user?.userInfo?.coordinates
  );
  // Constants
  let validLat = 0;
  let validLng = 0;
  if (coordinates) {
    const coordinatesParse = JSON.parse(coordinates);
    validLat = parseFloat(coordinatesParse?.lat);
    validLng = parseFloat(coordinatesParse?.lng);
  }

  const isExtraSmall = screens.xs; // Màn hình rất nhỏ (dưới 576px)
  // const isSmall = screens.sm; // Màn hình nhỏ (từ 576px đến 768px)
  // const isMedium = screens.md; // Màn hình trung bình (từ 768px đến 992px)
  // const isLarge = screens.lg; // Màn hình lớn (từ 992px đến 1200px)
  // const isExtraLarge = screens.xl; // Màn hình rất lớn (từ 1200px trở lên)

  const userInfo = useSelector((state) => state?.user?.userInfo);

  const [visible, setVisible] = useState(false);

  // New
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emergencyType, setEmergencyType] = useState("");
  const [urlImage, setUrlImage] = useState("");
  const [valueAddress, setValueAddress] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markerPosition, setMarkerPosition] = useState([validLng, validLat]);
  const [hasCoordinates, setHasCoordinates] = useState(!!coordinates);
  const [isLogin] = useState(!!userInfo);
  const [showMap, setShowMap] = useState(hasCoordinates);
  const [showDanger, setShowDanger] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Task 4
  const [isModalOpenInfo, setIsModalOpenInfo] = useState(false);

    // Task bổ sung
    const [isActionRescue, setIsActionRescue] = useState(false);

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  // Hook form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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

  // New
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleChangeType = (value) => {
    setEmergencyType(value);
  };
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Chuyển địa chỉ sang URL
      const encodedAddress = encodeURIComponent(data.address || valueAddress);

      console.log("encodedAddress", encodedAddress);
      console.log("valueAddress", valueAddress);

      // Chuyển username sang kiểu viết liền không dấu
      const username = data.name
        .toLowerCase()
        .replace(/\s/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const currentDate = new Date().toLocaleString().replace(/[/:, ]/g, "");

      // Tạo email từ username
      const email = username + currentDate + "@gmail.com";

      // Tạo data user
      const newData = {
        ...data,
        type: emergencyType,
        username: username + currentDate,
        email: email,
        role: "ROLE_USER",
        password: "123456",
        effected_area: data.address || valueAddress,
      };

      // Delete unnecessary fields based on emergencyType
      if (newData.type === "Thiên tai") {
        delete newData.incidentName;
        delete newData.incidentType;
      } else if (newData.type === "Sự cố") {
        delete newData.naturalDisasterName;
        delete newData.naturalDisasterType;
      }

      // Get coordinates if not available
      let coordinates = markerPosition;

      // if (coordinates[0] === 0 && coordinates[1] === 0) {
      if (isLogin) {
        const response = await dispatch(geocoding(encodedAddress));
        console.log("response: " + response);
        coordinates = JSON.stringify(response.payload.geometry.location);

        const { lng, lat } = response.payload.geometry.location;
        setMarkerPosition([parseFloat(lng), parseFloat(lat)]);
        setHasCoordinates(true);
        setShowDanger(false);
        setShowMap(true);
      } else {
        const response = await dispatch(geocoding(encodedAddress));
        console.log("response: " + response);
        coordinates = JSON.stringify(response.payload.geometry.location);
      }

      // Add coordinates to newData
      const geometryNewData = {
        ...newData,
        coordinates: coordinates,
        urlImage: urlImage,
      };

      if (userInfo === null) {
        // Dispatch action based on emergencyType
        if (geometryNewData.type === "Thiên tai") {
          const response = await dispatch(
            addNaturalDisasterVersion1(geometryNewData)
          );
          console.log("Dispatching addNaturalDisaster v1", response);
        } else if (geometryNewData.type === "Sự cố") {
          const response = await dispatch(addProblemVersion1(geometryNewData));
          console.log("Dispatching addProblem v1", response);
        }

        setSuccessMessage(
          "Bạn đã gửi thông tin cứu hộ thành công.\nNhân viên cứu hộ sẽ đến trong giây lát, xin bạn hãy kiên nhẫn đợi...\nBên dưới là tài khoản và mật khẩu để bạn đăng nhập và theo dõi vị trí của mình."
        );
        setUsername(newData.username);
        setPassword(newData.password);
      } else {
        const userInfoData = {
          ...geometryNewData,
          id: userInfo.id,
        };

        delete userInfoData.username;
        delete userInfoData.password;
        delete userInfoData.role;

        // Dispatch action based on emergencyType
        if (geometryNewData.type === "Thiên tai") {
          await dispatch(addNaturalDisasterVersion2(userInfoData));
        } else if (geometryNewData.type === "Sự cố") {
          await dispatch(addProblemVersion2(userInfoData));
        }
      }

      setLoading(false);
      setIsModalOpen(false);

      // Task 4
      // dispatch(getAllRescueNeeded());
      setIsModalOpenInfo(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleUpload = async (options) => {
    const { onSuccess, onError, file } = options;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload/add-image",
        formData
      );
      onSuccess(response.data.url);
      setUrlImage(response.data.url);
      setImageUploaded(true);
      // message.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      onError(error);
    }
  };
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Only image files are allowed");
    }
    return isImage;
  };
  const getCurrentPosition = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const latlng = `${latitude},%20${longitude}`;

          console.log("latlng", latlng);

          try {
            const res = await dispatch(reverseGeocoding(latlng));
            console.log("res", res.payload.data.results[0].address);
            setValueAddress(res.payload.data.results[0].address);
            // notification.success({
            //   message: "Cập nhật vị trí thành công",
            //   description: "Vị trí của bạn được cập nhật thành công!",
            // });
          } catch (error) {
            console.error("Lỗi khi thực hiện reverse geocoding:", error);
          }
        },
        (error) => {
          console.error("Lỗi khi lấy vị trí hiện tại:", error);
        }
      );
    } else {
      console.error("Trình duyệt không hỗ trợ Geolocation");
    }
  };

  /* Task 6 */
  const handleCheckRole = () => {
    if (userInfo?.role === "ROLE_RESCUER") {
      navigate("/rescue-seeker");
    } else {
      alert("Bạn cần phải đăng nhập với tư cách là người cứu hộ");
    }
  };

  // Task 4
  const handleCancelInfo = () => {
    setIsModalOpenInfo(false);
  };

  // Task bổ sung
  const [isModalOpenWhenLoginUser, setIsModalOpenWhenLoginUser] =
    useState(false);
  const showModalWhenLoginUser = () => {
    setIsModalOpenWhenLoginUser(true);
  };
  const handleCancelWhenLoginUser = () => {
    setIsModalOpen(false);
  };
  const onSubmitWhenLoginUser = async (data) => {
    try {
      setLoading(true);

      // Chuyển địa chỉ sang URL
      const encodedAddress = encodeURIComponent(data.address || valueAddress);

      console.log("encodedAddress", encodedAddress);
      console.log("valueAddress", valueAddress);

      // Chuyển username sang kiểu viết liền không dấu
      const username = data.name
        .toLowerCase()
        .replace(/\s/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const currentDate = new Date().toLocaleString().replace(/[/:, ]/g, "");

      // Tạo email từ username
      const email = username + currentDate + "@gmail.com";

      // Tạo data user
      const newData = {
        ...data,
        type: emergencyType,
        username: username + currentDate,
        email: email,
        role: "ROLE_USER",
        password: "123456",
        effected_area: data.address || valueAddress,
      };

      // Delete unnecessary fields based on emergencyType
      if (newData.type === "Thiên tai") {
        delete newData.incidentName;
        delete newData.incidentType;
      } else if (newData.type === "Sự cố") {
        delete newData.naturalDisasterName;
        delete newData.naturalDisasterType;
      }

      // Get coordinates if not available
      let coordinates = markerPosition;

      // if (coordinates[0] === 0 && coordinates[1] === 0) {
      if (isLogin) {
        const response = await dispatch(geocoding(encodedAddress));
        console.log("response: " + response);
        coordinates = JSON.stringify(response.payload.geometry.location);

        const { lng, lat } = response.payload.geometry.location;
        setMarkerPosition([parseFloat(lng), parseFloat(lat)]);
        setHasCoordinates(true);
        setShowDanger(false);
        setShowMap(true);
      } else {
        const response = await dispatch(geocoding(encodedAddress));
        console.log("response: " + response);
        coordinates = JSON.stringify(response.payload.geometry.location);
      }

      // Add coordinates to newData
      const geometryNewData = {
        ...newData,
        coordinates: coordinates,
        urlImage: urlImage,
      };

      const userInfoData = {
        ...geometryNewData,
        id: userInfo.id,
        priority: data.priority,
      };

      delete userInfoData.username;
      delete userInfoData.password;
      delete userInfoData.role;

      // Dispatch action based on emergencyType
      if (geometryNewData.type === "Thiên tai") {
        await dispatch(addNaturalDisasterVersion2(userInfoData));
      } else if (geometryNewData.type === "Sự cố") {
        await dispatch(addProblemVersion2(userInfoData));
      }

      setLoading(false);
      setIsModalOpen(false);
      setIsActionRescue(true);
      window.location.reload();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Task 5
  const [isModalOpenWhenLoginRescuer, setIsModalOpenWhenLoginRescuer] =
    useState(false);
  const showModalWhenLoginRescuer = () => {
    setIsModalOpenWhenLoginRescuer(true);
  };
  const handleCancelWhenLoginRescuer = () => {
    setIsModalOpenWhenLoginRescuer(false);
  };
  const onSubmitWhenLoginRescuer = async (data) => {
    try {
      setLoading(true);

      // Chuyển địa chỉ sang URL
      const encodedAddress = encodeURIComponent(data.address || valueAddress);

      console.log("encodedAddress", encodedAddress);
      console.log("valueAddress", valueAddress);

      // Chuyển username sang kiểu viết liền không dấu
      const username = data.name
        .toLowerCase()
        .replace(/\s/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const currentDate = new Date().toLocaleString().replace(/[/:, ]/g, "");

      // Tạo email từ username
      const email = username + currentDate + "@gmail.com";

      // Tạo data user
      const newData = {
        ...data,
        type: emergencyType,
        username: username + currentDate,
        email: email,
        role: "ROLE_USER",
        password: "123456",
        effected_area: data.address || valueAddress,
      };

      // Delete unnecessary fields based on emergencyType
      if (newData.type === "Thiên tai") {
        delete newData.incidentName;
        delete newData.incidentType;
      } else if (newData.type === "Sự cố") {
        delete newData.naturalDisasterName;
        delete newData.naturalDisasterType;
      }

      // Get coordinates if not available
      let coordinates = markerPosition;

      // if (coordinates[0] === 0 && coordinates[1] === 0) {
      if (isLogin) {
        const response = await dispatch(geocoding(encodedAddress));
        console.log("response: " + response);
        coordinates = JSON.stringify(response.payload.geometry.location);

        const { lng, lat } = response.payload.geometry.location;
        setMarkerPosition([parseFloat(lng), parseFloat(lat)]);
        setHasCoordinates(true);
        setShowDanger(false);
        setShowMap(true);
      } else {
        const response = await dispatch(geocoding(encodedAddress));
        console.log("response: " + response);
        coordinates = JSON.stringify(response.payload.geometry.location);
      }

      // Add coordinates to newData
      const geometryNewData = {
        ...newData,
        coordinates: coordinates,
        urlImage: urlImage,
      };

      const userInfoData = {
        ...geometryNewData,
        userId: userInfo.id,
        priority: data.priority,
        roleName: "ROLE_USER",
      };

      console.log("userInfoData", userInfoData);

      delete userInfoData.username;
      delete userInfoData.password;

      // Dispatch action based on emergencyType
      if (geometryNewData.type === "Thiên tai") {
        await dispatch(addNaturalDisasterVersion3(userInfoData));
      } else if (geometryNewData.type === "Sự cố") {
        await dispatch(addProblemVersion3(userInfoData));
      }

      setLoading(false);
      setIsModalOpenWhenLoginRescuer(false);
      setIsActionRescue(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

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
                  <MenuOutlined style={{ fontSize: "24px", color: "#fff" }} />
                </Button>
                <Drawer
                  title={<span style={{ color: "white" }}>CSN & DRP</span>}
                  placement="right"
                  closable={false}
                  onClose={onClose}
                  visible={visible}
                  width="100%"
                  style={{ backgroundColor: "#001529" }}
                >
                  {userInfo && (
                    <div style={{ marginTop: "20px", textAlign: "center" }}>
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
                        style={{ color: "#fff", marginBottom: "10px" }}
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
                        <Link to={item.path}>{item.label}</Link>
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
                      style={{ fontSize: "24px", color: "#fff" }}
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
                {/* Task 3 */}
                <Link to="/">
                  <Button
                    style={{
                      background: `${url === "/" ? "red" : "none"}`,
                      border: `${url === "/" ? "red" : "none"}`,
                    }}
                  >
                    <HomeOutlined
                      style={{ fontSize: "20px", color: "white" }}
                    />
                    <Text
                      style={{
                        color: "white",
                        marginLeft: "4px",
                      }}
                    >
                      Trang chủ
                    </Text>
                  </Button>
                </Link>

                <Link to="/news">
                  <Button
                    style={{
                      background: `${url === "/news" ? "red" : "none"}`,
                      border: `${url === "/news" ? "red" : "none"}`,
                    }}
                  >
                    <ProfileOutlined
                      style={{ fontSize: "20px", color: "white" }}
                    />
                    <Text style={{ color: "white", marginLeft: "4px" }}>
                      Tin tức
                    </Text>
                  </Button>
                </Link>

                <Link to="/problem">
                  <Button
                    style={{
                      background: `${url === "/problem" ? "red" : "none"}`,
                      border: `${url === "/problem" ? "red" : "none"}`,
                    }}
                  >
                    <ThunderboltOutlined
                      style={{ fontSize: "20px", color: "white" }}
                    />
                    <Text style={{ color: "white", marginLeft: "4px" }}>
                      Vấn đề
                    </Text>
                  </Button>
                </Link>

                <Link to="/incident">
                  <Button
                    style={{
                      background: `${url === "/incident" ? "red" : "none"}`,
                      border: `${url === "/incident" ? "red" : "none"}`,
                    }}
                  >
                    <ExclamationCircleOutlined
                      style={{ fontSize: "20px", color: "white" }}
                    />
                    <Text style={{ color: "white", marginLeft: "4px" }}>
                      Sự cố
                    </Text>
                  </Button>
                </Link>

                {/* Task 6 */}
                <Button
                  onClick={handleCheckRole}
                  style={{
                    //Task 3
                    background: `${url === "/rescue-seeker" ? "red" : "none"}`,
                    border: `${url === "/rescue-seeker" ? "red" : "none"}`,
                  }}
                >
                  <ThunderboltOutlined
                    style={{ fontSize: "20px", color: "white" }}
                  />
                  <Text style={{ color: "white", marginLeft: "4px" }}>
                    Cứu hộ
                  </Text>
                </Button>
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
                    {/* Task 2 */}
                    {/* Task bổ sung */}
                    {userInfo?.role === "ROLE_USER" ? (
                      <Button
                        type="default"
                        className="emergency-button"
                        onClick={showModalWhenLoginUser}
                        disabled={coordinates}
                      >
                        Cần cứu hộ
                      </Button>
                    ) : (
                      <Button
                        type="default"
                        className="emergency-button"
                        onClick={showModalWhenLoginRescuer}
                        disabled={isActionRescue}
                      >
                        Cần cứu hộ
                      </Button>
                    )}

                    <Dropdown overlay={bellMenu} placement="bottomLeft">
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
                    <Dropdown overlay={userMenu} placement="bottomRight">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Avatar src={userInfo?.avatar} />
                        <div style={{ marginLeft: "8px" }}>
                          <Text strong style={{ color: "white" }}>
                            Xin chào, {userInfo?.name}
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
                    {/* New */}
                    <Button
                      type="default"
                      className="emergency-button"
                      onClick={showModal}
                    >
                      Cần cứu hộ
                    </Button>

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

      {/* New */}
      <Modal
        title={
          <div style={{ textAlign: "center" }}>Thông tin người cần cứu hộ</div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        centered
        closeIcon={null}
        footer={[]}
      >
        <Form
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          layout="horizontal"
          style={{
            marginTop: "25px",
          }}
        >
          <Controller
            name="name"
            control={control}
            defaultValue={userInfo?.name || ""}
            render={({ field }) => (
              <Form.Item
                label="Họ và tên"
                validateStatus={errors.name ? "error" : ""}
                help={errors.name ? errors.name.message : ""}
              >
                <Input
                  {...field}
                  placeholder="Nhập họ và tên"
                  disabled={userInfo?.name}
                />
              </Form.Item>
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Số điện thoại"
                validateStatus={errors.phone ? "error" : ""}
                help={errors.phone ? errors.phone.message : ""}
              >
                <Input {...field} placeholder="Nhập số điện thoại" />
              </Form.Item>
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Kiểu gặp nạn"
                validateStatus={errors.type ? "error" : ""}
                help={errors.type ? errors.type.message : ""}
              >
                <Select
                  placeholder="Vui lòng chọn kiểu gặp nạn"
                  onChange={handleChangeType}
                >
                  <Option value="Thiên tai">Thiên tai</Option>
                  <Option value="Sự cố">Sự cố</Option>
                </Select>
              </Form.Item>
            )}
          />

          {emergencyType === "Thiên tai" && (
            <>
              <Controller
                name="naturalDisasterName"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Tên thiên tai"
                    validateStatus={errors.naturalDisasterName ? "error" : ""}
                    help={
                      errors.naturalDisasterName
                        ? errors.naturalDisasterName.message
                        : ""
                    }
                  >
                    <Input {...field} placeholder="Nhập tên thiên tai" />
                  </Form.Item>
                )}
              />

              <Controller
                name="naturalDisasterType"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Loại thiên tai"
                    validateStatus={errors.naturalDisasterType ? "error" : ""}
                    help={
                      errors.naturalDisasterType
                        ? errors.naturalDisasterType.message
                        : ""
                    }
                  >
                    <Input {...field} placeholder="Nhập loại thiên tai" />
                  </Form.Item>
                )}
              />
            </>
          )}

          {emergencyType === "Sự cố" && (
            <>
              <Controller
                name="incidentName"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Tên sự cố"
                    validateStatus={errors.incidentName ? "error" : ""}
                    help={
                      errors.incidentName ? errors.incidentName.message : ""
                    }
                  >
                    <Input {...field} placeholder="Nhập tên sự cố" />
                  </Form.Item>
                )}
              />

              <Controller
                name="incidentType"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Loại sự cố"
                    validateStatus={errors.incidentType ? "error" : ""}
                    help={
                      errors.incidentType ? errors.incidentType.message : ""
                    }
                  >
                    <Input {...field} placeholder="Nhập loại sự cố" />
                  </Form.Item>
                )}
              />
            </>
          )}

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Địa chỉ"
                validateStatus={errors.address ? "error" : ""}
                help={errors.address ? errors.address.message : ""}
              >
                <Input
                  {...field}
                  placeholder="Nhập địa chỉ"
                  value={valueAddress} // Đặt giá trị của input "address"
                  onChange={(e) => setValueAddress(e.target.value)}
                />
              </Form.Item>
            )}
          />

          {/* Task 1 */}
          <Controller
            name="priority"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Form.Item
                label="Độ ưu tiên"
                validateStatus={error ? "error" : ""}
                help={error?.message}
              >
                <Radio.Group {...field}>
                  <Radio value="Khẩn cấp" style={{ color: "red" }}>
                    Khẩn cấp
                  </Radio>
                  <Radio value="Trung bình" style={{ color: "green" }}>
                    Trung bình
                  </Radio>
                </Radio.Group>
              </Form.Item>
            )}
          />
        </Form>

        <Row
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <Button onClick={getCurrentPosition}>Vị trí hiện tại</Button>
        </Row>

        <Row
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <Upload
            beforeUpload={beforeUpload}
            customRequest={handleUpload}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Thêm hình ảnh</Button>
          </Upload>
        </Row>

        <Row
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Button onClick={handleCancel}>Trở về</Button>
          <Button
            type="primary"
            onClick={handleSubmit(onSubmit)}
            loading={loading}
          >
            {loading ? "Đang gửi..." : "Gửi thông tin"}
          </Button>
        </Row>
      </Modal>

      {/* Task bổ sung */}
      <Modal
        title={
          <div style={{ textAlign: "center" }}>Thông tin người cần cứu hộ</div>
        }
        open={isModalOpenWhenLoginUser}
        onCancel={handleCancelWhenLoginUser}
        centered
        closeIcon={null}
        footer={[]}
      >
        <Form
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          layout="horizontal"
          style={{
            marginTop: "25px",
          }}
        >
          <Controller
            name="name"
            control={control}
            defaultValue={userInfo?.name || ""}
            render={({ field }) => (
              <Form.Item
                label="Họ và tên"
                validateStatus={errors.name ? "error" : ""}
                help={errors.name ? errors.name.message : ""}
              >
                <Input
                  {...field}
                  placeholder="Nhập họ và tên"
                  disabled={userInfo?.name}
                />
              </Form.Item>
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Số điện thoại"
                validateStatus={errors.phone ? "error" : ""}
                help={errors.phone ? errors.phone.message : ""}
              >
                <Input {...field} placeholder="Nhập số điện thoại" />
              </Form.Item>
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Kiểu gặp nạn"
                validateStatus={errors.type ? "error" : ""}
                help={errors.type ? errors.type.message : ""}
              >
                <Select
                  placeholder="Vui lòng chọn kiểu gặp nạn"
                  onChange={handleChangeType}
                >
                  <Option value="Thiên tai">Thiên tai</Option>
                  <Option value="Sự cố">Sự cố</Option>
                </Select>
              </Form.Item>
            )}
          />

          {emergencyType === "Thiên tai" && (
            <>
              <Controller
                name="naturalDisasterName"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Tên thiên tai"
                    validateStatus={errors.naturalDisasterName ? "error" : ""}
                    help={
                      errors.naturalDisasterName
                        ? errors.naturalDisasterName.message
                        : ""
                    }
                  >
                    <Input {...field} placeholder="Nhập tên thiên tai" />
                  </Form.Item>
                )}
              />

              <Controller
                name="naturalDisasterType"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Loại thiên tai"
                    validateStatus={errors.naturalDisasterType ? "error" : ""}
                    help={
                      errors.naturalDisasterType
                        ? errors.naturalDisasterType.message
                        : ""
                    }
                  >
                    <Input {...field} placeholder="Nhập loại thiên tai" />
                  </Form.Item>
                )}
              />
            </>
          )}

          {emergencyType === "Sự cố" && (
            <>
              <Controller
                name="incidentName"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Tên sự cố"
                    validateStatus={errors.incidentName ? "error" : ""}
                    help={
                      errors.incidentName ? errors.incidentName.message : ""
                    }
                  >
                    <Input {...field} placeholder="Nhập tên sự cố" />
                  </Form.Item>
                )}
              />

              <Controller
                name="incidentType"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Loại sự cố"
                    validateStatus={errors.incidentType ? "error" : ""}
                    help={
                      errors.incidentType ? errors.incidentType.message : ""
                    }
                  >
                    <Input {...field} placeholder="Nhập loại sự cố" />
                  </Form.Item>
                )}
              />
            </>
          )}

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Địa chỉ"
                validateStatus={errors.address ? "error" : ""}
                help={errors.address ? errors.address.message : ""}
              >
                <Input
                  {...field}
                  placeholder="Nhập địa chỉ"
                  value={valueAddress} // Đặt giá trị của input "address"
                  onChange={(e) => setValueAddress(e.target.value)}
                />
              </Form.Item>
            )}
          />

          {/* Task 1 */}
          <Controller
            name="priority"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Form.Item
                label="Độ ưu tiên"
                validateStatus={error ? "error" : ""}
                help={error?.message}
              >
                <Radio.Group {...field}>
                  <Radio value="Khẩn cấp" style={{ color: "red" }}>
                    Khẩn cấp
                  </Radio>
                  <Radio value="Trung bình" style={{ color: "green" }}>
                    Trung bình
                  </Radio>
                </Radio.Group>
              </Form.Item>
            )}
          />
        </Form>

        <Row
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <Button onClick={getCurrentPosition}>Vị trí hiện tại</Button>
        </Row>

        <Row
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <Upload
            beforeUpload={beforeUpload}
            customRequest={handleUpload}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Thêm hình ảnh</Button>
          </Upload>
        </Row>

        <Row
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Button onClick={handleCancelWhenLoginUser}>Trở về</Button>
          <Button
            type="primary"
            onClick={handleSubmit(onSubmitWhenLoginUser)}
            loading={loading}
          >
            {loading ? "Đang gửi..." : "Gửi thông tin"}
          </Button>
        </Row>
      </Modal>

      {/* Task 5 */}
      <Modal
        title={
          <div style={{ textAlign: "center" }}>Thông tin người cần cứu hộ</div>
        }
        open={isModalOpenWhenLoginRescuer}
        onCancel={handleCancelWhenLoginRescuer}
        centered
        closeIcon={null}
        footer={[]}
      >
        <Form
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          layout="horizontal"
          style={{
            marginTop: "25px",
          }}
        >
          <Controller
            name="name"
            control={control}
            defaultValue={userInfo?.name || ""}
            render={({ field }) => (
              <Form.Item
                label="Họ và tên"
                validateStatus={errors.name ? "error" : ""}
                help={errors.name ? errors.name.message : ""}
              >
                <Input
                  {...field}
                  placeholder="Nhập họ và tên"
                  disabled={userInfo?.name}
                />
              </Form.Item>
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Số điện thoại"
                validateStatus={errors.phone ? "error" : ""}
                help={errors.phone ? errors.phone.message : ""}
              >
                <Input {...field} placeholder="Nhập số điện thoại" />
              </Form.Item>
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Kiểu gặp nạn"
                validateStatus={errors.type ? "error" : ""}
                help={errors.type ? errors.type.message : ""}
              >
                <Select
                  placeholder="Vui lòng chọn kiểu gặp nạn"
                  onChange={handleChangeType}
                >
                  <Option value="Thiên tai">Thiên tai</Option>
                  <Option value="Sự cố">Sự cố</Option>
                </Select>
              </Form.Item>
            )}
          />

          {emergencyType === "Thiên tai" && (
            <>
              <Controller
                name="naturalDisasterName"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Tên thiên tai"
                    validateStatus={errors.naturalDisasterName ? "error" : ""}
                    help={
                      errors.naturalDisasterName
                        ? errors.naturalDisasterName.message
                        : ""
                    }
                  >
                    <Input {...field} placeholder="Nhập tên thiên tai" />
                  </Form.Item>
                )}
              />

              <Controller
                name="naturalDisasterType"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Loại thiên tai"
                    validateStatus={errors.naturalDisasterType ? "error" : ""}
                    help={
                      errors.naturalDisasterType
                        ? errors.naturalDisasterType.message
                        : ""
                    }
                  >
                    <Input {...field} placeholder="Nhập loại thiên tai" />
                  </Form.Item>
                )}
              />
            </>
          )}

          {emergencyType === "Sự cố" && (
            <>
              <Controller
                name="incidentName"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Tên sự cố"
                    validateStatus={errors.incidentName ? "error" : ""}
                    help={
                      errors.incidentName ? errors.incidentName.message : ""
                    }
                  >
                    <Input {...field} placeholder="Nhập tên sự cố" />
                  </Form.Item>
                )}
              />

              <Controller
                name="incidentType"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Loại sự cố"
                    validateStatus={errors.incidentType ? "error" : ""}
                    help={
                      errors.incidentType ? errors.incidentType.message : ""
                    }
                  >
                    <Input {...field} placeholder="Nhập loại sự cố" />
                  </Form.Item>
                )}
              />
            </>
          )}

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Địa chỉ"
                validateStatus={errors.address ? "error" : ""}
                help={errors.address ? errors.address.message : ""}
              >
                <Input
                  {...field}
                  placeholder="Nhập địa chỉ"
                  value={valueAddress} // Đặt giá trị của input "address"
                  onChange={(e) => setValueAddress(e.target.value)}
                />
              </Form.Item>
            )}
          />

          {/* Task 1 */}
          <Controller
            name="priority"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Form.Item
                label="Độ ưu tiên"
                validateStatus={error ? "error" : ""}
                help={error?.message}
              >
                <Radio.Group {...field}>
                  <Radio value="Khẩn cấp" style={{ color: "red" }}>
                    Khẩn cấp
                  </Radio>
                  <Radio value="Trung bình" style={{ color: "green" }}>
                    Trung bình
                  </Radio>
                </Radio.Group>
              </Form.Item>
            )}
          />
        </Form>

        <Row
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <Button onClick={getCurrentPosition}>Vị trí hiện tại</Button>
        </Row>

        <Row
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <Upload
            beforeUpload={beforeUpload}
            customRequest={handleUpload}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Thêm hình ảnh</Button>
          </Upload>
        </Row>

        <Row
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Button onClick={handleCancelWhenLoginRescuer}>Trở về</Button>
          <Button
            type="primary"
            onClick={handleSubmit(onSubmitWhenLoginRescuer)}
            loading={loading}
          >
            {loading ? "Đang gửi..." : "Gửi thông tin"}
          </Button>
        </Row>
      </Modal>

      {/* Task 4 */}
      <Modal
        title={
          <div style={{ textAlign: "center" }}>
            Thông tin đăng nhập người cần cứu hộ
          </div>
        }
        open={isModalOpenInfo}
        onCancel={handleCancelInfo}
        centered
        footer={[]}
      >
        <Text strong>
          Username
          <p
            style={{
              fontWeight: "400",
            }}
          >
            {username}
          </p>
        </Text>
        <Text strong>
          Password
          <p
            style={{
              fontWeight: "400",
            }}
          >
            {password}
          </p>
        </Text>
      </Modal>

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
