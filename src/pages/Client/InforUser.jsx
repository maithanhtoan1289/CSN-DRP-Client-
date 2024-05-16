import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Button from "../Client/Button";
import SpecialtyItem from "./SpecialtyItem";
import "../sass/inforUser.scss";
import { message } from "antd";

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

    const [profile, setProfile] = useState(null);
    const [userInfo, setUserInfo] = useState(initInfo);
    const [rescuer, setRescuer] = useState({ specialty: "", description: "" });
    const [specialityData, setSpecialityData] = useState([]);
    const [profileUpdate, setProfileUpdate] = useState(initInfo);

    useEffect(() => {
        dataProfile();
        dataSpeciality();
    }, []);

    useEffect(() => {
        if (profile) {
            const profileData = {
                name: profile.name,
                address: profile.address,
                phone: profile.phone,
                email: profile.email,
            };
            setUserInfo(profileData);
            setProfileUpdate(profileData);
        }
    }, [profile]);

    const handleChange = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value,
        });
        setProfileUpdate({
            ...profileUpdate,
            [e.target.name]: e.target.value,
        });
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
        } catch (err) {
            console.log(err);
        }
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            if (
                userInfo.name === profile.name &&
                userInfo.address === profile.address &&
                userInfo.phone === profile.phone &&
                userInfo.email === profile.email
            ) {
                message.info("Thông tin của bạn không có sự thay đổi nào!");
            } else {
                await axios.put(
                    "http://localhost:5000/api/users/updateprofile",
                    profileUpdate,
                    token
                );
                message.success("Cập nhật thông tin thành công.");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleChangeSpecialty = (e) => {
        const { value, name } = e.target;
        setRescuer({
            ...rescuer,
            [name]: value,
        });
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
            message.success("Gửi thành công");
            dataSpeciality();
        } catch (e) {
            console.log(e);
        }
    };

    const dataSpeciality = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/expertise/getExpertise",
                token
            );
            setSpecialityData(res.data.data);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="user-information">
            <h2 className="heading">Thông tin cá nhân</h2>
            <form
                action=""
                className="form-manage wrapp-form"
                onSubmit={updateProfile}
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
                            value={userInfo.name}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-information">
                        <label htmlFor="address" className="form-title">
                            Địa chỉ
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={userInfo.address}
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
                            value={userInfo.phone}
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
                            value={userInfo.email}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                </div>

                <Button>Cập nhật</Button>
            </form>

            <div className="form-manage wrapp-form form-flex">
                <div className="incident-form-right">
                    <h3 className="form-heading">Chuyên môn của bạn là gì?</h3>
                    <form
                        action=""
                        className="problem-right__form"
                        onSubmit={handleRescuer}
                    >
                        <div className="form-information">
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
                        <div className="form-information">
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

                <div className="history-problem-incident">
                    <h3 className="form-heading">Chuyên môn của bạn</h3>
                    <div className="incident-item">
                        {specialityData.map((item) => (
                            <SpecialtyItem
                                key={item.id}
                                id={item.id}
                                specialty={item.specialty}
                                description={item.description}
                                dataSpeciality={dataSpeciality}
                            />
                        ))}
                    </div>
                </div>
            </div>

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
