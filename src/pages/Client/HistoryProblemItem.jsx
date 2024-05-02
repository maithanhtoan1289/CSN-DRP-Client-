import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import "../sass/histotyItem.scss";
import Button from "./Button";

const HistoryProblemItem = ({
    id,
    nameUser,
    location,
    content,
    dataIncident,
}) => {
    const accessToken = Cookies.get("accessToken");
    const menuRef = useRef(null);

    const [showMenu, setShowMenu] = useState(false);
    const [formUpdate, setFormUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({
        name: "",
        location: "",
        type: "",
        status: "chưa giải quyết",
        description: "",
    });

    const handleChange = (e) => {
        setUpdateData({
            ...updateData,
            [e.target.name]: e.target.value,
        });
    };

    const handleMenu = () => {
        setShowMenu(!showMenu);
    };

    const hanleShowHide = () => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    };

    useEffect(() => {
        hanleShowHide();
    }, []);

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                `http://localhost:5000/api/incident/${id}`,
                updateData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setFormUpdate(false);
            dataIncident();
            console.log(res);
        } catch (e) {
            console.log(e);
        }
    };

    const handleDelete = () => {
        alert(23);
    };

    return (
        <div className="problem-left__wrapp">
            <span className="problem-avarta">
                <PersonOutlineOutlinedIcon className="avarta-icon" />
            </span>
            <div className="problem-content">
                <h4 className="problem-name">{nameUser}</h4>
                {/* <span className="problem-time">{formatTimeAgo(minute)}</span> */}
                <p className="problem-decs">
                    Tuyến đường gặp sự cố: {location}
                </p>
                <p className="problem-decs">{content}</p>
            </div>
            <span className="history-menu" ref={menuRef}>
                <span onClick={handleMenu}>
                    <MoreHorizIcon className="history-menu__icon" />
                </span>
                {showMenu && (
                    <div className="history-menu__list">
                        <span
                            className="history-menu__item"
                            onClick={() => setFormUpdate(!formUpdate)}
                        >
                            <EditOutlinedIcon className="menu-list__icon" />{" "}
                            Chỉnh sửa
                        </span>
                        <span
                            className="history-menu__item"
                            onClick={handleDelete}
                        >
                            <DeleteOutlineOutlinedIcon className="menu-list__icon" />{" "}
                            Xóa
                        </span>
                    </div>
                )}
            </span>

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
                        <h3 className="right-title">Chỉnh sửa bài viết</h3>
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
