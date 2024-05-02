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

import "../sass/incident.scss";
import Button from "../Client/Button";
import { GOONG_MAP_KEY } from "../../constants/constants";
import { useSelector } from "react-redux";

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

    useEffect(() => {
        dataIncident();
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

            const result = res.data.data.map((item) => {
                item.hashtags.map((hashtag) => {
                    if (hashtag === endLocation) {
                        // alert(hashtag);
                    }
                });
            });

            console.log("thông báo");
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
            setData(res.data.data);
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
            alert("Chia sẻ thành công");
        } catch {
            alert("Bạn cần nhập thông tin vào form");
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
                <div id="problem-map" className="problem-map"></div>
                <div className="problem-form">
                    <div className="from-address">
                        <input
                            className="from-input"
                            type="text"
                            name="from"
                            value={startLocation}
                            onChange={(e) => setStartLocation(e.target.value)}
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

            <div className="problem-share">
                <div className="problem-left">
                    {data.slice(0, 5).map((item) => (
                        <div key={item.id}>
                            <div className="problem-left__wrapp">
                                <span className="problem-avarta">
                                    <PersonOutlineOutlinedIcon className="avarta-icon" />
                                </span>
                                <div className="problem-content">
                                    <h4 className="problem-name">
                                        {item.name}
                                    </h4>
                                    <p className="problem-decs">
                                        Tuyến đường gặp sự cố: {item.location}
                                    </p>
                                    <p className="problem-decs">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
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
                                Tên
                            </label>
                            <input
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
                            {/* <Button>Lấy tuyến đường hiện tại</Button> */}
                            <Button>Chia sẻ</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Incident;
