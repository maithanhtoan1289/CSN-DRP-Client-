import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { useSelector } from "react-redux";

import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import "../sass/histotyItem.scss";
import Button from "./Button";
import { Avatar, message } from "antd";
import Menu from "./Menu";

const HistoryProblemItem = ({
    id,
    nameUser,
    location,
    type,
    description,
    dataIncident,
}) => {
    const userInfo = useSelector((state) => state?.user?.userInfo);

    const accessToken = Cookies.get("accessToken");

    const [formUpdate, setFormUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({
        name: nameUser ? nameUser : "",
        location: location ? location : "",
        type: type ? type : "",
        status: "chưa giải quyết" ? "chưa giải quyết" : "",
        description: description ? description : "",
    });

    const handleChange = (e) => {
        setUpdateData({
            ...updateData,
            [e.target.name]: e.target.value,
        });
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:5000/api/incident/${id}`,
                updateData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            message.success("Sửa bài viết thành công");
            setFormUpdate(false);
            dataIncident();
        } catch (e) {
            console.log(e);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(
                `http://localhost:5000/api/incident/delete/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            message.success("Xóa bài viết thành công");
            dataIncident();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="problem-left__wrapp">
            <span className="problem-avarta">
                {userInfo ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "20px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                            }}
                        >
                            <Avatar src={userInfo?.avatar} />
                        </div>
                    </div>
                ) : (
                    <PersonOutlineOutlinedIcon className="avarta-icon" />
                )}
            </span>
            <div className="problem-content">
                <h4 className="problem-name">{nameUser}</h4>
                <p className="problem-decs">
                    <strong>Tuyến đường gặp sự cố:</strong> {location}
                </p>
                <p className="problem-decs">
                    <strong>Loại sự cố:</strong> {type}
                </p>
                <p className="problem-decs">
                    <strong>Mô tả sự cố:</strong> {description}
                </p>
            </div>

            <Menu
                handleDelete={handleDelete}
                setFormUpdate={setFormUpdate}
                formUpdate={formUpdate}
            />

            {formUpdate && (
                <div className="form-update">
                    <form
                        action=""
                        className="problem-right__form"
                        onSubmit={handleEdit}
                    >
                        <div
                            className="form-update-icon"
                            onClick={() => setFormUpdate(!formUpdate)}
                        >
                            <CloseIcon className="icon-close" />
                        </div>
                        <h3 className="right-title">
                            Chỉnh sửa bài viết sự cố tuyến đường
                        </h3>
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
                                value={updateData.name}
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
                                value={updateData.location}
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
                                value={updateData.type}
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
                                value={updateData.status}
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
                                value={updateData.description}
                                onChange={handleChange}
                                id="form-content"
                                className="form-input"
                                placeholder="VD: tuyến đường ... đang gặp sự cố ..."
                            ></textarea>
                        </div>
                        <div className="right-btn">
                            <Button>Save</Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default HistoryProblemItem;
