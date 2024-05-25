import React, { useEffect, useState } from "react";
import { Button, Table, Tag, message } from "antd";
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
        fetchData();
    }, []);

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

    const getDaysAgo = (createdAt) => {
        const createdDate = new Date(createdAt);
        const currentDate = new Date();
        const timeDiff = currentDate.getTime() - createdDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff;
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `http://localhost:5000/api/incident/delete/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            message.success("Xóa bài viết thành công");
            fetchData();
        } catch (e) {
            console.log(e);
        }
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
            filters: [
                { text: "đã giải quyết", value: "đã giải quyết" },
                { text: "chưa giải quyết", value: "chưa giải quyết" },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => {
                let color = status === "đã giải quyết" ? "green" : "red";
                let text =
                    status === "đã giải quyết"
                        ? "Đã giải quyết"
                        : "Chưa giải quyết";
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: "Người chia sẻ",
            dataIndex: "user_name",
            key: "user_name",
        },
        {
            title: "",
            dataIndex: "delete",
            render: (status, index) => {
                return (
                    <Button onClick={() => handleDelete(index.id)}>
                        Delete
                    </Button>
                );
            },
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
