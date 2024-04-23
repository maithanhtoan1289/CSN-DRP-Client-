import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import goongjs from "@goongmaps/goong-js";

import "../sass/incident.scss";
import Button from "../Client/Button";
import { GOONG_MAP_KEY, API_KEY } from "../../constants/constants";
import "@goongmaps/goong-js/dist/goong-js.css";
import { useDispatch, useSelector } from "react-redux";
import { geocoding } from "../../features/Goong/goongSlice";
import { theme } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Schema } from "yup";
import {
    addNaturalDisasterVersion1,
    addNaturalDisasterVersion2,
} from "../../features/NaturalDisaster/naturalDisastersSlice";
import {
    addProblemVersion1,
    addProblemVersion2,
} from "../../features/Problems/problemsSlice";

const Incident = () => {
    // Redux State
    // const dispatch = useDispatch();
    // const userInfo = useSelector((state) => state?.user?.userInfo);
    // const coordinates = useSelector(
    //     (state) => state?.user?.userInfo?.coordinates
    // );

    // // Constants
    // let validLat = 0;
    // let validLng = 0;

    // if (coordinates) {
    //     const coordinatesParse = JSON.parse(coordinates);
    //     validLat = parseFloat(coordinatesParse?.lat);
    //     validLng = parseFloat(coordinatesParse?.lng);
    // }

    // Ant design
    // const {
    //     token: { borderRadiusLG },
    // } = theme.useToken();

    // Hook form
    // const {
    //     control,
    //     // handleSubmit,
    //     formState: { errors },
    // } = useForm({
    //     resolver: yupResolver(Schema),
    // });

    // Local State
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [emergencyType, setEmergencyType] = useState("");
    // const [loading, setLoading] = useState(false);
    // const [successMessage, setSuccessMessage] = useState("");
    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");
    // const [markerPosition, setMarkerPosition] = useState([validLng, validLat]);
    // const [hasCoordinates, setHasCoordinates] = useState(!!coordinates);
    // const [isLogin] = useState(!!userInfo);
    // const [showMap, setShowMap] = useState(hasCoordinates);
    // const [showDanger, setShowDanger] = useState(true);

    useEffect(() => {
        // if (isLogin && hasCoordinates) {
        goongjs.accessToken = GOONG_MAP_KEY;
        const map = new goongjs.Map({
            container: "problem-map",
            style: "https://tiles.goong.io/assets/goong_map_web.json",
            center: [105.83991, 21.028],
            zoom: 9,
        });

        const marker = new goongjs.Marker({ color: "red" })
            .setLngLat([105.83991, 21.028])
            .addTo(map);

        return () => {
            map.remove();
            marker.remove();
        };
        // }
    }, []);

    // Event Handlers

    // const onSubmit = async (data) => {
    //     try {
    //         setLoading(true);

    //         // Chuyển địa chỉ sang URL
    //         const encodedAddress = encodeURIComponent(data.address);

    //         // Chuyển username sang kiểu viết liền không dấu
    //         const username = data.name
    //             .toLowerCase()
    //             .replace(/\s/g, "")
    //             .normalize("NFD")
    //             .replace(/[\u0300-\u036f]/g, "");
    //         const currentDate = new Date()
    //             .toLocaleString()
    //             .replace(/[/:, ]/g, "");

    //         // Tạo email từ username
    //         const email = username + currentDate + "@gmail.com";

    //         // Tạo data user
    //         const newData = {
    //             ...data,
    //             type: emergencyType,
    //             username: username + currentDate,
    //             email: email,
    //             role: "ROLE_USER",
    //             password: "123456",
    //         };

    //         // Delete unnecessary fields based on emergencyType
    //         if (newData.type === "Thiên tai") {
    //             delete newData.incidentName;
    //             delete newData.incidentType;
    //         } else if (newData.type === "Sự cố") {
    //             delete newData.naturalDisasterName;
    //             delete newData.naturalDisasterType;
    //         }

    //         // Get coordinates if not available
    //         let coordinates = markerPosition;

    //         // if (coordinates[0] === 0 && coordinates[1] === 0) {
    //         if (isLogin) {
    //             const response = await dispatch(geocoding(encodedAddress));
    //             coordinates = JSON.stringify(
    //                 response.payload.geometry.location
    //             );

    //             const { lng, lat } = response.payload.geometry.location;
    //             setMarkerPosition([parseFloat(lng), parseFloat(lat)]);
    //             setHasCoordinates(true);
    //             setShowDanger(false);
    //             setShowMap(true);
    //         } else {
    //             const response = await dispatch(geocoding(encodedAddress));
    //             coordinates = JSON.stringify(
    //                 response.payload.geometry.location
    //             );
    //         }

    //         // Add coordinates to newData
    //         const geometryNewData = {
    //             ...newData,
    //             coordinates: coordinates,
    //         };

    //         if (userInfo === null) {
    //             // Dispatch action based on emergencyType
    //             if (geometryNewData.type === "Thiên tai") {
    //                 const response = await dispatch(
    //                     addNaturalDisasterVersion1(geometryNewData)
    //                 );
    //                 console.log("Dispatching addNaturalDisaster v1", response);
    //             } else if (geometryNewData.type === "Sự cố") {
    //                 const response = await dispatch(
    //                     addProblemVersion1(geometryNewData)
    //                 );
    //                 console.log("Dispatching addProblem v1", response);
    //             }

    //             setSuccessMessage(
    //                 "Bạn đã gửi thông tin cứu hộ thành công.\nNhân viên cứu hộ sẽ đến trong giây lát, xin bạn hãy kiên nhẫn đợi...\nBên dưới là tài khoản và mật khẩu để bạn đăng nhập và theo dõi vị trí của mình."
    //             );
    //             setUsername(newData.username);
    //             setPassword(newData.password);
    //         } else {
    //             const userInfoData = {
    //                 ...geometryNewData,
    //                 id: userInfo.id,
    //             };

    //             delete userInfoData.username;
    //             delete userInfoData.password;
    //             delete userInfoData.role;

    //             // Dispatch action based on emergencyType
    //             if (geometryNewData.type === "Thiên tai") {
    //                 await dispatch(addNaturalDisasterVersion2(userInfoData));
    //             } else if (geometryNewData.type === "Sự cố") {
    //                 await dispatch(addProblemVersion2(userInfoData));
    //             }
    //         }

    //         setLoading(false);
    //         setIsModalOpen(false);
    //     } catch (error) {
    //         console.log(error);
    //         setLoading(false);
    //     }
    // };

    // ==========================================

    const initFormShareRoute = {
        route: "",
        problem: "",
        content: "",
    };

    const [shareRoute, setShareRoute] = useState(initFormShareRoute);

    const handleChange = (e) => {
        const { value, name } = e.target;

        setShareRoute({
            ...shareRoute,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setShareRoute({
            route: shareRoute.route,
            problem: shareRoute.problem,
            content: shareRoute.content,
        });
        console.log(shareRoute);
    };

    return (
        <div className="incident">
            <header className="problem-header">
                <Link to="/">
                    <HomeOutlinedIcon className="problem-header__icon" />
                </Link>
                <ChevronRightOutlinedIcon className="problem-header__icon" />
                <h4 className="problem-title">Trang sự cố tuyến đường</h4>
            </header>

            <div className="problem-wrapp">
                <div id="problem-map" className="problem-map"></div>
                <div className="problem-form">
                    <div className="from-address">
                        <input
                            className="from-input"
                            type="text"
                            name="from"
                            // value={markerPosition.validLat}
                            // onChange={(e) => setMarkerPosition(e.target.value)}
                            placeholder="Điểm bắt đầu"
                        />
                        <input
                            className="from-input"
                            type="text"
                            name="to"
                            // value={markerPosition.validLng}
                            placeholder="Điểm đến..."
                        />
                    </div>
                    <div className="problem-button">
                        <Button>Đường đi</Button>
                        <MyLocationOutlinedIcon className="problem-form__icon" />
                    </div>
                </div>
            </div>

            <div className="problem-share">
                <div className="problem-left">
                    <div className="problem-left__wrapp">
                        <span className="problem-avarta">
                            <PersonOutlineOutlinedIcon className="avarta-icon" />
                        </span>
                        <div className="problem-content">
                            <h4 className="problem-name">Văn A</h4>
                            <span className="problem-time">10 phút</span>
                            <p className="problem-decs">
                                Tuyến đường từ Đà Nẵng ra Huế có 1 vụ tại nạn
                                gây tắc đường.
                            </p>
                        </div>
                    </div>
                    <div className="problem-left__wrapp">
                        <span className="problem-avarta">
                            <PersonOutlineOutlinedIcon className="avarta-icon" />
                        </span>
                        <div className="problem-content">
                            <h4 className="problem-name">Văn A</h4>
                            <span className="problem-time">10 phút</span>
                            <p className="problem-decs">
                                Tuyến đường từ Đà Nẵng ra Huế có 1 vụ tại nạn
                                gây tắc đường.
                            </p>
                        </div>
                    </div>
                    <div className="problem-left__wrapp">
                        <span className="problem-avarta">
                            <PersonOutlineOutlinedIcon className="avarta-icon" />
                        </span>
                        <div className="problem-content">
                            <h4 className="problem-name">Văn A</h4>
                            <span className="problem-time">10 phút</span>
                            <p className="problem-decs">
                                Tuyến đường từ Đà Nẵng ra Huế có 1 vụ tại nạn
                                gây tắc đường.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="problem-right">
                    <h3 className="right-title">
                        Chia sẻ tuyến đường gặp sự cố
                    </h3>
                    <form
                        action=""
                        className="problem-right__form"
                        onSubmit={handleSubmit}
                    >
                        <div className="right-form">
                            <label
                                className="form-title"
                                htmlFor="form-address"
                            >
                                Tuyến đường gặp sự cố
                            </label>
                            <input
                                type="text"
                                name="route"
                                defaultValue={shareRoute.route}
                                onChange={handleChange}
                                id="form-address"
                                className="form-input"
                            />
                        </div>
                        <div className="right-form">
                            <label className="form-title" htmlFor="form-type">
                                Loại sự cố
                            </label>
                            <input
                                type="text"
                                name="problem"
                                defaultValue={shareRoute.problem}
                                onChange={handleChange}
                                id="form-type"
                                className="form-input"
                            />
                        </div>
                        <div className="right-form">
                            <label
                                className="form-title"
                                htmlFor="form-content"
                            >
                                Nội dung sự cố
                            </label>
                            <textarea
                                name="content"
                                id="form-content"
                                defaultValue={shareRoute.content}
                                onChange={handleChange}
                                className="form-input"
                            ></textarea>
                        </div>
                        <div className="right-btn">
                            <Button>Lấy tuyến đường hiện tại</Button>
                            <Button>Chia sẻ</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Incident;
