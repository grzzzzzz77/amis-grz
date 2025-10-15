const modalConfig = {
  pageName: "users",
  header: {
    newTitle: "添加用户",
    editTitle: "编辑用户",
  },
  formItems: [
    {
      type: "input",
      label: "用户名称",
      prop: "username",
      placeholder: "请输入角色名称",
      required: true,
      rules: [
        { required: true, message: "请输入用户名称", trigger: "blur" },
        { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
      ]
    },
    {
      type: "input",
      label: "密码",
      prop: "password",
      placeholder: "请输入密码",
      isEditHidden: true,
     
    },
    {
      type: "input",
      label: "手机号",
      prop: "phone",
      placeholder: "请输入手机号",
     
    },
    {
      type: "select",
      label: "角色",
      prop: "role",
      placeholder: "请选择角色",
     
      options: [
        {
          label: "管理员",
          value: "ADMIN",
        },
        {
          label: "客服",
          value: "SERVER",
        },
        {
          label: "测试",
          value: "TEST",
        },
      ],
    },
  ],
};

export default modalConfig;
