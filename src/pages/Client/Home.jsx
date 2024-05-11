import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  theme,
  Breadcrumb,
  Typography,
  Image,
  Select,
  message,
  Upload,
  notification,
  Menu,
  Avatar,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { geocoding, reverseGeocoding } from "../../features/Goong/goongSlice";
import {
  addNaturalDisasterVersion1,
  addNaturalDisasterVersion2,
} from "../../features/NaturalDisaster/naturalDisastersSlice";
import {
  addProblemVersion1,
  addProblemVersion2,
} from "../../features/Problems/problemsSlice";
import { Link, useNavigate } from "react-router-dom";
import goongjs from "@goongmaps/goong-js";
import { GOONG_MAP_KEY } from "../../constants/constants";
import { addImage } from "../../features/Uploads/uploadsSlice";
import axios from "axios";
import {
  clearUserInfo,
  getAllRescueNeeded,
  getAllRescueSeeker,
} from "../../features/Users/usersSlice";
import Cookies from "js-cookie";

const { Option } = Select;
const { Text } = Typography;

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
    .min(10, "Số điện thoại chỉ được nhập tối thiểu 10 ký tự")
    .max(10, "Số điện thoại chỉ được nhập tối đa 10 ký tự"),
  // address: yup
  //   .string()
  //   .required("Vui lòng nhập địa chỉ")
  //   .min(5, "Địa chỉ phải có ít nhất 10 ký tự")
  //   .max(100, "Địa chỉ chỉ được nhập tối đa 100 ký tự"),
});

