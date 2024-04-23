import "../sass/historyProlem.scss";
import HistoryItem from "./HistoryItem";
import HistoryProblemItem from "./HistoryProblemItem";

const HistoryProlem = () => {
    return (
        <div className="history">
            <div className="history-wrapp">
                <h2 className="heading">Lịch sử hoạt động</h2>

                <div className="history-problem wrapp-form">
                    <h3 className="history-problem__heading">
                        Sự cố tuyến đường đã chia sẻ
                    </h3>
                    <HistoryItem>
                        <HistoryProblemItem
                            nameUser="văn c"
                            content="Tuyến đường từ Đà Nẵng ra Huế có 1 vụ tại nạn gây tắc đường."
                        />
                        <HistoryProblemItem
                            nameUser="văn d"
                            content="Tuyến đường từ Đà Nẵng ra Huế có 1 vụ tại nạn gây tắc đường."
                        />
                    </HistoryItem>
                </div>
                <div className="history-problem wrapp-form">
                    <h3 className="history-problem__heading">
                        Bài viết quyên góp đã đăng
                    </h3>
                    <HistoryItem>
                        <HistoryProblemItem
                            nameUser="văn g"
                            content="Tuyến đường từ Đà Nẵng ra Huế có 1 vụ tại nạn gây tắc đường."
                        />
                        <HistoryProblemItem
                            nameUser="văn h"
                            content="Tuyến đường từ Đà Nẵng ra Huế có 1 vụ tại nạn gây tắc đường."
                        />
                    </HistoryItem>
                </div>
            </div>
        </div>
    );
};

export default HistoryProlem;
