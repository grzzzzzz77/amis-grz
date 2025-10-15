import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router";
import { baseURL } from "@/utils/baseURL";

const token = sessionStorage.getItem("token");
const service = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: token ? { token } : undefined,
});

// 请求拦截器;
service.interceptors.request.use(
  (config) => {
    if (config.headers) {
      config.headers.token = sessionStorage.getItem("token");
    }
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error));
  }
);
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    //二进制数据对象，如图片、视频等。
    if (response.config.responseType === "blob") {
      return response;
    }

    const { code, msg } = response.data;

    // 如果是退出登录，不做任何处理，防止报错
    if (response.config.url === "/user/logout") {
      return;
    }

    if (code === 200) {
      // 200表示访问成功
      return response.data;
    } else if (code === 401) {
      ElMessage.error("用户认证失败,请跳转登录页面");
      sessionStorage.removeItem("token");
      router.push("/login");
    } else if (code === 40101) {
      ElMessage({ type: "error", message: msg, duration: 3000 });
    } else if (code === 10007) {
      ElMessage.error(msg);
    } else {
      // ElMessage({ type: "error", message: msg, duration: 10000 });
      ElMessage.error(msg);
      return Promise.reject(response.data);
    }
  },
  (error) => {
    // 如果请求超时，返回超时信息
    if (
      error.code === "ECONNABORTED" ||
      error.message === "Network Error" ||
      error.message.includes("timeout")
    ) {
      ElMessage.error("网络超时，请稍后重试！");
    }

    // 如果请求返回 401，显示消息并重定向到登录页面
    if (error.response && error.response.status === 401) {
      // 如果请求返回 401，显示消息并重定向到登录页面
      ElMessage.error("用户认证失败,请跳转登录页面");
      router.push("/login");
    } else if (error.response.statusText === "Internal Server Error") {
      // 如果发生服务器内部错误，显示消息
      ElMessage.error("服务器内部异常，请联系系统管理员！");
    } else {
      // 如果发生其他错误，进行适当的处理
      if (error.response.data.msg) {
        ElMessage.error(error.response.data.msg);
        return Promise.reject(error.response.data || "未知错误");
      }
      console.error("响应错误：", error.response);
      ElMessage.error(error.response.data);
      return Promise.reject(error.response.data);
    }
  }
);

export default service;
