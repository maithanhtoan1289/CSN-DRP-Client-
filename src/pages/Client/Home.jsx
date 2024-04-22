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
import { Link } from "react-router-dom";
import goongjs from "@goongmaps/goong-js";
import { GOONG_MAP_KEY } from "../../constants/constants";
import { addImage } from "../../features/Uploads/uploadsSlice";
import axios from "axios";

const { Option } = Select;

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
  const userInfo = useSelector((state) => state?.user?.userInfo);
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

  // useEffect add map
  useEffect(() => {
    if (isLogin && hasCoordinates) {
      goongjs.accessToken = GOONG_MAP_KEY;
      const map = new goongjs.Map({
        container: "map",
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: markerPosition,
        zoom: 9,
      });

      const marker = new goongjs.Marker({ color: "red" })
        .setLngLat(markerPosition)
        .addTo(map);

      return () => {
        map.remove();
        marker.remove();
      };
    }
  }, [markerPosition, coordinates, hasCoordinates, isLogin]);

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
          {showDanger && !showMap && (
            <Row
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Col
                span={24}
                style={{
                  height: "100%",
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  src="https://cdni.iconscout.com/illustration/premium/thumb/sos-message-emergency-9272237-7558474.png?f=webp"
                  preview={false}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </Col>
            </Row>
          )}

          <Row
            style={{
              height: "auto",
              background: borderRadiusLG,
            }}
          >
            {showDanger && !showMap && (
              <>
                {successMessage && username && password && (
                  <Col
                    span={24}
                    style={{
                      height: "auto",
                      background: "#fff",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Col
                      span={22}
                      style={{
                        height: "auto",
                        background: "#fff",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: "5px",
                        margin: "10px 0",
                      }}
                    >
                      <Typography.Text
                        type="success"
                        style={{
                          textAlign: "center",
                        }}
                      >
                        {successMessage}
                      </Typography.Text>

                      <>
                        <Typography.Text>Tài khoản: {username}</Typography.Text>
                        <Typography.Text>Mật khẩu: {password}</Typography.Text>
                      </>

                      <Button type="primary">
                        <Link to="/login">Đăng nhập ngay</Link>
                      </Button>
                    </Col>
                  </Col>
                )}

                {!successMessage && !username && !password && (
                  <Col
                    span={24}
                    style={{
                      background: borderRadiusLG,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <Button type="primary" onClick={showModal}>
                      Cần cứu hộ
                    </Button>
                    <Typography.Text
                      type="danger"
                      style={{
                        textAlign: "center",
                      }}
                    >
                      Nhấn vào nút 'Cần cứu hộ' để cung cấp thông tin và vị trí
                      cần cứu hộ khẩn cấp.
                    </Typography.Text>
                  </Col>
                )}
              </>
            )}
            {isLogin && showMap && (
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                style={{
                  height: "400px",
                  background: borderRadiusLG,
                }}
              >
                <div id="map" style={{ width: "100%", height: "100%" }}></div>
              </Col>
            )}
            <Modal
              title={
                <div style={{ textAlign: "center" }}>
                  Thông tin người cần cứu hộ
                </div>
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
                          validateStatus={
                            errors.naturalDisasterName ? "error" : ""
                          }
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
                          validateStatus={
                            errors.naturalDisasterType ? "error" : ""
                          }
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
                            errors.incidentName
                              ? errors.incidentName.message
                              : ""
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
                            errors.incidentType
                              ? errors.incidentType.message
                              : ""
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
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Home;
