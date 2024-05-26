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
    Radio,
} from "antd";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import { UploadOutlined, EditOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { geocoding, reverseGeocoding } from "../../features/Goong/goongSlice";
import {
    addNaturalDisasterVersion1,
    addNaturalDisasterVersion2,
    editNaturalDisasterPriority,
} from "../../features/NaturalDisaster/naturalDisastersSlice";
import {
    addProblemVersion1,
    addProblemVersion2,
    editProblemPriority,
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
    // Task 1
    const [isModalOpenEditRescueNeeded, setIsModalOpenEditRescueNeeded] =
        useState(false);
    const [updatePriority, setUpdatePriority] = useState(false);
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
    // Task 5
    // useEffect(() => {
    //   if (userInfo?.role === "ROLE_RESCUER") {
    //     dispatch(clearUserInfo());
    //     Cookies.remove("accessToken");
    //     Cookies.remove("refreshToken");
    //     navigate("/login");
    //   }
    // }, [dispatch, userInfo?.role, navigate]);

    // Event Handlers
    // Task 1
    const showModalEditRescueNeeded = (item) => {
        setIsModalOpenEditRescueNeeded(true);
        setSelectedRescueNeeded(item);
        if (item.disaster_type) {
            setEmergencyType("Thiên tai");
        } else {
            setEmergencyType("Sự cố");
        }
    };
    const handleCancelEditRescueNeeded = () => {
        setIsModalOpenEditRescueNeeded(false);
    };

    const handleChangeType = (value) => {
        setEmergencyType(value);
    };

    // Task 1
    const onSubmitEditRescueNeeded = async (data) => {
        try {
            setLoading(true);

            const { naturalDisasterName, priority } = data;
            const { disaster_id, problem_id } = selectedRescueNeeded || {};

            if (naturalDisasterName !== undefined) {
                await dispatch(
                    editNaturalDisasterPriority({
                        naturalDisasterId: disaster_id,
                        priority,
                    })
                );
            } else {
                await dispatch(
                    editProblemPriority({ problemId: problem_id, priority })
                );
            }

            await dispatch(getAllRescueNeeded());
            setLoading(false);
            setIsModalOpenEditRescueNeeded(false);
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
                        console.error(
                            "Lỗi khi thực hiện reverse geocoding:",
                            error
                        );
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

    // Task 1
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

    // =========================================================
    const accessToken = Cookies.get("accessToken");
    const token = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    };
    const [selectedOption, setSelectedOption] = useState("related");
    const [expertise, setExpertise] = useState([]);
    const [helpMe, setHelpMe] = useState([]);

    useEffect(() => {
        dataRescuer();
    }, [selectedOption]);

    const dataRescuer = async () => {
        try {
            if (selectedOption === "related") {
                const res = await axios.get(
                    "http://localhost:5000/api/expertise/related",
                    token
                );

                const problems = res.data.problems;
                const naturalDisasters = res.data.natural_disasters;
                const incidents = res.data.incidents;

                const combinedData = [
                    ...problems,
                    ...naturalDisasters,
                    ...incidents,
                ];

                setExpertise(combinedData);
            } else if (selectedOption === "userRproblem") {
                const res = await axios.get(
                    "http://localhost:5000/api/expertise/userRproblem",
                    token
                );
                setHelpMe(res.data.relatedUsers);
            }
        } catch (e) {
            console.log(e);
        }
    };
    // =========================================================

    return (
        <>
            <Breadcrumb
                style={{
                    margin: "20px 0",
                }}
            >
                <Breadcrumb.Item></Breadcrumb.Item>
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
                                    borderBottom:
                                        "1px solid rgba(5, 5, 5, 0.06)",
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
                            {/* Task 1 */}
                            <Menu
                                mode="inline"
                                style={{ height: "450px", overflowY: "auto" }}
                            >
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
                                            {/* Edit button */}
                                            {item?.id === userInfo?.id && (
                                                <Button
                                                    type="ghost"
                                                    size="small"
                                                    icon={<EditOutlined />}
                                                    onClick={() =>
                                                        showModalEditRescueNeeded(
                                                            item
                                                        )
                                                    }
                                                    style={{
                                                        position: "absolute",
                                                        top: "6px",
                                                        right: "6px",
                                                        zIndex: "999",
                                                    }}
                                                />
                                            )}

                                            <Col span={4}>
                                                <Avatar
                                                    src={item.avatar}
                                                    size={40}
                                                />
                                            </Col>
                                            <Col span={20}>
                                                <Text
                                                    style={{
                                                        display: "block",
                                                        marginBottom: "5px",
                                                    }}
                                                >
                                                    {item.name}
                                                </Text>
                                                <Text
                                                    type="secondary"
                                                    style={{
                                                        display: "block",
                                                        fontSize: "13px",
                                                    }}
                                                >
                                                    Số điện thoại: {item.phone}
                                                </Text>
                                                <Text
                                                    type="secondary"
                                                    style={{
                                                        display: "block",
                                                        fontSize: "13px",
                                                    }}
                                                >
                                                    Kiểu gặp nạn:{" "}
                                                    {item.disaster_name ||
                                                        item.problem_name}
                                                </Text>
                                                <Text
                                                    type="secondary"
                                                    style={{
                                                        display: "block",
                                                        fontSize: "13px",
                                                    }}
                                                >
                                                    Địa chỉ: {item.address}
                                                </Text>
                                                <Text
                                                    type="secondary"
                                                    style={{
                                                        display: "block",
                                                        fontSize: "13px",
                                                    }}
                                                >
                                                    Trạng thái:{" "}
                                                    {item.disaster_status ||
                                                        item.problem_status}
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
                                                                item.disaster_priority ===
                                                                    "Khẩn cấp" ||
                                                                item.problem_priority ===
                                                                    "Khẩn cấp"
                                                                    ? "red"
                                                                    : item.disaster_priority ===
                                                                          "Trung bình" ||
                                                                      item.problem_priority ===
                                                                          "Trung bình"
                                                                    ? "green"
                                                                    : "inherit",
                                                        }}
                                                    >
                                                        {item.disaster_priority ||
                                                            item.problem_priority}
                                                    </Text>
                                                </Text>
                                            </Col>
                                        </Row>
                                    </Menu.Item>
                                ))}
                            </Menu>
                        </Col>

                        {/* Task 1 */}
                        <Modal
                            title={
                                <div style={{ textAlign: "center" }}>
                                    Thông tin người cần cứu hộ
                                </div>
                            }
                            open={isModalOpenEditRescueNeeded}
                            onCancel={handleCancelEditRescueNeeded}
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
                                    defaultValue={
                                        selectedRescueNeeded?.name || ""
                                    }
                                    render={({ field }) => (
                                        <Form.Item
                                            label="Họ và tên"
                                            validateStatus={
                                                errors.name ? "error" : ""
                                            }
                                            help={
                                                errors.name
                                                    ? errors.name.message
                                                    : ""
                                            }
                                        >
                                            <Input
                                                {...field}
                                                readOnly
                                                placeholder="Nhập họ và tên"
                                            />
                                        </Form.Item>
                                    )}
                                />

                                <Controller
                                    name="phone"
                                    control={control}
                                    defaultValue={
                                        selectedRescueNeeded?.phone || ""
                                    }
                                    render={({ field }) => (
                                        <Form.Item
                                            label="Số điện thoại"
                                            validateStatus={
                                                errors.phone ? "error" : ""
                                            }
                                            help={
                                                errors.phone
                                                    ? errors.phone.message
                                                    : ""
                                            }
                                        >
                                            <Input
                                                {...field}
                                                readOnly
                                                placeholder="Nhập số điện thoại"
                                            />
                                        </Form.Item>
                                    )}
                                />

                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Item
                                            label="Kiểu gặp nạn"
                                            validateStatus={
                                                errors.type ? "error" : ""
                                            }
                                            help={
                                                errors.type
                                                    ? errors.type.message
                                                    : ""
                                            }
                                        >
                                            <Select
                                                placeholder="Vui lòng chọn kiểu gặp nạn"
                                                defaultValue={emergencyType}
                                                onChange={handleChangeType}
                                                disabled
                                            >
                                                <Option value="Thiên tai">
                                                    Thiên tai
                                                </Option>
                                                <Option value="Sự cố">
                                                    Sự cố
                                                </Option>
                                            </Select>
                                        </Form.Item>
                                    )}
                                />

                                {emergencyType === "Thiên tai" && (
                                    <>
                                        <Controller
                                            name="naturalDisasterName"
                                            control={control}
                                            defaultValue={
                                                selectedRescueNeeded?.disaster_name ||
                                                ""
                                            }
                                            render={({ field }) => (
                                                <Form.Item
                                                    label="Tên thiên tai"
                                                    validateStatus={
                                                        errors.naturalDisasterName
                                                            ? "error"
                                                            : ""
                                                    }
                                                    help={
                                                        errors.naturalDisasterName
                                                            ? errors
                                                                  .naturalDisasterName
                                                                  .message
                                                            : ""
                                                    }
                                                >
                                                    <Input
                                                        {...field}
                                                        readOnly
                                                        placeholder="Nhập tên thiên tai"
                                                    />
                                                </Form.Item>
                                            )}
                                        />

                                        <Controller
                                            name="naturalDisasterType"
                                            control={control}
                                            defaultValue={
                                                selectedRescueNeeded?.disaster_type ||
                                                ""
                                            }
                                            render={({ field }) => (
                                                <Form.Item
                                                    label="Loại thiên tai"
                                                    validateStatus={
                                                        errors.naturalDisasterType
                                                            ? "error"
                                                            : ""
                                                    }
                                                    help={
                                                        errors.naturalDisasterType
                                                            ? errors
                                                                  .naturalDisasterType
                                                                  .message
                                                            : ""
                                                    }
                                                >
                                                    <Input
                                                        {...field}
                                                        readOnly
                                                        placeholder="Nhập loại thiên tai"
                                                    />
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
                                            defaultValue={
                                                selectedRescueNeeded?.problem_name ||
                                                ""
                                            }
                                            render={({ field }) => (
                                                <Form.Item
                                                    label="Tên sự cố"
                                                    validateStatus={
                                                        errors.incidentName
                                                            ? "error"
                                                            : ""
                                                    }
                                                    help={
                                                        errors.incidentName
                                                            ? errors
                                                                  .incidentName
                                                                  .message
                                                            : ""
                                                    }
                                                >
                                                    <Input
                                                        {...field}
                                                        readOnly
                                                        placeholder="Nhập tên sự cố"
                                                    />
                                                </Form.Item>
                                            )}
                                        />

                                        <Controller
                                            name="incidentType"
                                            control={control}
                                            defaultValue={
                                                selectedRescueNeeded?.problem_type ||
                                                ""
                                            }
                                            render={({ field }) => (
                                                <Form.Item
                                                    label="Loại sự cố"
                                                    validateStatus={
                                                        errors.incidentType
                                                            ? "error"
                                                            : ""
                                                    }
                                                    help={
                                                        errors.incidentType
                                                            ? errors
                                                                  .incidentType
                                                                  .message
                                                            : ""
                                                    }
                                                >
                                                    <Input
                                                        {...field}
                                                        readOnly
                                                        placeholder="Nhập loại sự cố"
                                                    />
                                                </Form.Item>
                                            )}
                                        />
                                    </>
                                )}

                                <Controller
                                    name="address"
                                    control={control}
                                    defaultValue={
                                        selectedRescueNeeded?.address || ""
                                    }
                                    render={({ field }) => (
                                        <Form.Item
                                            label="Địa chỉ"
                                            validateStatus={
                                                errors.address ? "error" : ""
                                            }
                                            help={
                                                errors.address
                                                    ? errors.address.message
                                                    : ""
                                            }
                                        >
                                            <Input
                                                {...field}
                                                readOnly
                                                placeholder="Nhập địa chỉ"
                                                // value={valueAddress} // Đặt giá trị của input "address"
                                                onChange={(e) =>
                                                    setValueAddress(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </Form.Item>
                                    )}
                                />

                                {/* Task 1 */}
                                <Controller
                                    name="priority"
                                    control={control}
                                    defaultValue={
                                        selectedRescueNeeded?.disaster_priority ||
                                        selectedRescueNeeded?.problem_priority
                                    }
                                    render={({
                                        field,
                                        fieldState: { error },
                                    }) => (
                                        <>
                                            <Form.Item
                                                label="Độ ưu tiên"
                                                validateStatus={
                                                    error ? "error" : ""
                                                }
                                                help={error?.message}
                                            >
                                                <Radio.Group {...field}>
                                                    <Radio
                                                        value="Khẩn cấp"
                                                        style={{ color: "red" }}
                                                    >
                                                        Khẩn cấp
                                                    </Radio>
                                                    <Radio
                                                        value="Trung bình"
                                                        style={{
                                                            color: "green",
                                                        }}
                                                    >
                                                        Trung bình
                                                    </Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                        </>
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
                                <Button disabled onClick={getCurrentPosition}>
                                    Vị trí hiện tại
                                </Button>
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
                                    <Button disabled icon={<UploadOutlined />}>
                                        Thêm hình ảnh
                                    </Button>
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
                                <Button onClick={handleCancelEditRescueNeeded}>
                                    Trở về
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={handleSubmit(
                                        onSubmitEditRescueNeeded
                                    )}
                                    loading={loading}
                                >
                                    {loading ? "Đang gửi..." : "Cập nhật"}
                                </Button>
                            </Row>
                        </Modal>

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
                            <div
                                id="map"
                                style={{ width: "100%", height: "100%" }}
                            ></div>
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
                                    borderBottom:
                                        "1px solid rgba(5, 5, 5, 0.06)",
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
                                    Gợi ý cứu hộ
                                </Typography.Title>
                            </Col>
                            <Col>
                                <div className="problem-right">
                                    <div className="select-status">
                                        <select
                                            id="form-type"
                                            className="form-input"
                                            name="status"
                                            value={selectedOption}
                                            onChange={(e) =>
                                                setSelectedOption(
                                                    e.target.value
                                                )
                                            }
                                            style={{
                                                fontSize: "16px",
                                                padding: "10px",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <option value="related">
                                                Những người bạn có thể giúp
                                            </option>
                                            <option value="userRproblem">
                                                Những người có thể giúp bạn
                                            </option>
                                        </select>
                                    </div>

                                    <div
                                        className="rescuer"
                                        style={{
                                            height: "380px",
                                            overflow: "auto",
                                        }}
                                    >
                                        {selectedOption === "related"
                                            ? expertise.length > 0 &&
                                              expertise.map((item) => (
                                                  <div
                                                      key={item.id}
                                                      style={{
                                                          display: "flex",
                                                          padding: "14px",
                                                          marginBottom: "10px",
                                                          borderRadius: "10px",
                                                          backgroundColor:
                                                              "#fff",
                                                          borderBottom:
                                                              "1px solid #ccc",
                                                      }}
                                                  >
                                                      <span
                                                          style={{
                                                              minWidth: "40px",
                                                              height: "40px",
                                                              display: "flex",
                                                              alignItems:
                                                                  "center",
                                                              justifyContent:
                                                                  "center",
                                                              borderRadius:
                                                                  "50%",
                                                              marginRight:
                                                                  "6px",
                                                              backgroundColor:
                                                                  "#f1f1f1",
                                                          }}
                                                      >
                                                          <PersonOutlineOutlinedIcon
                                                              style={{
                                                                  fontSize:
                                                                      "26px",
                                                              }}
                                                          />
                                                      </span>
                                                      <div className="problem-content">
                                                          <h4
                                                              style={{
                                                                  lineHeight:
                                                                      "22px",
                                                              }}
                                                          >
                                                              {item.user_name}
                                                          </h4>
                                                          <p>
                                                              <strong>
                                                                  Địa chỉ:
                                                              </strong>{" "}
                                                              {
                                                                  item.user_address
                                                              }
                                                          </p>
                                                          <p>
                                                              <strong>
                                                                  SĐT:
                                                              </strong>{" "}
                                                              {item.user_phone}
                                                          </p>
                                                          <p>
                                                              <strong>
                                                                  Sự cố
                                                              </strong>{" "}
                                                              {item.name}
                                                          </p>
                                                      </div>
                                                  </div>
                                              ))
                                            : helpMe.length > 0 &&
                                              helpMe.map((item) => (
                                                  <div
                                                      key={item.id}
                                                      style={{
                                                          display: "flex",
                                                          padding: "14px",
                                                          marginBottom: "10px",
                                                          borderRadius: "10px",
                                                          backgroundColor:
                                                              "#fff",
                                                          borderBottom:
                                                              "1px solid #ccc",
                                                      }}
                                                  >
                                                      <span
                                                          style={{
                                                              minWidth: "40px",
                                                              height: "40px",
                                                              display: "flex",
                                                              alignItems:
                                                                  "center",
                                                              justifyContent:
                                                                  "center",
                                                              borderRadius:
                                                                  "50%",
                                                              marginRight:
                                                                  "6px",
                                                              backgroundColor:
                                                                  "#f1f1f1",
                                                          }}
                                                      >
                                                          <PersonOutlineOutlinedIcon
                                                              style={{
                                                                  fontSize:
                                                                      "26px",
                                                              }}
                                                          />
                                                      </span>
                                                      <div className="problem-content">
                                                          <h4
                                                              style={{
                                                                  lineHeight:
                                                                      "22px",
                                                              }}
                                                          >
                                                              {item.user_name}
                                                          </h4>
                                                          <p>
                                                              <strong>
                                                                  Địa chỉ:
                                                              </strong>{" "}
                                                              {
                                                                  item.user_address
                                                              }
                                                          </p>
                                                          <p>
                                                              <strong>
                                                                  SĐT:
                                                              </strong>{" "}
                                                              {item.user_phone}
                                                          </p>
                                                          <p>
                                                              <strong>
                                                                  sở trường
                                                              </strong>{" "}
                                                              {item.specialty}
                                                          </p>
                                                      </div>
                                                  </div>
                                              ))}
                                    </div>
                                </div>
                            </Col>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default Home;
