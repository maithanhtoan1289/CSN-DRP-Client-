import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Avatar,
  Row,
  Col,
  theme,
  Breadcrumb,
  Select,
  Typography,
  Menu,
  notification,
  Image,
} from "antd";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { direction, geocoding } from "../../features/Goong/goongSlice";
import {
  addCoordinates,
  clearUserInfo,
  getAllRescueNeeded,
} from "../../features/Users/usersSlice";
import goongjs from "@goongmaps/goong-js";
import polyline from "@mapbox/polyline";
import { addNaturalDisasterStatus } from "../../features/NaturalDisaster/naturalDisastersSlice";
import { addProblemStatus } from "../../features/Problems/problemsSlice";
import { GOONG_MAP_KEY } from "../../constants/constants";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const { Text } = Typography;
const { Option } = Select;

// Define yup validate
const schema = yup.object().shape({
  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .min(10, "Vui lòng nhập tối thiểu 10 số")
    .max(10, "Vui lòng nhập tối thiểu 10 số")
    .matches(/^(03|05|07|08|09)+([0-9]{8})$/, "Số điện thoại không hợp lệ")
    .test("only-digits", "Số điện thoại không hợp lệ", (value) =>
      /^\d+$/.test(value)
    ),
  address: yup
    .string()
    .required("Vui lòng nhập địa chỉ")
    .test("first-uppercase", "Vui lòng nhập lại địa chỉ", (value) => {
      if (/^[a-zA-Z]/.test(value)) {
        return /^[A-Z]/.test(value);
      }
      return true;
    })
    .test("not-all-digits", "Vui lòng nhập lại địa chỉ", (value) => {
      return !/^\d+$/.test(value);
    })
    .test(
      "special-characters",
      "Vui lòng nhập lại địa chỉ",
      (value) => !/[!@#$%^&*()?":{}|<>]/.test(value)
    ),
});

const RescueSeeker = () => {
  // Redux State
  const dispatch = useDispatch();
  const userId = useSelector((state) => state?.user?.userInfo?.id);
  const rescueNeededList = useSelector((state) => state?.user?.list);

  // New
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state?.user?.userInfo);

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
  const [isModalOpenGeocoding, setIsModalOpenGeocoding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [markerPositions, setMarkerPositions] = useState([]);
  const [hasCoordinates, setHasCoordinates] = useState(false);
  const [isLogin] = useState(!!userId);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [polylinePoints, setPolylinePoints] = useState(null);
  const [isFirstMarkerClicked, setIsFirstMarkerClicked] = useState(false);
  const [selectedRescueNeeded, setSelectedRescueNeeded] = useState(null);
  const [changeStatus, setChangeStatus] = useState("Chưa kết thúc");
  const [allMarket, setAllMarket] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [popupIndex, setPopupIndex] = useState(null);
  const [isActiveMarket, setIsActiveMarket] = useState(false);
  const [showDetailRescueNeeded, setShowDetailRescueNeeded] = useState(false);

  // useEffect for loading data rescue needed
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(getAllRescueNeeded());
        const coordinates = response.payload.data.rows.map((item) => {
          const { lat, lng } = JSON.parse(item.coordinates);
          return [lng, lat];
        });
        setMarkerPositions(coordinates);
        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching rescue data:", error);
      }
    };

    fetchData();
  }, [dispatch, setMarkerPositions]);

  // useEffect to update selectedRescueNeeded when selectedItem changes
  useEffect(() => {
    if (selectedItem !== null) {
      setSelectedRescueNeeded(
        rescueNeededList.find((item) => item.id === selectedItem)
      );
    }
  }, [selectedItem, rescueNeededList]);

  // useEffect add map
  useEffect(() => {
    if (isLogin && dataFetched) {
      goongjs.accessToken = GOONG_MAP_KEY;
      const map = new goongjs.Map({
        container: "map",
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center:
          markerPositions.length > 0
            ? markerPositions[0]
            : [106.70105355500004, 10.776553100000058],
        zoom: 7,
      });

      // Tạo một mảng mới để lưu trữ tất cả các marker
      const newMarkers = [];

      const seenPositions = {};
      const uniquePositions = [];

      markerPositions.forEach((position) => {
        const key = position.join(",");
        if (!seenPositions[key]) {
          uniquePositions.push(position);
          seenPositions[key] = true;
        }
      });

      const color = isActiveMarket ? "red" : "green";

      uniquePositions.forEach((position, index) => {
        const marker = new goongjs.Marker({
          color: index === 0 ? color : "green",
        })
          .setLngLat(position)
          .addTo(map);

        // Thêm chú thích vào marker
        const popupContent =
          index === 0 ? "Vị trí của bạn" : "Vị trí của người cần cứu hộ";
        const popup = new goongjs.Popup({
          closeButton: false,
          closeOnClick: false,
        })
          .setHTML(`<div class="custom-popup">${popupContent}</div>`)
          .setMaxWidth("300px");
        marker.setPopup(popup);

        newMarkers.push(marker);
      });

      if (polylinePoints) {
        map.on("load", function () {
          const layers = map.getStyle().layers;
          let firstSymbolId;
          for (let i = 0; i < layers.length; i++) {
            if (layers[i].type === "symbol") {
              firstSymbolId = layers[i].id;
              break;
            }
          }

          // Tạo một đối tượng geoJSON từ dữ liệu polylinePoints
          const geoJSON = polyline.toGeoJSON(polylinePoints);

          // Thêm đối tượng geoJSON như một nguồn dữ liệu cho đường đi
          map.addSource("route", {
            type: "geojson",
            data: geoJSON,
          });

          // Thêm layer để hiển thị đường đi trên bản đồ
          map.addLayer(
            {
              id: "route",
              type: "line",
              source: "route",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#1e88e5",
                "line-width": 8,
              },
            },
            firstSymbolId
          );

          // Tính toán giới hạn bao quanh các markerPositions
          const bounds = new goongjs.LngLatBounds();
          markerPositions.forEach((position) => {
            bounds.extend(position);
          });

          // Phóng to bản đồ để hiển thị cả hai vị trí
          map.fitBounds(bounds, { padding: 130 });
        });
      }

      // Trả về hàm để xóa map và tất cả các marker
      return () => {
        map.remove();
      };
    }
  }, [
    allMarket,
    markerPositions,
    hasCoordinates,
    isLogin,
    polylinePoints,
    isFirstMarkerClicked,
  ]);

  // New
  useEffect(() => {
    if (userInfo?.role === "ROLE_USER" || !userInfo) {
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

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModalGeocoding = () => {
    setIsModalOpenGeocoding(true);
  };

  const handleOkGeocoding = () => {
    setIsModalOpenGeocoding(false);
  };

  const handleCancelGeocoding = () => {
    setIsModalOpenGeocoding(false);
  };

  const handleClick = async (item, index) => {
    setSelectedItem(item.id);
    setSelectedRescueNeeded(item);
    setPopupIndex(index);

    setShowDetailRescueNeeded(true);

    // const coordinates = JSON.parse(item.coordinates);
    // const { lng, lat } = coordinates;
    // const markerPosition = [parseFloat(lng), parseFloat(lat)];

    // const destination = [markerPosition[1], markerPosition[0]];

    // setDestination(destination.toString().split(","));

    // // Thêm marker mới vào mảng markerPositions
    // if (markerPositions.length === 2) {
    //   // Thay thế markerPosition thứ 2 bằng markerPosition thứ 3
    //   setMarkerPositions((prevPositions) => [prevPositions[0], markerPosition]);
    // } else {
    //   setMarkerPositions((prevPositions) => [...prevPositions, markerPosition]);
    // }

    // try {
    //   const data = { origin, destination };
    //   const response = await dispatch(direction(data));
    //   const polylinePoints =
    //     response.payload.routes[0].overview_polyline.points;
    //   setPolylinePoints(polylinePoints);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const handleChangeStatus = (value) => {
    setChangeStatus(value);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Chuyển địa chỉ sang URL
      const encodedAddress = encodeURIComponent(data.address);

      const response = await dispatch(geocoding(encodedAddress));
      const { lng, lat } = response.payload.geometry.location;
      const markerPosition = [parseFloat(lng), parseFloat(lat)];

      const destination = [markerPosition[1], markerPosition[0]];

      setOrigin(destination.toString().split(","));
      setMarkerPositions((prevPositions) => [markerPosition, ...prevPositions]);

      const coordinates = JSON.stringify(response.payload.geometry.location);

      // Tạo data user
      const newData = {
        ...data,
        userId: userId,
        coordinates: coordinates,
      };

      await dispatch(addCoordinates(newData));

      notification.success({
        message: "Cập nhật vị trí thành công",
        description: "Vị trí của bạn được cập nhật thành công!",
      });

      setHasCoordinates(true);
      setIsFirstMarkerClicked(true);
      setIsActiveMarket(true);
      setLoading(false);
      setIsModalOpenGeocoding(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const onSubmitEditStatus = async () => {
    try {
      setLoading(true);

      const rescueId = userId;
      const id = selectedItem;

      const data = {
        id,
        rescueId,
        typeId:
          selectedRescueNeeded?.disaster_id || selectedRescueNeeded?.problem_id,
        typeName:
          selectedRescueNeeded?.disaster_name ||
          selectedRescueNeeded?.problem_name,
        status: changeStatus,
      };

      if (changeStatus === "kết thúc") {
        if (selectedRescueNeeded?.disaster_id) {
          await dispatch(addNaturalDisasterStatus(data));
          notification.success({
            message: "Cập nhật trạng thái thành công",
            description: "Trạng thái thiên tai được cập nhật thành công!",
          });
        } else if (selectedRescueNeeded?.problem_id) {
          await dispatch(addProblemStatus(data));
          notification.success({
            message: "Cập nhật trạng thái thành công",
            description: "Trạng thái vấn đề được cập nhật thành công!",
          });
        }

        // Lọc ra item có id trùng với selectedItem
        const selectedItemCoordinates = selectedRescueNeeded
          ? JSON.parse(selectedRescueNeeded.coordinates)
          : null;

        // Lọc ra các vị trí khác với vị trí của selectedItem
        const newMarkerPositions = markerPositions.filter((position) => {
          const positionCoordinates = {
            lng: parseFloat(position[0]),
            lat: parseFloat(position[1]),
          };
          return !(
            selectedItemCoordinates &&
            positionCoordinates.lng === selectedItemCoordinates.lng &&
            positionCoordinates.lat === selectedItemCoordinates.lat
          );
        });

        setMarkerPositions(newMarkerPositions);

        setPolylinePoints(null);
        setChangeStatus("Chưa kết thúc");

        dispatch(getAllRescueNeeded());
        setIsModalOpen(false);
      } else {
        notification.error({
          message: "Lỗi cập nhật trạng thái",
          description: "Trạng thái cập nhật phải là Kết thúc!",
        });
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const markerPosition = [parseFloat(longitude), parseFloat(latitude)];
          const destination = [markerPosition[1], markerPosition[0]];

          setOrigin(destination.toString().split(","));
          setMarkerPositions((prevPositions) => [
            markerPosition,
            ...prevPositions,
          ]);
          setIsFirstMarkerClicked(true);
          setIsActiveMarket(true);

          notification.success({
            message: "Cập nhật vị trí thành công",
            description: "Vị trí của bạn được cập nhật thành công!",
          });
        },
        (error) => {
          console.error("Lỗi khi lấy vị trí hiện tại:", error);
        }
      );
    } else {
      console.error("Trình duyệt không hỗ trợ Geolocation");
    }
  };

  const handleCancelDetailRescueNeeded = () => {
    setShowDetailRescueNeeded(false);
  };

  const handleGetGoongMapsDirections = async () => {
    setLoading(true);

    const coordinates = JSON.parse(selectedRescueNeeded.coordinates);
    const { lng, lat } = coordinates;
    const markerPosition = [parseFloat(lng), parseFloat(lat)];
    const destination = [markerPosition[1], markerPosition[0]];

    setDestination(destination.toString().split(","));

    // Thêm marker mới vào mảng markerPositions
    if (markerPositions.length === 2) {
      // Thay thế markerPosition thứ 2 bằng markerPosition thứ 3
      setMarkerPositions((prevPositions) => [prevPositions[0], markerPosition]);
    } else {
      setMarkerPositions((prevPositions) => [...prevPositions, markerPosition]);
    }

    try {
      const data = { origin, destination };
      const response = await dispatch(direction(data));
      const polylinePoints =
        response.payload.routes[0].overview_polyline.points;
      setPolylinePoints(polylinePoints);
      setShowDetailRescueNeeded(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

    // Task final
    const sortedRescueNeededList = rescueNeededList.slice().sort((a, b) => {
      // Prioritize "Khẩn cấp"
      if (
        a.disaster_priority === "Khẩn cấp" ||
        a.problem_priority === "Khẩn cấp"
      ) {
        return -1;
      } else if (
        b.disaster_priority === "Khẩn cấp" ||
        b.problem_priority === "Khẩn cấp"
      ) {
        return 1;
      }
  
      // Then prioritize "Trung bình"
      if (
        a.disaster_priority === "Trung bình" ||
        a.problem_priority === "Trung bình"
      ) {
        return -1;
      } else if (
        b.disaster_priority === "Trung bình" ||
        b.problem_priority === "Trung bình"
      ) {
        return 1;
      }
  
      // Finally, items without priority
      return 0;
    });

  return (
    <>
      <Breadcrumb
        style={{
          margin: "20px 0",
        }}
      >
        <Breadcrumb.Item>Trang chủ người cứu hộ</Breadcrumb.Item>
      </Breadcrumb>
      <Row gutter={[16, 16]}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={18}
          xl={18}
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
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              style={{
                height: "450px",
                background: borderRadiusLG,
              }}
            >
              <div id="map" style={{ width: "100%", height: "100%" }}></div>
            </Col>
          </Row>
          <Row
            style={{
              height: "50px",
              background: borderRadiusLG,
              display: "flex",
              justifyContent: "end",
              alignItems: "end",
              gap: "20px",
            }}
          >
            <Button
              type="primary"
              onClick={showModalGeocoding}
              disabled={isActiveMarket}
            >
              Định vị thủ công
            </Button>
            <Button
              type="primary"
              onClick={getCurrentPosition}
              disabled={isActiveMarket}
            >
              Vị trí hiện tại
            </Button>
            <Button
              type="primary"
              onClick={showModal}
              disabled={!selectedRescueNeeded}
            >
              Cập nhật
            </Button>
            <Modal
              title={
                <div style={{ textAlign: "center" }}>
                  Nhập thông tin chính xác của bạn
                </div>
              }
              open={isModalOpenGeocoding}
              onOk={handleOkGeocoding}
              onCancel={handleCancelGeocoding}
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
                initialValues={{}}
                style={{
                  marginTop: "25px",
                }}
              >
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
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Form.Item
                      label="Địa chỉ"
                      validateStatus={errors.address ? "error" : ""}
                      help={errors.address ? errors.address.message : ""}
                    >
                      <Input {...field} placeholder="Nhập địa chỉ" />
                    </Form.Item>
                  )}
                />
              </Form>
              <Row
                style={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Button onClick={handleCancelGeocoding}>Trở về</Button>
                <Button
                  type="primary"
                  onClick={handleSubmit(onSubmit)}
                  loading={loading}
                >
                  {loading ? "Đang gửi..." : "Gửi thông tin"}
                </Button>
              </Row>
            </Modal>
            <Modal
              title={
                <div style={{ textAlign: "center" }}>
                  Cập nhật trạng thái người cần cứu hộ
                </div>
              }
              open={isModalOpen}
              onOk={handleOk}
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
                <Form.Item label="Họ và tên">
                  <Input value={selectedRescueNeeded?.name} readOnly />
                </Form.Item>

                <Form.Item label="Số điện thoại">
                  <Input value={selectedRescueNeeded?.phone} readOnly />
                </Form.Item>

                <Form.Item label="Địa chỉ">
                  <Input value={selectedRescueNeeded?.address} readOnly />
                </Form.Item>

                <Form.Item label="Kiểu gặp nạn">
                  <Input
                    value={
                      selectedRescueNeeded?.disaster_name ||
                      selectedRescueNeeded?.problem_name
                    }
                  />
                </Form.Item>

                <Form.Item label="Tình trạng">
                  <Select value={changeStatus} onChange={handleChangeStatus}>
                    <Option value="chưa kết thúc">Chưa kết thúc</Option>
                    <Option value="kết thúc">Kết thúc</Option>
                  </Select>
                </Form.Item>
              </Form>
              <Row
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <Image
                  width={300}
                  src={
                    selectedRescueNeeded?.disaster_url_image ||
                    selectedRescueNeeded?.problem_url_image
                  }
                />
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
                  onClick={onSubmitEditStatus}
                  loading={loading}
                >
                  {loading ? "Đang gửi..." : "Gửi thông tin"}
                </Button>
              </Row>
            </Modal>

            <Modal
              title={
                <div style={{ textAlign: "center" }}>
                  Thông tin chi tiết người cần cứu hộ
                </div>
              }
              open={showDetailRescueNeeded}
              onOk={handleOk}
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
                <Form.Item label="Họ và tên">
                  <Input value={selectedRescueNeeded?.name} readOnly />
                </Form.Item>

                <Form.Item label="Số điện thoại">
                  <Input value={selectedRescueNeeded?.phone} readOnly />
                </Form.Item>

                <Form.Item label="Địa chỉ">
                  <Input value={selectedRescueNeeded?.address} readOnly />
                </Form.Item>

                <Form.Item label="Kiểu gặp nạn">
                  <Input
                    value={
                      selectedRescueNeeded?.disaster_name ||
                      selectedRescueNeeded?.problem_name
                    }
                    readOnly
                  />
                </Form.Item>

                <Form.Item label="Tình trạng">
                  <Select value="Chưa kết thúc">
                    <Option value="chưa kết thúc">Chưa kết thúc</Option>
                  </Select>
                </Form.Item>
              </Form>
              <Row
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <Image
                  width={300}
                  src={
                    selectedRescueNeeded?.disaster_url_image ||
                    selectedRescueNeeded?.problem_url_image
                  }
                />
              </Row>
              <Row
                style={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Button onClick={handleCancelDetailRescueNeeded}>Trở về</Button>
                <Button
                  type="primary"
                  onClick={handleGetGoongMapsDirections}
                  loading={loading}
                >
                  {loading ? "Đang tải..." : "Đường đi"}
                </Button>
              </Row>
            </Modal>
          </Row>
        </Col>
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
              Danh sách người cần cứu hộ
            </Typography.Title>
          </Col>
          <Menu
            mode="inline"
            style={{ height: "450px", overflowY: "auto" }}
            selectedKeys={selectedItem ? [String(selectedItem)] : []}
            disabled={!isFirstMarkerClicked}
          >
            {/* Task final */}
            {sortedRescueNeededList.map((item) => (
              <Menu.Item
                key={String(item.id)}
                onClick={() => handleClick(item)}
                style={{
                  height: "145px",
                  border: "1px solid rgba(5, 5, 5, 0.06)",
                  position: "relative",
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
                      Kiểu gặp nạn: {item.disaster_name || item.problem_name}
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
                      Trạng thái: {item.disaster_status || item.problem_status}
                    </Text>

                    {/* Task 1 */}
                    <Text
                      type="secondary"
                      style={{
                        display: "block",
                        fontSize: "13px",
                      }}
                    >
                      Độ ưu tiên:{" "}
                      <Text
                        style={{
                          fontWeight: "600",
                          color:
                            item.disaster_priority === "Khẩn cấp" ||
                            item.problem_priority === "Khẩn cấp"
                              ? "red"
                              : item.disaster_priority === "Trung bình" ||
                                item.problem_priority === "Trung bình"
                              ? "green"
                              : "inherit",
                        }}
                      >
                        {item.disaster_priority || item.problem_priority}
                      </Text>
                    </Text>
                  </Col>
                </Row>
              </Menu.Item>
            ))}
          </Menu>
        </Col>
      </Row>
    </>
  );
};

export default RescueSeeker;
