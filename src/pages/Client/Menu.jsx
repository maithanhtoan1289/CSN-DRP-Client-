import React, { useEffect, useRef, useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const Menu = ({ handleDelete, setFormUpdate, formUpdate }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

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

    return (
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
                        <EditOutlinedIcon className="menu-list__icon" /> Chỉnh
                        sửa
                    </span>
                    <span className="history-menu__item" onClick={handleDelete}>
                        <DeleteOutlineOutlinedIcon className="menu-list__icon" />{" "}
                        Xóa
                    </span>
                </div>
            )}
        </span>
    );
};

export default Menu;
