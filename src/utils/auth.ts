export const TOKEN_TIME = 'tokenTime'

export const TOKEN_TIME_VALUE = 2 * 60 * 60 * 1000

// 登录时设置时间
export const setTokenTime = (): void => {
  localStorage.setItem(TOKEN_TIME, Date.now().toString());
};

// 获取
export const getTokenTime = (): string | null => {
  return localStorage.getItem(TOKEN_TIME);
};

// 是否已经过期
export const diffTokenTime = (): boolean => {
  const currentTime = Date.now();
  const tokenTime = getTokenTime();
  if (tokenTime) {
    return currentTime - Number(tokenTime) > TOKEN_TIME_VALUE;
  }
  return false;
};
