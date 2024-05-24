import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  notification,
  Spin,
  Col,
  Image,
  Typography,
  Layout,
} from "antd";
import { useForm, Controller } from "react-hook-form";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import * as yup from "yup";
import { loginUser } from "../../features/Users/usersSlice";
import { yupResolver } from "@hookform/resolvers/yup";

const { Content } = Layout;

// Define validate yup
// Define validate yup
const schema = yup.object().shape({
  username: yup
    .string()
    .required("Vui lòng nhập tên tài khoản")
    .min(5, "Tên tài khoản phải có ít nhất 5 ký tự")
    .max(30, "Tên tài khoản chỉ được nhập tối đa 30 ký tự")
    .test(
      "special-characters",
      "Tên tài khoản không được chứa kí tự đặc biệt. Vui lòng nhập lại",
      (value) => !/[!@#$%^&*(),.?":{}|<>]/.test(value)
    )
    .test(
      "no-whitespace",
      "Tên tài khoản không được chứa khoảng cách. Vui lòng nhập lại",
      (value) => !/\s/.test(value)
    ),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(30, "Mật khẩu chỉ được nhập tối đa 30 ký tự")
    .test(
      "no-uppercase-characters",
      "Mật khẩu không chứa chữ in hoa",
      (value) => !/[A-Z]/.test(value)
    )
    .test(
      "special-characters",
      "Mật khẩu không hợp lệ. Vui lòng nhập lại",
      (value) => !/[!@#$%^&*(),?":{}|<>]/.test(value)
    )
    .test(
      "no-whitespace",
      "Mật khẩu không hợp lệ. Vui lòng nhập lại",
      (value) => !/\s/.test(value)
    )
    .test(
      "not-all-uppercase",
      "Mật khẩu không hợp lệ. Vui lòng nhập lại",
      (value) => !/^[A-Z]*$/.test(value)
    ),
});

export default function Login() {
  // Redux state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state
  const [loading, setLoading] = useState(false);

  // Hook form
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  // Even handlers
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await dispatch(loginUser(data));

      if (response.payload) {
        Cookies.set("accessToken", response.payload.data.accessToken, {
          expires: new Date(response.payload.data.accessTokenExpires),
        });
        Cookies.set("refreshToken", response.payload.data.refreshToken, {
          expires: new Date(response.payload.data.refreshTokenExpires),
        });

        if (response.payload.data.role === "ROLE_USER") {
          navigate("/");
        } else if (response.payload.data.role === "ROLE_ADMIN") {
          navigate("/admin/natural-disaster");
        } else if (response.payload.data.role === "ROLE_RESCUER") {
          navigate("/rescue-seeker");
        } else {
          notification.error({
            message: "Lỗi truy cập",
            description: "Bạn không có quyền truy cập!",
          });
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
        }
      } else {
        let errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
        if (response.error) {
          const { message } = response.error;
          switch (message) {
            case "Username does not exist":
              errorMessage = "Tên tài khoản không hợp lệ.";
              break;
            case "Invalid password":
              errorMessage = "Mật khẩu không hợp lệ";
              break;
            default:
              break;
          }
          notification.error({
            message: "Lỗi đăng nhập!",
            description: errorMessage,
          });
        }
      }
    } catch (error) {
      console.error("Error calling login API:", error);
      notification.error({
        message: "Lỗi đăng nhập!",
        description: "Lỗi hệ thống",
      });
    } finally {
      setLoading(false);
    }
  };

  // Ant Design
  const customizeRequiredMark = (label, required) => (
    <>
      {label}
      {required && <span style={{ color: "red" }}>*</span>}
    </>
  );

  return (
    <Layout style={{ height: "100vh" }}>
      <Content
        style={{
          backgroundColor: "#F28585",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Col xs={22} sm={22} md={16} lg={8} xl={8}>
          <Form
            name="basic"
            style={{
              background: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              borderRadius: "10px",
              padding: "30px",
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={handleSubmit(onSubmit)}
            autoComplete="off"
            layout="vertical"
            requiredMark={customizeRequiredMark}
          >
            <Form.Item style={{ display: "flex", justifyContent: "center" }}>
              <Link to="/">
                <Image width={100} preview={false} src="/logo.png" />
              </Link>
            </Form.Item>

            <Typography.Title
              level={2}
              style={{
                fontSize: "30px",
                fontWeight: "700",
                color: "#FFA447",
                textAlign: "center",
              }}
            >
              Đăng nhập
            </Typography.Title>

            <Controller
              name="username"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Form.Item
                  label="Tên tài khoản"
                  validateStatus={error ? "error" : ""}
                  help={error?.message}
                >
                  <Input
                    {...field}
                    placeholder="Nhập tên tài khoản"
                    onChange={(e) => {
                      field.onChange(e.target.value.trim());
                    }}
                  />
                </Form.Item>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Form.Item
                  label="Mật khẩu"
                  validateStatus={error ? "error" : ""}
                  help={error?.message}
                >
                  <Input.Password
                    {...field}
                    placeholder="Nhập mật khẩu"
                    onChange={(e) => {
                      field.onChange(e.target.value.trim());
                    }}
                  />
                </Form.Item>
              )}
            />

            <Link
              to="/register"
              style={{
                fontWeight: "600",
              }}
            >
              Bấm vào đây để đăng ký
            </Link>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  background: "#FFA447",
                  width: "100%",
                  marginTop: "30px",
                }}
                icon={loading ? <Spin /> : null}
                loading={loading}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Content>
    </Layout>
  );
}
