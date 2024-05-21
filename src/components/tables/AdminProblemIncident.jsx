import React, { useEffect, useState } from "react";
import { Table } from "antd";
import "../../App.css";
import axios from "axios";
import Cookies from "js-cookie";

const AdminProblemIncident = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const accessToken = Cookies.get("accessToken");

    const token = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/incident/getIncident",
                    token
                );
                const newData = response.data.data.map((item) => ({
                    ...item,
                    daysAgo: getDaysAgo(item.created_at),
                }));
                setData(newData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const getDaysAgo = (createdAt) => {
        const createdDate = new Date(createdAt);
        const currentDate = new Date();
        const timeDiff = currentDate.getTime() - createdDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff;
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Tên sự cố",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Kiểu sự cố",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Mô tả sự cố",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Địa chỉ gặp sự cố",
            dataIndex: "location",
            key: "location",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Người chia sẻ",
            dataIndex: "user_name",
            key: "user_name",
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey="id"
        />
    );
};

export default AdminProblemIncident;
