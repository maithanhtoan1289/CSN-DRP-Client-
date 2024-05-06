import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import "../sass/histotyItem.scss";
import Button from "./Button";
import { Avatar, message } from "antd";
import { useSelector } from "react-redux";
import Menu from "./Menu";

const SpecialtyItem = ({ id, specialty, description, dataSpeciality }) => {
    const userInfo = useSelector((state) => state?.user?.userInfo);
    const accessToken = Cookies.get("accessToken");

    const [formUpdate, setFormUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({
        specialty: specialty ? specialty : "",
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
                `http://localhost:5000/api/expertise/${id}`,
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
            dataSpeciality();
        } catch (e) {
            console.log(e);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(
                `http://localhost:5000/api/expertise/deleteExpertise/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            message.success("Xóa bài viết thành công");
            dataSpeciality();
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
                <h4 className="problem-name">{userInfo.name}</h4>
                <p className="problem-decs">
                    <strong>Chuyên môn:</strong> {specialty}
                </p>
                <p className="problem-decs">{description}</p>
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
                                value={updateData.specialty}
                                onChange={handleChange}
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
                                value={updateData.description}
                                onChange={handleChange}
                                id="form-content"
                                className="form-input"
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

export default SpecialtyItem;
