const searchConfig = {
  formItem: [
    {
      type: "input",
      prop: "userName",
      label: "用户名称",
      placeholder: "请输入查询的用户名称",
    },
    {
      type: "select",
      prop: "role",
      label: "角色",
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
      ],
    },
  ],
};

export default searchConfig;
