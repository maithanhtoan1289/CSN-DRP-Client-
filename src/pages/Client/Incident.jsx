import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import goongjs from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";
import axios from "axios";
import Cookies from "js-cookie";
import { message } from "antd";
import "../sass/incident.scss";
import Button from "../Client/Button";
import { GOONG_MAP_KEY } from "../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { reverseGeocoding } from "../../features/Goong/goongSlice";

const Incident = () => {
    const accessToken = Cookies.get("accessToken");
    const userInfo = useSelector((state) => state?.user?.userInfo);

    const token = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    };

    //render maps
    useEffect(() => {
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
    }, []);

    let initFormShareRoute = {
        name: userInfo ? userInfo.name : "",
        type: "",
        description: "",
        location: "",
        status: "chưa giải quyết",
    };

    const [shareRoute, setShareRoute] = useState(initFormShareRoute);
    const [startLocation, setStartLocation] = useState("");
    const [endLocation, setEndLocation] = useState("");
    const [data, setData] = useState([]);
    const [dataRout, setDataRout] = useState([]);
    const [expertise, setExpertise] = useState([]);
    const [rescuer, setRescuer] = useState({ specialty: "", description: "" });

    useEffect(() => {
        dataIncident();
        dataRescuer();
    }, []);

    const handleMaps = async () => {
        const hashtags = { startLocation, endLocation };
        if (startLocation === "" || endLocation === "") {
            alert("Bạn cần nhập điểm bắt đầu và điểm đến");
        }

        try {
            const res = await axios.post(
                "http://localhost:5000/api/incident/find",
                hashtags,
                token
            );
            setDataRout(res.data.data);
            const checkProblem = res.data.data.length;
            if (checkProblem > 0) {
                message.warning("Tuyến đường này đang gặp sự cố");
            } else {
                message.success("tuyến đường này không gặp sự cố");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const dataIncident = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/incident/getIncident",
                token
            );
            const slicedData = res.data.data.slice(0, 6);
            setData(slicedData);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        const { value, name } = e.target;

        setShareRoute({
            ...shareRoute,
            [name]: value,
        });
    };

    const handleChangeSpecialty = (e) => {
        const { value, name } = e.target;
        setRescuer({
            ...rescuer,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "http://localhost:5000/api/incident/shareIncident",
                shareRoute,
                token
            );

            dataIncident();
            setShareRoute(initFormShareRoute);
            message.success("Chia sẻ thành công");
        } catch (e) {
            message.error(
                "Bạn chưa đăng nhập hoặc chưa điền thông tin vào form"
            );
        }
    };

    const dataRescuer = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/expertise/getExpertise",
                token
            );
            setExpertise(res.data.data);
        } catch (e) {
            console.log(e);
        }
    };

    const handleRescuer = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "http://localhost:5000/api/expertise/create",
                rescuer,
                token
            );
            setRescuer({ specialty: "", description: "" });
            dataRescuer();
        } catch (e) {
            console.log(e);
        }
    };

    const dispatch = useDispatch();
    const [valueAddress, setValueAddress] = useState("");

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
                <div className="incident_map">
                    <div id="problem-map" className="problem-map"></div>
                    <div className="problem-form">
                        <div className="from-address">
                            <input
                                className="from-input"
                                type="text"
                                name="from"
                                value={startLocation}
                                onChange={(e) =>
                                    setStartLocation(e.target.value)
                                }
                                placeholder="Điểm bắt đầu"
                            />
                            <input
                                className="from-input"
                                type="text"
                                name="to"
                                value={endLocation}
                                onChange={(e) => setEndLocation(e.target.value)}
                                placeholder="Điểm đến..."
                            />
                        </div>
                        <div className="problem-button">
                            <Button onClick={handleMaps}>Đường đi</Button>
                            <MyLocationOutlinedIcon className="problem-form__icon" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="incident-form">
                <div className="incident-form-left">
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
                                Tên
                            </label>
                            <input
                                disabled
                                style={{ cursor: "no-drop" }}
                                type="text"
                                name="name"
                                value={shareRoute.name}
                                onChange={handleChange}
                                id="form-address"
                                className="form-input"
                            />
                        </div>
                        <div className="right-form">
                            <label
                                className="form-title"
                                htmlFor="form-address"
                            >
                                Địa chỉ gặp sự cố
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={shareRoute.location}
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
                                name="type"
                                value={shareRoute.type}
                                onChange={handleChange}
                                id="form-type"
                                className="form-input"
                            />
                        </div>
                        <div className="right-form">
                            <label className="form-title" htmlFor="form-type">
                                Trạng thái
                            </label>
                            <select
                                id="form-type"
                                className="form-input"
                                name="status"
                                value={shareRoute.status}
                                onChange={handleChange}
                            >
                                <option value="chưa giải quyết">
                                    chưa giải quyết
                                </option>
                                <option value="đã giải quyết">
                                    đã giải quyết
                                </option>
                            </select>
                        </div>
                        <div className="right-form">
                            <label
                                className="form-title"
                                htmlFor="form-content"
                            >
                                Nội dung sự cố
                            </label>
                            <textarea
                                name="description"
                                value={shareRoute.description}
                                onChange={handleChange}
                                id="form-content"
                                className="form-input"
                                placeholder="VD: tuyến đường ... đang gặp sự cố ..."
                            ></textarea>
                        </div>
                        <div className="right-btn">
                            {/* <Button onClick={getCurrentPosition}>
                                Lấy vị trí hiện tại
                            </Button> */}
                            <Button>Chia sẻ</Button>
                        </div>
                    </form>
                </div>

                <div className="incident-form-right">
                    <h3 className="right-title">Sở trường của bạn là gì?</h3>
                    <form
                        action=""
                        className="problem-right__form"
                        onSubmit={handleRescuer}
                    >
                        <div className="right-form">
                            <label
                                className="form-title"
                                htmlFor="form-address"
                            >
                                Chuyên môn
                            </label>
                            <input
                                type="text"
                                name="specialty"
                                value={rescuer.specialty}
                                onChange={handleChangeSpecialty}
                                id="form-address"
                                className="form-input"
                                placeholder="VD: Bơi lội, sửa xe..."
                            />
                        </div>
                        <div className="right-form">
                            <label className="form-title" htmlFor="form-type">
                                Mô tả
                            </label>
                            <textarea
                                name="description"
                                value={rescuer.description}
                                onChange={handleChangeSpecialty}
                                id="form-content"
                                className="form-input"
                            ></textarea>
                        </div>
                        <div className="right-btn">
                            <Button>Gửi</Button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="problem-share">
                <div className="problem-left">
                    <h2 className="problem-left-heading">
                        Danh sách sự cố tuyến đường
                    </h2>
                    {dataRout.length > 0 && dataRout
                        ? dataRout.map((item) => (
                              <div
                                  className="problem-left__wrapp"
                                  key={item.id}
                              >
                                  <span className="problem-avarta">
                                      <PersonOutlineOutlinedIcon className="avarta-icon" />
                                  </span>
                                  <div className="problem-content">
                                      <h4 className="problem-name">
                                          {item.name}
                                      </h4>
                                      <p className="problem-decs">
                                          <strong>
                                              Tuyến đường gặp sự cố:
                                          </strong>{" "}
                                          {item.location}
                                      </p>
                                      <p className="problem-decs">
                                          <strong>Loại sự cố:</strong>{" "}
                                          {item.type}
                                      </p>
                                      <p className="problem-decs">
                                          <strong>Mô tả sự cố:</strong>{" "}
                                          {item.description}
                                      </p>
                                  </div>
                              </div>
                          ))
                        : data.map((item) => (
                              <div
                                  className="problem-left__wrapp"
                                  key={item.id}
                              >
                                  <span className="problem-avarta">
                                      <PersonOutlineOutlinedIcon className="avarta-icon" />
                                  </span>
                                  <div className="problem-content">
                                      <h4 className="problem-name">
                                          {item.name}
                                      </h4>
                                      <span>{item.updated_at}</span>
                                      <p className="problem-decs">
                                          <strong>
                                              Tuyến đường gặp sự cố:
                                          </strong>{" "}
                                          {item.location}
                                      </p>
                                      <p className="problem-decs">
                                          <strong>Loại sự cố:</strong>{" "}
                                          {item.type}
                                      </p>
                                      <p className="problem-decs">
                                          <strong>Mô tả sự cố:</strong>{" "}
                                          {item.description}
                                      </p>
                                  </div>
                              </div>
                          ))}
                </div>

                <div className="problem-right">
                    <h2 className="problem-left-heading">
                        Danh sách người cứu hộ
                    </h2>
                    <div className="rescuer">
                        {expertise.length > 0 ? (
                            expertise.map((item) => (
                                <div
                                    className="problem-left__wrapp"
                                    key={item.id}
                                >
                                    <span className="problem-avarta">
                                        <PersonOutlineOutlinedIcon className="avarta-icon" />
                                    </span>
                                    <div className="problem-content">
                                        <h4 className="problem-name">
                                            {userInfo.name}
                                        </h4>
                                        <p className="problem-decs">
                                            <strong>Chuyên môn:</strong>{" "}
                                            {item.specialty}
                                        </p>
                                        <p className="problem-decs">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="problem-left__wrapp">
                                <p className="problem-decs">
                                    Danh sách không có người cứu hộ
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Incident;
