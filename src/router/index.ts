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
        meta: { breadcrumb: "A", icon: BottomLeft },
        children: [
          {
            path: "amis",
            name: "amis",
            component: () => import("../views/setting/amis/amis.vue"),
            meta: { breadcrumb: "amis页面", icon: Location },
          },
          // 添加其他信息导入的子菜单路由...
        ],
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
