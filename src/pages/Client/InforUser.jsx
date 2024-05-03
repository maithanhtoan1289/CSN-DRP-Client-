import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Button from "../Client/Button";
import "../sass/inforUser.scss";

const InforUser = () => {
    const accessToken = Cookies.get("accessToken");

    const token = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    };
    const initInfo = {
        name: "",
        address: "",
        phone: "",
        email: "",
    };

    const [userInfo, setuserInfo] = useState(initInfo);
    const [profile, setProfile] = useState([]);

    useEffect(() => {
        dataProfile();
    }, []);

    const handleChange = (e) => {
        const { value, name } = e.target;
        setuserInfo({
            ...userInfo,
            [name]: value,
        });
    };

    const hanldSubmit = (e) => {
        e.preventDefault();

        setuserInfo({
            name: userInfo.name,
            address: userInfo.address,
            phone: userInfo.phone,
            email: userInfo.email,
        });
        console.log(userInfo);
    };

    const handlePassword = (e) => {
        e.preventDefault();
    };

    const dataProfile = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/users/profile",
                token
            );
            setProfile(res.data.data);
            console.log(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="user-information">
            <h2 className="heading">Thông tin cá nhân</h2>
            <form
                action=""
                className="form-manage wrapp-form"
                onSubmit={hanldSubmit}
            >
                <h3 className="form-heading">Quản lý thông tin của tôi</h3>
                <div className="form-wrapp">
                    <div className="form-information">
                        <label htmlFor="name" className="form-title">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            defaultValue={userInfo.name}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-information">
                        <label htmlFor="address" className="form-title">
                            Nơi ở hiện tại
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            defaultValue={userInfo.address}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                </div>
                <div className="form-wrapp">
                    <div className="form-information">
                        <label htmlFor="phone" className="form-title">
                            Số điện thoại
                        </label>
                        <input
                            type="phone"
                            id="phone"
                            name="phone"
                            defaultValue={userInfo.phone}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-information">
                        <label htmlFor="email" className="form-title">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            defaultValue={userInfo.email}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                </div>

                <Button>Cập nhật</Button>
            </form>
            <div className="form-manage wrapp-form">
                <h3 className="form-heading">Thay đổi mật khẩu của tôi</h3>
                <form action="">
                    <div className="form-information">
                        <label htmlFor="passwork">Mật khẩu hiện tại</label>
                        <input
                            type="text"
                            id="passwork"
                            className="form-input"
                        />
                    </div>
                    <div className="form-information">
                        <label htmlFor="newPasswork">Nhập mật khẩu mới</label>
                        <input
                            type="text"
                            id="newPasswork"
                            className="form-input"
                        />
                    </div>
                    <Button onClick={handlePassword}>Thay đổi mật khẩu</Button>
                </form>
            </div>
        </div>
    );
};

export default InforUser;
