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
    const [expertise, setExpertise] = useState([]);
    const [selectedOption, setSelectedOption] = useState("related");
    const [routeError, setRouteError] = useState({});
    const [helpMe, setHelpMe] = useState([]);

    const isValue = (value) => {
        return !value || value.trim().length < 1;
    };

    const validateFormRoute = () => {
        const error = {};

        if (isValue(shareRoute.location)) {
            error["location"] = "Vui lòng nhập địa chỉ";
        }
        if (isValue(shareRoute.description)) {
            error["description"] = "Vui lòng mô tả sự cố";
        }
        setRouteError(error);

        return Object.keys(error).length === 0;
    };

    useEffect(() => {
        dataIncident();
        dataRescuer();
    }, [selectedOption]);

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
                            {routeError.location && (
                                <span className="route-error">
                                    {routeError.location}
                                </span>
                            )}
                        </div>
                        {/* <div className="right-form">
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
                            {routeError.type && (
                                <span className="route-error">
                                    {routeError.type}
                                </span>
                            )}
                        </div> */}
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
                            {routeError.description && (
                                <span className="route-error">
                                    {routeError.description}
                                </span>
                            )}
                        </div>
                        <div className="right-btn">
                            {/* <Button onClick={getCurrentPosition}>
                                Lấy vị trí hiện tại
                            </Button> */}
                            <Button>Chia sẻ</Button>
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
                                          {item.user_name}
                                      </h4>
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
                                      <span>{item.updated_at}</span>
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
                                          <strong>Mô tả sự cố:</strong>{" "}
                                          {item.description}
                                      </p>
                                  </div>
                              </div>
                          ))}
                </div>

                <div className="problem-right">
                    <div className="select-status">
                        <select
                            id="form-type"
                            className="form-input"
                            name="status"
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value)}
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
                        style={{ height: "400px", overflow: "auto" }}
                    >
                        {selectedOption === "related"
                            ? expertise.length > 0 &&
                              expertise.slice(0, 7).map((item) => (
                                  <div
                                      key={item.id}
                                      style={{
                                          display: "flex",
                                          padding: "12px",
                                          marginBottom: "14px",
                                          borderRadius: "10px",
                                          backgroundColor: "#fff",
                                      }}
                                  >
                                      <span
                                          style={{
                                              minWidth: "40px",
                                              height: "40px",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              borderRadius: "50%",
                                              marginRight: "6px",
                                              backgroundColor: "#f1f1f1",
                                          }}
                                      >
                                          <PersonOutlineOutlinedIcon
                                              style={{ fontSize: "2.6rem" }}
                                          />
                                      </span>
                                      <div className="problem-content">
                                          <h4 className="problem-name">
                                              {item.user_name}
                                          </h4>
                                          <p>
                                              <strong>Địa chỉ:</strong>{" "}
                                              {item.user_address}
                                          </p>
                                          <p>
                                              <strong>SĐT:</strong>{" "}
                                              {item.user_phone}
                                          </p>
                                          <p>
                                              <strong>Sự cố</strong> {item.name}
                                          </p>
                                      </div>
                                  </div>
                              ))
                            : helpMe.length > 0 &&
                              helpMe.slice(0, 7).map((item) => (
                                  <div
                                      key={item.id}
                                      style={{
                                          display: "flex",
                                          padding: "12px",
                                          marginBottom: "14px",
                                          borderRadius: "10px",
                                          backgroundColor: "#fff",
                                      }}
                                  >
                                      <span
                                          style={{
                                              minWidth: "40px",
                                              height: "40px",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              borderRadius: "50%",
                                              marginRight: "6px",
                                              backgroundColor: "#f1f1f1",
                                          }}
                                      >
                                          <PersonOutlineOutlinedIcon
                                              style={{ fontSize: "2.6rem" }}
                                          />
                                      </span>
                                      <div className="problem-content">
                                          <h4 className="problem-name">
                                              {item.user_name}
                                          </h4>
                                          <p>
                                              <strong>Địa chỉ:</strong>{" "}
                                              {item.user_address}
                                          </p>
                                          <p>
                                              <strong>SĐT:</strong>{" "}
                                              {item.user_phone}
                                          </p>
                                          <p>
                                              <strong>sở trường</strong>{" "}
                                              {item.specialty}
                                          </p>
                                      </div>
                                  </div>
                              ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Incident;
