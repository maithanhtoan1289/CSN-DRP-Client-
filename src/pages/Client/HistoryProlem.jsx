import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import "../sass/historyProlem.scss";
import HistoryProblemItem from "./HistoryProblemItem";
import SpecialtyItem from "./SpecialtyItem";

const HistoryProlem = () => {
    const accessToken = Cookies.get("accessToken");
    const token = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    };
    const [data, setData] = useState([]);
    const [specialityData, setSpecialityData] = useState([]);

    useEffect(() => {
        dataIncident();
        dataSpeciality();
    }, []);

    const dataIncident = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/histories/incidents",
                token
            );
            setData(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    const dataSpeciality = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/expertise/getExpertise",
                token
            );
            console.log(res.data.data);
            setSpecialityData(res.data.data);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="history">
            <div className="history-wrapp">
                <h2 className="heading">Lịch sử hoạt động</h2>

                <div className="history-problem wrapp-form">
                    <div className="history-problem-incident">
                        <h3 className="history-problem__heading">
                            Sự cố tuyến đường đã chia sẻ
                        </h3>
                        <div className="incident-item">
                            {data.map((item) => (
                                <HistoryProblemItem
                                    key={item.id}
                                    id={item.id}
                                    nameUser={item.name}
                                    location={item.location}
                                    type={item.type}
                                    description={item.description}
                                    dataIncident={dataIncident}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="history-problem-incident">
                        <h3 className="history-problem__heading">
                            Chuyên môn của bạn
                        </h3>
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

                <div className="history-problem wrapp-form">
                    <h3 className="history-problem__heading">
                        Bài viết quyên góp đã đăng
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default HistoryProlem;
