import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const axiosFormData = axios.create({
  baseURL: "http://localhost:5000/api",
});

axiosFormData.interceptors.request.use(
  async (config) => {
    if (
      config.url.includes("/auth/login") ||
      config.url.includes("/auth/register") ||
      config.url.includes("/auth/refresh-token") ||
      config.url.includes("/auth/logout") ||
      config.url.includes("/natural-disasters/v1/add") ||
      config.url.includes("/problems/v1/add") ||
      config.url.includes("/natural-disasters/v2/add") ||
      config.url.includes("/problems/v2/add") ||
      config.url.includes("/upload/add-image") ||
      config.url.includes("/users/rescue-needed") ||
      config.url.includes("/users/rescue-seeker")
    ) {
      return config;
    }

    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    if (!accessToken || !refreshToken) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      window.location.href = "/login";
    }

    const decodedAccessToken = jwtDecode(accessToken);
    const decodedrefreshToken = jwtDecode(refreshToken);

    let newAccessToken = accessToken;

    // Lấy thời gian hết hạn của access token
    const accessTokenExpirationTime = decodedAccessToken.exp * 1000;
    const refreshTokenExpirationTime = decodedrefreshToken.exp * 1000;

    // Lấy thời gian hiện tại
    const currentDate = new Date().getTime();

    // Kiểm tra xem access token có hết hạn sau 60 giây không
    if (accessTokenExpirationTime <= currentDate) {
      const refreshTokenValue = Cookies.get("refreshToken");

      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/refresh-token",
          {
            refreshToken: refreshTokenValue,
          }
        );

        // Assume response contains new tokens and expiration times
        const { accessToken: newToken, refreshToken: newRefreshToken } =
          response.data.data;
        Cookies.set("accessToken", newToken);
        Cookies.set("refreshToken", newRefreshToken);

        newAccessToken = newToken;
      } catch (error) {
        // Handle refresh token error by redirecting to the login page
        window.location.href = "/login";
        // Throwing error to exit from the request interceptor
        throw error;
      }
    }

    if (
      accessTokenExpirationTime <= currentDate &&
      refreshTokenExpirationTime <= currentDate
    ) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      window.location.href = "/login";
    }

    config.headers.Authorization = `Bearer ${newAccessToken}`;

    // Set Content-Type based on the type of data sent
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosFormData.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Hàm xử lý khi nhận được error từ response
    if (error.response) {
      console.log(error.response.data);
      // Kiểm tra nếu mã lỗi là 401 (Unauthorized)
      if (error.response.status === 401) {
        // Chuyển hướng về trang đăng nhập
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
      }

      return Promise.reject(error.response.data);
    }
    return Promise.reject(error.response.data);
  }
);

export default axiosFormData;
