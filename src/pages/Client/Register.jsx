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
  Checkbox,
  Row,
  Select,
} from "antd";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import * as yup from "yup";
import { registerUser } from "../../features/Users/usersSlice";
import { yupResolver } from "@hookform/resolvers/yup";

const { Option } = Select;

// Define validate yup
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Vui lòng nhập họ và tên")
    .min(6, "Vui lòng nhập ít nhất 6 kí tự")
    .max(70, "Họ và tên chỉ được nhập tối đa 70 ký tự")
    .test("no-digits", "Tên không hợp lệ. Vui lòng nhập lại", (value) =>
      /^\D+$/.test(value)
    )
    .test(
      "uppercase-first-letter",
      "Tên không hợp lệ. Vui lòng nhập lại",
      (value) => {
        if (!value) return true;
        const words = value.split(" ");
        for (let word of words) {
          if (!/^[A-Z]/.test(word)) {
            return false;
          }
        }
        return true;
      }
    )
    .test(
      "special-characters",
      "Tên không hợp lệ. Vui lòng nhập lại",
      (value) => !/[!@#$%^&*(),.?":{}|<>]/.test(value)
    )
    .test(
      "space-before-uppercase",
      "Tên không hợp lệ. Vui lòng nhập lại",
      (value) => {
        const regex = /(?:^|\s)([A-Z][a-z]*){2,}(?=\s|$)/g;
        let match;
        while ((match = regex.exec(value)) !== null) {
          if (match.index !== 0 && match.index !== value.length - 1) {
            return false;
          }
        }
        return true;
      }
    ),
  username: yup
    .string()
    .required("Vui lòng nhập tên tài khoản")
    .min(5, "Tên tài khoản phải có ít nhất 5 ký tự")
    .max(30, "Tên tài khoản chỉ được nhập tối đa 30 ký tự")
    .test(
      "uppercase-characters",
      "Tên tài khoản không hợp lệ. Vui lòng nhập lại",
      (value) => !/[A-Z]/.test(value)
    )
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
  email: yup
    .string()
    .required("Vui lòng nhập địa chỉ email")
    .email("Email không hợp lệ. Vui lòng nhập lại")
    .test(
      "no-digits-before-at",
      "Email không hợp lệ. Vui lòng nhập lại",
      (value) => {
        const atIndex = value.indexOf("@");
        const localPart = value.substring(0, atIndex);
        return /^\D.*$/.test(localPart);
      }
    )
    .test(
      "valid-domain",
      "Tên miền không hợp lệ. Vui lòng nhập lại",
      (value) => {
        const atIndex = value.indexOf("@");
        const domainPart = value.substring(atIndex + 1);
        return /\S+\.\S+/.test(domainPart);
      }
    )
    .test(
      "no-special-characters-before-at",
      "Email không hợp lệ. Vui lòng nhập lại",
      (value) => {
        const atIndex = value.indexOf("@");
        const localPart = value.substring(0, atIndex);
        return /^[a-zA-Z0-9._%+-]+$/.test(localPart);
      }
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
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Mật khẩu không hợp lệ")
    .required("Vui lòng nhập xác nhận mật khẩu"),
  agreement: yup
    .boolean()
    .required("Vui lòng chấp nhận điều khoản")
    .oneOf([true], "Vui lòng chấp nhận điều khoản"),
});

export default function Register() {
  // Redux state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("ROLE_USER");

  // Hook form
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  // Even handlers
  const handleChangeRole = (value) => {
    setSelectedRole(value);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { agreement, ...formData } = data;
      formData.role = selectedRole;

      const response = await dispatch(registerUser(formData));

      if (response.payload) {
        notification.success({
          message: "Đăng ký thành công!",
          description: "Bạn đã đăng ký tài khoản người dùng thành công!",
        });
        navigate("/login");
      } else {
        let errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
        if (response.error) {
          const { message } = response.error;
          switch (message) {
            case "Username already exists":
              errorMessage = "Tên tài khoản đã tồn tại.";
              break;
            case "Email already exists":
              errorMessage = "Email đã tồn tại.";
              break;
            case "Passwords do not match":
              errorMessage = "Mật khẩu không khớp.";
              break;
            default:
              break;
          }
          notification.error({
            message: "Lỗi đăng ký!",
            description: errorMessage,
          });
        }
      }
    } catch (error) {
      console.error("Error calling register API:", error);
      notification.error({
        message: "Lỗi đăng ký!",
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
    <Row
      style={{
        backgroundColor: "#F28585",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px 0",
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
            agreement: false,
          }}
          onFinish={handleSubmit(onSubmit)}
          autoComplete="off"
          layout="vertical"
          requiredMark={customizeRequiredMark}
        >
          <Form.Item style={{ display: "flex", justifyContent: "center" }}>
            <Image width={80} src="/logo.png" />
          </Form.Item>

          <Typography.Title
            level={2}
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#FFA447",
              textAlign: "center",
            }}
          >
            Đăng ký Tài khoản
          </Typography.Title>

          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Form.Item
                label="Họ và tên"
                validateStatus={error ? "error" : ""}
                help={error?.message}
              >
                <Input {...field} placeholder="Nhập họ và tên" />
              </Form.Item>
            )}
          />

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
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Form.Item
                label="Địa chỉ email"
                validateStatus={error ? "error" : ""}
                help={error?.message}
              >
                <Input
                  {...field}
                  placeholder="Nhập địa chỉ email"
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

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Form.Item
                label="Xác nhận mật khẩu"
                validateStatus={error ? "error" : ""}
                help={error?.message}
              >
                <Input.Password
                  {...field}
                  placeholder="Nhập xác nhận mật khẩu"
                  onChange={(e) => {
                    field.onChange(e.target.value.trim());
                  }}
                />
              </Form.Item>
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Form.Item
                label="Vai trò"
                validateStatus={error ? "error" : ""}
                help={error?.message}
              >
                <Select
                  placeholder="Vui lòng chọn vai trò"
                  onChange={handleChangeRole}
                >
                  <Option value="ROLE_USER">Người dùng</Option>
                  <Option value="ROLE_RESCUER">Người cứu hộ</Option>
                </Select>
              </Form.Item>
            )}
          />

          <Controller
            name="agreement"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Form.Item
                validateStatus={error ? "error" : ""}
                help={error?.message}
              >
                <Checkbox {...field}>
                  Tôi đã đọc và chấp nhận với Chính sách và Điều khoản sử dụng
                </Checkbox>
              </Form.Item>
            )}
          />

          <Link
            to="/login"
            style={{
              fontWeight: "600",
            }}
          >
            Quay về đăng nhập
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
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