const Home = () => {
  // Redux State
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state?.user?.userInfo);
  const coordinates = useSelector(
    (state) => state?.user?.userInfo?.coordinates
  );

  // New
  const rescueNeededList = useSelector((state) => state?.user?.list);
  const rescueSeekerList = useSelector((state) => state?.user?.listSeeker);

  // Constants
  let validLat = 0;
  let validLng = 0;

  if (coordinates) {
    const coordinatesParse = JSON.parse(coordinates);
    validLat = parseFloat(coordinatesParse?.lat);
    validLng = parseFloat(coordinatesParse?.lng);
  }

  // Ant design
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

  // Local State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emergencyType, setEmergencyType] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [markerPosition, setMarkerPosition] = useState([validLng, validLat]);
  const [hasCoordinates, setHasCoordinates] = useState(!!coordinates);
  const [isLogin] = useState(!!userInfo);
  const [showMap, setShowMap] = useState(hasCoordinates);
  const [showDanger, setShowDanger] = useState(true);
  const [urlImage, setUrlImage] = useState("");
  const [valueAddress, setValueAddress] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);

  // New
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFirstMarkerClicked, setIsFirstMarkerClicked] = useState(false);
  const [selectedRescueNeeded, setSelectedRescueNeeded] = useState(null);
  const [popupIndex, setPopupIndex] = useState(null);
  const [showDetailRescueNeeded, setShowDetailRescueNeeded] = useState(false);

  // useEffect add map
  useEffect(() => {
    goongjs.accessToken = GOONG_MAP_KEY;

    // Tạo một biến để lưu trữ vị trí trung tâm mặc định
    let defaultCenter = [106.70105355500004, 10.776553100000058];

    // Kiểm tra xem markerPosition có giá trị [0, 0] không
    if (markerPosition[0] === 0 && markerPosition[1] === 0) {
      defaultCenter = [106.70105355500004, 10.776553100000058];
    }

    const map = new goongjs.Map({
      container: "map",
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: defaultCenter,
      zoom: 9,
    });

    const marker = new goongjs.Marker({ color: "red" })
      .setLngLat(markerPosition)
      .addTo(map);

    // Kiểm tra xem markerPosition có khác [0, 0] không trước khi thêm marker
    if (markerPosition[0] !== 0 || markerPosition[1] !== 0) {
      const marker = new goongjs.Marker({ color: "red" })
        .setLngLat(markerPosition)
        .addTo(map);

      map.flyTo({
        center: markerPosition,
        zoom: 13, // Bạn có thể tùy chỉnh mức độ zoom ở đây
        essential: true, // Cần thiết để tránh lỗi khi sử dụng flyTo trong useEffect
      });
    }

    return () => {
      map.remove();
      marker.remove();
    };
  }, [markerPosition, coordinates, hasCoordinates, isLogin]);

  // New
  useEffect(() => {
    dispatch(getAllRescueNeeded());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getAllRescueSeeker());
  }, [dispatch]);
  useEffect(() => {
    if (userInfo?.role === "ROLE_RESCUER") {
      dispatch(clearUserInfo());
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      navigate("/login");
    }
  }, [dispatch, userInfo?.role, navigate]);

  // Event Handlers
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
      if (!imageUploaded) {
        // Nếu chưa, hiển thị thông báo hoặc thông báo lỗi
        notification.error({
          message: "Lỗi thêm thông tin",
          description: "Vui lòng tải lên hình ảnh gặp nạn!",
        });
        return;
      }

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

  // New
  const handleClick = async (item, index) => {
    setSelectedItem(item.id);
    setSelectedRescueNeeded(item);
    const { lat, lng } = JSON.parse(item.coordinates);
    setMarkerPosition([lng, lat]);
  };

  console.log("setSelectedItem", selectedItem);
  console.log("setSelectedRescueNeeded", selectedRescueNeeded);
  console.log("setShowDetailRescueNeeded", showDetailRescueNeeded);

  return (
    <>
      <Breadcrumb
        style={{
          margin: "20px 0",
        }}
      >
        <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
      </Breadcrumb>
      <Row gutter={[16, 16]}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={24}
          style={{
            height: "100%",
            background: borderRadiusLG,
          }}
        >
          <Row
            gutter={[16, 16]}
            style={{
              height: "auto",
              background: borderRadiusLG,
            }}
          >
            {/* New */}
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={6}
              xl={6}
              style={{
                height: "500px",
                background: "white",
                color: "black",
                border: "1px solid rgba(248, 11, 11, 0.06)",
                borderRadius: "10px",
              }}
            >
              <Col
                style={{
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(5, 5, 5, 0.06)",
                }}
              >
                <Typography.Title
                  level={1}
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "black",
                    marginLeft: "10px",
                    marginBottom: 0,
                  }}
                >
                  Danh sách người cần cứu hộ
                </Typography.Title>
              </Col>
              <Menu
                mode="inline"
                style={{ height: "450px", overflowY: "auto" }}
                // selectedKeys={selectedItem ? [String(selectedItem)] : []}
                // disabled={!isFirstMarkerClicked}
              >
                {rescueNeededList.map((item) => (
                  <Menu.Item
                    key={String(item.id)}
                    onClick={() => handleClick(item)}
                    style={{
                      height: "145px",
                      border: "1px solid rgba(5, 5, 5, 0.06)",
                    }}
                  >
                    <Row>
                      <Col span={4}>
                        <Avatar src={item.avatar} size={40} />
                      </Col>
                      <Col span={20}>
                        <Text style={{ display: "block", marginBottom: "5px" }}>
                          {item.name}
                        </Text>
                        <Text
                          type="secondary"
                          style={{ display: "block", fontSize: "13px" }}
                        >
                          Số điện thoại: {item.phone}
                        </Text>
                        <Text
                          type="secondary"
                          style={{ display: "block", fontSize: "13px" }}
                        >
                          Kiểu gặp nạn:{" "}
                          {item.disaster_name || item.problem_name}
                        </Text>
                        <Text
                          type="secondary"
                          style={{ display: "block", fontSize: "13px" }}
                        >
                          Địa chỉ: {item.address}
                        </Text>
                        <Text
                          type="secondary"
                          style={{ display: "block", fontSize: "13px" }}
                        >
                          Trạng thái:{" "}
                          {item.disaster_status || item.problem_status}
                        </Text>
                      </Col>
                    </Row>
                  </Menu.Item>
                ))}
              </Menu>
            </Col>

            <Col
              xs={24}
              sm={24}
              md={24}
              lg={12}
              xl={12}
              style={{
                height: "500px",
                background: borderRadiusLG,
              }}
            >
              <div id="map" style={{ width: "100%", height: "100%" }}></div>
            </Col>

            {/* New */}
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={6}
              xl={6}
              style={{
                height: "500px",
                background: "white",
                color: "black",
                border: "1px solid rgba(5, 5, 5, 0.06)",
                borderRadius: "10px",
              }}
            >
              <Col
                style={{
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(5, 5, 5, 0.06)",
                }}
              >
                <Typography.Title
                  level={1}
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "black",
                    marginLeft: "10px",
                    marginBottom: 0,
                  }}
                >
                  Danh sách người cứu hộ
                </Typography.Title>
              </Col>
              <Menu
                mode="inline"
                style={{ height: "450px", overflowY: "auto" }}
                // selectedKeys={selectedItem ? [String(selectedItem)] : []}
                disabled={true}
              >
                {rescueSeekerList.map((item) => (
                  <Menu.Item
                    key={String(item.id)}
                    // onClick={() => handleClick(item)}
                    style={{
                      height: "145px",
                      border: "1px solid rgba(5, 5, 5, 0.06)",
                    }}
                  >
                    <Row>
                      <Col span={4}>
                        <Avatar src={item.avatar} size={40} />
                      </Col>
                      <Col span={20}>
                        <Text style={{ display: "block", marginBottom: "5px" }}>
                          {item.name}
                        </Text>
                        <Text
                          type="secondary"
                          style={{ display: "block", fontSize: "13px" }}
                        >
                          Số điện thoại: {item.phone || "Chưa cập nhật"}
                        </Text>
                        {/* <Text
                          type="secondary"
                          style={{ display: "block", fontSize: "13px" }}
                        >
                          Kiểu gặp nạn:{" "}
                          {item.disaster_name || item.problem_name}
                        </Text>
                        <Text
                          type="secondary"
                          style={{ display: "block", fontSize: "13px" }}
                        >
                          Địa chỉ: {item.address}
                        </Text>
                        <Text
                          type="secondary"
                          style={{ display: "block", fontSize: "13px" }}
                        >
                          Trạng thái:{" "}
                          {item.disaster_status || item.problem_status}
                        </Text> */}
                      </Col>
                    </Row>
                  </Menu.Item>
                ))}
              </Menu>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Home;
