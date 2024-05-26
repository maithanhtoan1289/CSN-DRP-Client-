import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import "../sass/historyProlem.scss";
import HistoryProblemItem from "./HistoryProblemItem";

export const formatDate = (format) => {
    const date = new Date(format);
    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const HistoryProlem = () => {
    const accessToken = Cookies.get("accessToken");
    const token = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    };
    const [data, setData] = useState([]);

    useEffect(() => {
        dataIncident();
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
                                    name={item.name}
                                    location={item.location}
                                    status={item.status}
                                    description={item.description}
                                    dataIncident={dataIncident}
                                    date={formatDate(item.created_at)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryProlem;
