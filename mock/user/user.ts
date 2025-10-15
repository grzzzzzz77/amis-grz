import mockJS from "mockjs";
const userList = mockJS.mock({
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    'list|1-10': [
        {
            // 随机生成id号
            id: '@id',
            // 随机生成中文姓名
            username: '@cname',
            // 属性 id 是一个自增数，起始值为 1，每次增 1
            'id|+1': 1,
            // 随机生成ip地址
            ip: '@ip',
            // 随机生成省市区地址
            address:'@county(true)',
            // 随机生成18-70之间的年龄
            "age|18-70": 20,
            // 随机生成日期
            date: '@date("yyyy-MM-dd")',
            // 随机生成头像
            avatar:"@image('200x200')",
        }
    ]
})
export default [
  // 获取用户信息接口
  {
    url: "/user/login",
    method: "post",
    response: () => {
      return {
        code: 200,
        data: {
          status: "success",
          message: "登录成功",
          token: "123456789",
        },
        msg: "success",
      };
    },
  },
  // 获取用户信息列表接口
  {
    url: "/users",
    method: "get",
    response: () => {
      return {
        code: 200,
        data: {
          message: "获取用户信息成功",
          list: userList.list,
        },
        msg: "success",
      };
    },
  },
];
