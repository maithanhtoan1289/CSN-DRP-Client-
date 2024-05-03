import { useEffect, useState } from "react";
import "../sass/historyProlem.scss";
import HistoryItem from "./HistoryItem";
import HistoryProblemItem from "./HistoryProblemItem";
import Cookies from "js-cookie";
import axios from "axios";

const HistoryProlem = () => {
    const accessToken = Cookies.get("accessToken");
    const [data, setData] = useState([]);

    useEffect(() => {
        dataIncident();
    }, []);

    const dataIncident = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/histories/incidents",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
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
                    <h3 className="history-problem__heading">
                        Sự cố tuyến đường đã chia sẻ
                    </h3>
                    <HistoryItem>
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
                    </HistoryItem>
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
