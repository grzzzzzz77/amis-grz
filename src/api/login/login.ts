import service from "../request";

interface LoginData {
  username: string;
  password: string;
}

export function login(data: LoginData) {
  return service({
    url: `/user/login`,
    method: "post",
    data,
  });
}

export function logout() {
  return service({
    url: `/users/logout`,
    method: "post",
  });
}
