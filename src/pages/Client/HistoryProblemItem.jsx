import { useEffect, useRef, useState } from "react";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import "../sass/histotyItem.scss";

const HistoryProblemItem = ({ nameUser, content }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [minute, setMinute] = useState(new Date().getTime());
    const menuRef = useRef(null);
    console.log();

    const handleMenu = () => {
        setShowMenu(!showMenu);
    };

    function formatTimeAgo(minute) {
        const seconds = Math.floor((new Date() - minute) / 1000);

        // Chuyển đổi sang phút
        if (seconds < 60) {
            return `${seconds} giây trước`;
        }

        // Chuyển đổi sang giờ
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            return `${minutes} phút trước`;
        }

        // Chuyển đổi sang ngày
        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return `${hours} giờ trước`;
        }

        // Chuyển đổi sang ngày
        const days = Math.floor(hours / 24);
        return `${days} ngày trước`;
    }

    console.log(formatTimeAgo(minute));

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

    const handleEdit = () => {
        alert(23);
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
                <span className="problem-time">{formatTimeAgo(minute)}</span>
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
                            onClick={handleEdit}
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
        </div>
    );
};

export default HistoryProblemItem;
