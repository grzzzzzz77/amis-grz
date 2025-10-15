<template>
  <div class="main_container">
    <div class="logo">
      <el-icon class="logo-icon" :size="24"><Sunny /></el-icon>
      <h2 class="title" :class="{ 'title-hidden': isCollapse }">停售今日心情</h2>
    </div>

    <div class="menue">
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        text-color="#b7bdc3"
        active-text-color="#fff"
        background-color="#001529"
        :unique-opened="true"
        :collapse-transition="false"
        router
      >
        <template v-for="route in menuRoutes" :key="route.path">
          <!-- 有子菜单的情况 -->
          <el-sub-menu v-if="route.children && route.children.length" :index="'/' + route.path">
            <template #title>
              <el-icon v-if="route.meta?.icon">
                <component :is="route.meta.icon" />
              </el-icon>
              <span>{{ route.meta?.breadcrumb }}</span>
            </template>
            <el-menu-item
              v-for="child in route.children"
              :key="child.path"
              :index="'/' + route.path + '/' + child.path"
              class="itemMenu"
              @click="handleChildMenuClick(child, route)"
            >
              <template #title>{{ child.meta?.breadcrumb }}</template>
            </el-menu-item>
          </el-sub-menu>

          <!-- 没有子菜单的情况 -->
          <el-menu-item
            v-else
            :index="'/' + route.path"
            @click="handleMenuClick(route)"
          >
            <el-icon v-if="route.meta?.icon">
              <component :is="route.meta.icon" />
            </el-icon>
            <template #title>{{ route.meta?.breadcrumb }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { onMounted, onBeforeUnmount } from "vue";
import { useMenuStore } from "@/store/menu";
import { storeToRefs } from "pinia";
import { useRouter } from 'vue-router';
import { Sunny } from '@element-plus/icons-vue'

const router = useRouter();
const menuStore = useMenuStore();
const { addTag, cleanTag, closeMenu, collapseMenu } = menuStore;
const { isCollapse } = storeToRefs(menuStore);

// 获取路由配置中的菜单项
const menuRoutes = computed(() => {
  return router.options.routes
    .find(route => route.path === '/')?.children
    ?.filter(route => route.path !== '/:pathMatch(.*)' && route.name !== 'NotFound') || [];
});

const mediaQuery: MediaQueryList = window.matchMedia("(max-width: 768px)");

const handleMediaChange = (event: MediaQueryListEvent): void => {
  if (event.matches) {
    // 当屏幕宽度小于等于 768 像素时执行的函数
    console.log("nnn");
    closeMenu();
  }
};

// 在组件挂载到 DOM 后添加事件监听器
onMounted(() => {
  mediaQuery.addEventListener("change", handleMediaChange);
  if (mediaQuery.matches) {
    closeMenu();
  }
});

// 在组件销毁之前移除事件监听器
onBeforeUnmount(() => {
  mediaQuery.removeEventListener("change", handleMediaChange);
  localStorage.removeItem("currentRoute");
});

// 处理主菜单点击
const handleMenuClick = (route: any) => {
  addTag({ 
    path: route.path,
    label: route.meta?.breadcrumb || '首页',
    name: route.name || route.path
  })
}

// 处理子菜单点击
const handleChildMenuClick = (child: any, parent: any) => {
  addTag({ 
    path: `${parent.path}/${child.path}`,
    label: child.meta?.breadcrumb,
    name: child.name || child.path  // 使用子路由的name
  })
}
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  margin-top: 0;
  min-height: 100%;
  background-color: #001529;
  width: 100% !important;
}

.main_container {
  height: 100%;
  background-color: #001529;
}

/* 菜单背景色 */

.logo {
  display: flex;
  height: 80px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  padding: 0 20px;
  position: relative;
  width: 100%;
}

.logo-icon {
  color: #409EFF;
  flex-shrink: 0;
  position: relative;
  transition: all 0.3s ease;
}

/* 折叠时的图标样式 */
:deep(.el-menu--collapse) ~ .logo .logo-icon {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-left: 12px;
  white-space: nowrap;
  opacity: 1;
  transition: all 0.3s ease;
}

.title-hidden {
  opacity: 0;
  transform: translateX(-10px);
  margin-left: -100px;
}

.el-menu .el-menu-item.is-active {
  color: #fff !important;
  background-color: #0a1a2e !important;
  position: relative;
}

.el-menu-item.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 2px;
  height: 100%;
  background-color: #409EFF;
}

.el-menu .el-sub-menu .el-menu-item.is-active {
  color: #fff !important;
  background-color: #0a1a2e !important;
}


.el-menu-item.no-hover {
  pointer-events: none;
  cursor: default;
  background-color: #001529;
  font-weight: bold;
}
.itemMenu {
  padding-left: 50px !important;
}

.collapse_icon {
  cursor: pointer;
  height: 30px;
  width: 30px;
  left: 12px;
  bottom: 10px;
  position: fixed;
}

.menue {
  width: 100%;
}

.el-menu {
  border-right: none;
  width: 100% !important;
  padding: 0 !important;
}
</style>
