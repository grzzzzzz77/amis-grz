import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import {
  HomeFilled,
  Setting,
  BottomLeft,
  Location,
} from "@element-plus/icons-vue";
// 导入其他路由组件...

// 定义路由配置数组
const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    component: () => import("../views/Login/index.vue"),
  },
  {
    path: "/",
    component: () => import("../layouts/index.vue"),
    redirect: "/login",
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("../views/Home/index.vue"),
        meta: { breadcrumb: "首页", icon: HomeFilled },
      },
      {
        path: "setting",
        name: "setting",
        meta: { breadcrumb: "成本设置", icon: BottomLeft },
        children: [
          {
            path: "shipping",
            name: "shipping",
            component: () => import("../views/setting/shipping/shipping.vue"),
            meta: { breadcrumb: "运费信息", icon: Location },
          },
          // 添加其他信息导入的子菜单路由...
        ],
      },
      {
        path: "RoleView",
        name: "RoleView",
        component: () => import("../views/Role/role.vue"),
        meta: {
          requiresAuth: false,
          breadcrumb: "用户管理",
          icon: Setting
        },
      },
      {
        path: "/:pathMatch(.*)",
        name: "NotFound",
        component: () => import("../views/not-found/NotFound.vue"),
        meta: {
          fullPage: true,
        },
      },
    ],
  },
  // 添加其他路由配置...
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由前置守卫

export default router;
