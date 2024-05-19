import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Button from "../Client/Button";
import SpecialtyItem from "./SpecialtyItem";
import "../sass/inforUser.scss";
import { message } from "antd";

const isValue = (value) => {
    return !value || value.trim().length < 5;
};

const isValidName = (name) => {
    const regex =
        /^[a-zA-Z\sàáãạảăắằẳẵặâấầẩẫậèéẽẹẻêềếểễệđìíĩịỉòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỹỷỵÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẼẸẺÊỀẾỂỄỆĐÌÍĨỊỈÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỸỶỴ]+$/;
    return regex.test(name);
};

const isValidPhone = (phone) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
};

const isValidAddress = (address) => {
    const regex =
        /^[a-zA-Z0-9\sàáạãảăắằặẵẳâấầậẫẩèéẹẽẻêếềệễểìíịĩỉòóọõỏôốồộỗổơớờợỡởùúụũủưứừựữửỳýỵỹỷđÀÁẠÃẢĂẮẰẶẴẲÂẤẦẬẪẨÈÉẸẼẺÊẾỀỆỄỂÌÍỊĨỈÒÓỌÕỎÔỐỒỘỖỔƠỚỜỢỠỞÙÚỤŨỦƯỨỪỰỮỬỲÝỴỸỶĐ]*$/;
    return regex.test(address);
};

const isEmailValid = (email) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
};

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
    const [validate, setValidate] = useState({});
    const [errorRecuer, setErrorRecuer] = useState({});

    const validateInfo = () => {
        const error = {};

        if (isValue(profileUpdate.name)) {
            error["name"] = "Vui lòng nhập ít nhất 5 ký tự";
        } else if (!isValidName(profileUpdate.name)) {
            error["name"] = "Tên của bạn có ký tự đặc biệt hoặc số";
        }

        if (
            profileUpdate.phone.length > 10 ||
            profileUpdate.phone.length < 10
        ) {
            error["phone"] = "Số điện thoại của bạn ít hoặc nhiều hơn 10 số";
        } else if (!isValidPhone(profileUpdate.phone)) {
            error["phone"] = "SĐT của bạn có chữ hoặc ký tự đặc biệt";
        }

        if (profileUpdate.address.length === 0) {
            error["address"] = "Vui lòng nhập địa chỉ";
        } else if (!isValidAddress(profileUpdate.address)) {
            error["address"] = "Vui lòng không nhập ký tự đặc biệt";
        } else if (
            !/^\d+\s+[a-zA-ZàáạãảăắằặẵẳâấầậẫẩèéẹẽẻêếềệễểìíịĩỉòóọõỏôốồộỗổơớờợỡởùúụũủưứừựữửỳýỵỹỷđÀÁẠÃẢĂẮẰẶẴẲÂẤẦẬẪẨÈÉẸẼẺÊẾỀỆỄỂÌÍỊĨỈÒÓỌÕỎÔỐỒỘỖỔƠỚỜỢỠỞÙÚỤŨỦƯỨỪỰỮỬỲÝỴỸỶĐ]+\s*[a-zA-Z0-9\sàáạãảăắằặẵẳâấầậẫẩèéẹẽẻêếềệễểìíịĩỉòóọõỏôốồộỗổơớờợỡởùúụũủưứừựữửỳýỵỹỷđÀÁẠÃẢĂẮẰẶẴẲÂẤẦẬẪẨÈÉẸẼẺÊẾỀỆỄỂÌÍỊĨỈÒÓỌÕỎÔỐỒỘỖỔƠỚỜỢỠỞÙÚỤŨỦƯỨỪỰỮỬỲÝỴỸỶĐ]*$/.test(
                profileUpdate.address
            )
        ) {
            error["address"] = "Vui lòng nhập địa chỉ đầy đủ";
        }

        if (isValue(profileUpdate.email)) {
            error["email"] = "Vui lòng nhập Email";
        } else {
            if (!isEmailValid(profileUpdate.email)) {
                error["email"] = "Định dạng Email của bạn không đúng";
            }
        }

        setValidate(error);

        return Object.keys(error).length === 0;
    };

    const valiRescuer = () => {
        const error = {};

        if (isValue(rescuer.specialty)) {
            error["specialty"] = "Vui lòng nhập chuyên môn của bạn";
        } else if (!isValidName(rescuer.specialty)) {
            error["specialty"] = "Vui lòng không nhập số hoặc ký tự đặc biệt";
        }

        if (!isValidAddress(rescuer.description)) {
            error["description"] = "Vui lòng không nhập hoặc ký tự đặc biệt";
        }

        setErrorRecuer(error);
        return Object.keys(error).length === 0;
    };

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

    const handleChangeSpecialty = (e) => {
        const { value, name } = e.target;
        setRescuer({
            ...rescuer,
            [name]: value,
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
            if (validateInfo()) {
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
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleRescuer = async (e) => {
        e.preventDefault();
        try {
            if (valiRescuer()) {
                await axios.post(
                    "http://localhost:5000/api/expertise/create",
                    rescuer,
                    token
                );
                setRescuer({ specialty: "", description: "" });
                message.success("Gửi thành công");
                dataSpeciality();
            }
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
            console.log(res.data.data);
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
                            placeholder="VD: Nguyễn Văn A"
                            value={userInfo.name}
                            onChange={handleChange}
                            className="form-input"
                        />
                        {validate.name && (
                            <span className="info-error">{validate.name}</span>
                        )}
                    </div>
                    <div className="form-information">
                        <label htmlFor="address" className="form-title">
                            Địa chỉ
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            placeholder="VD: 100 Nguyễn Văn Linh"
                            value={userInfo.address}
                            onChange={handleChange}
                            className="form-input"
                        />
                        {validate.address && (
                            <span className="info-error">
                                {validate.address}
                            </span>
                        )}
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
                            placeholder="VD: 0962871234"
                            value={userInfo.phone}
                            onChange={handleChange}
                            className="form-input"
                        />
                        {validate.phone && (
                            <span className="info-error">{validate.phone}</span>
                        )}
                    </div>
                    <div className="form-information">
                        <label htmlFor="email" className="form-title">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="VD: vana@gmail.com"
                            value={userInfo.email}
                            onChange={handleChange}
                            className="form-input"
                        />
                        {validate.email && (
                            <span className="info-error">{validate.email}</span>
                        )}
                    </div>
                </div>

                <div className="right-btn">
                    <Button>Cập nhật</Button>
                </div>
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
                            {errorRecuer.specialty && (
                                <span className="info-error">
                                    {errorRecuer.specialty}
                                </span>
                            )}
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
                            {errorRecuer.description && (
                                <span className="info-error">
                                    {errorRecuer.description}
                                </span>
                            )}
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
                    <div className="right-btn">
                        <Button onClick={handlePassword}>
                            Thay đổi mật khẩu
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InforUser;
