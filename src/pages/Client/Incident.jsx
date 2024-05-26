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
import { useDispatch } from "react-redux";
import { reverseGeocoding } from "../../features/Goong/goongSlice";
import { formatDate } from "./HistoryProlem";

const Incident = () => {
    const accessToken = Cookies.get("accessToken");

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
        name: "",
        type: "abc",
        description: "",
        location: "",
        status: "chưa giải quyết",
    };

    const [shareRoute, setShareRoute] = useState(initFormShareRoute);
    const [startLocation, setStartLocation] = useState("");
    const [endLocation, setEndLocation] = useState("");
    const [data, setData] = useState([]);
    const [dataRout, setDataRout] = useState([]);
    const [routeError, setRouteError] = useState({});

    const isValue = (value) => {
        return !value || value.trim().length < 2;
    };

    const isValidName = (name) => {
        const regex =
            /^[a-zA-Z\sàáãạảăắằẳẵặâấầẩẫậèéẽẹẻêềếểễệđìíĩịỉòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỹỷỵÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẼẸẺÊỀẾỂỄỆĐÌÍĨỊỈÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỸỶỴ]+$/;
        return regex.test(name);
    };

    const isValidAddress = (address) => {
        const regex =
            /^[a-zA-Z0-9\sàáạãảăắằặẵẳâấầậẫẩèéẹẽẻêếềệễểìíịĩỉòóọõỏôốồộỗổơớờợỡởùúụũủưứừựữửỳýỵỹỷđÀÁẠÃẢĂẮẰẶẴẲÂẤẦẬẪẨÈÉẸẼẺÊẾỀỆỄỂÌÍỊĨỈÒÓỌÕỎÔỐỒỘỖỔƠỚỜỢỠỞÙÚỤŨỦƯỨỪỰỮỬỲÝỴỸỶĐ]*$/;
        return regex.test(address);
    };

    const validateFormRoute = () => {
        const error = {};

        if (isValue(shareRoute.name)) {
            error["name"] = "Vui lòng nhập sự cố";
        } else if (!isValidName(shareRoute.name)) {
            error["name"] = "Vui lòng không nhập ký tự đặc biệt hoặc số";
        }

        if (shareRoute.location.length < 2) {
            error["location"] = "Vui lòng nhập địa chỉ";
        } else if (
            !/^\d+\s+[a-zA-ZàáạãảăắằặẵẳâấầậẫẩèéẹẽẻêếềệễểìíịĩỉòóọõỏôốồộỗổơớờợỡởùúụũủưứừựữửỳýỵỹỷđÀÁẠÃẢĂẮẰẶẴẲÂẤẦẬẪẨÈÉẸẼẺÊẾỀỆỄỂÌÍỊĨỈÒÓỌÕỎÔỐỒỘỖỔƠỚỜỢỠỞÙÚỤŨỦƯỨỪỰỮỬỲÝỴỸỶĐ]+\s*[a-zA-Z0-9\sàáạãảăắằặẵẳâấầậẫẩèéẹẽẻêếềệễểìíịĩỉòóọõỏôốồộỗổơớờợỡởùúụũủưứừựữửỳýỵỹỷđÀÁẠÃẢĂẮẰẶẴẲÂẤẦẬẪẨÈÉẸẼẺÊẾỀỆỄỂÌÍỊĨỈÒÓỌÕỎÔỐỒỘỖỔƠỚỜỢỠỞÙÚỤŨỦƯỨỪỰỮỬỲÝỴỸỶĐ]*$/.test(
                shareRoute.location
            )
        ) {
            error["location"] = "Vui lòng nhập địa chỉ đầy đủ";
        } else if (!isValidAddress(shareRoute.location)) {
            error["location"] = "Vui lòng không nhập ký tự đặc biệt";
        }

        if (isValue(shareRoute.description)) {
            error["description"] = "Vui lòng mô tả sự cố";
        }
        setRouteError(error);

        return Object.keys(error).length === 0;
    };

    useEffect(() => {
        dataIncident();
    }, []);

    const handleMaps = async () => {
        try {
            const hashtags = { startLocation, endLocation };

            if (startLocation === "" || endLocation === "") {
                message.warning("Bạn cần nhập điểm bắt đầu và điểm đến");
            } else {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (validateFormRoute()) {
                await axios.post(
                    "http://localhost:5000/api/incident/shareIncident",
                    shareRoute,
                    token
                );

                dataIncident();
                setShareRoute(initFormShareRoute);
                message.success("Chia sẻ thành công");
            }
        } catch (e) {
            message.error(
                "Bạn chưa đăng nhập hoặc chưa điền thông tin vào form"
            );
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
                                          {item.user_name}
                                      </h4>
                                      <span>{formatDate(item.created_at)}</span>
                                      <p className="problem-decs">
                                          <strong>
                                              Tuyến đường gặp sự cố:
                                          </strong>{" "}
                                          {item.location}
                                      </p>
                                      <p className="problem-decs">
                                          <strong>Loại sự cố:</strong>{" "}
                                          {item.name}
                                      </p>
                                      <p className="problem-decs">
                                          <strong>Trạng thái:</strong>{" "}
                                          {item.status}
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
                                          {item.user_name}
                                      </h4>
                                      <span>{formatDate(item.created_at)}</span>
                                      <p className="problem-decs">
                                          <strong>
                                              Tuyến đường gặp sự cố:
                                          </strong>{" "}
                                          {item.location}
                                      </p>
                                      <p className="problem-decs">
                                          <strong>Loại sự cố:</strong>{" "}
                                          {item.name}
                                      </p>
                                      <p className="problem-decs">
                                          <strong>Trạng thái:</strong>{" "}
                                          {item.status}
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
                                    Sự cố
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="VD: Tắc đường, ..."
                                    value={shareRoute.name}
                                    onChange={handleChange}
                                    id="form-address"
                                    className="form-input"
                                />
                                {routeError.name && (
                                    <span className="route-error">
                                        {routeError.name}
                                    </span>
                                )}
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
                                    placeholder="VD: 100 Nguyễn Văn Linh"
                                    value={shareRoute.location}
                                    onChange={handleChange}
                                    id="form-address"
                                    className="form-input"
                                />
                                {routeError.location && (
                                    <span className="route-error">
                                        {routeError.location}
                                    </span>
                                )}
                            </div>
                            <div className="right-form">
                                <label
                                    className="form-title"
                                    htmlFor="form-type"
                                >
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
                                {routeError.description && (
                                    <span className="route-error">
                                        {routeError.description}
                                    </span>
                                )}
                            </div>
                            <div className="right-btn">
                                <Button>Chia sẻ</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Incident;
