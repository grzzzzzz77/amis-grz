const contentConfig = {
  pageName: "users",
  header: {
    title: "用户列表",
    btnTitle: "添加用户",
  },
  handler: {
    editBtn: "编辑",
    deleteBtn: "删除",
  },

  roleStatus: {
    'SERVER':{text: '客服', type: 'success'},
    'ADMIN':{text: '管理员', type: ''},
    'TEST':{text: '测试', type: 'info'},
  },

  propsList: [
    { type: "normal", prop: "username", label: "用户名称" },
    { type: "tag", prop: "role", label: "角色" , status: "roleStatus",},
    { type: "normal", prop: "phone", label: "手机号" },
    { type: "handler", label: "操作", width: "250" },
  ],

  //测试数据
  pageList: [
    {
      id: 1,
      username: "admin",
      password: "123456",
      role: "SERVER",
      phone: "12345678901",
    },
    {
      id: 2,
      username: "editor",
      password: "123456",
      role: "ADMIN",
      phone: "12345678901",
    },
    {
      id: 3,
      username: "TEST",
      password: "123456",
      role: "TEST",
      phone: "12345678901",
    },
    {
      id: 4,
      username: "TEST",
      password: "123456",
      role: "TEST",
      phone: "12345678901",
    },
    {
      id: 5,
      username: "TEST",
      password: "123456",
      role: "TEST",
      phone: "12345678901",
    },
    {
      id: 6,
      username: "TEST",
      password: "123456",
      role: "TEST",
      phone: "12345678901",
    },
    {
      id: 7,
      username: "TEST",
      password: "123456",
      role: "TEST",
      phone: "12345678901",
    },
    {
      id: 8,
      username: "TEST",
      password: "123456",
      role: "TEST",
      phone: "12345678901",
    },
    {
      id: 9,
      username: "TEST",
      password: "123456",
      role: "TEST",
      phone: "12345678901",
    },
   
  
  ],
  pageTotalCount: 1,
};

export default contentConfig;
