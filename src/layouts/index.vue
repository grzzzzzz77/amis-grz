<template>
  <div class="homeWrap" v-if="!$route.meta.fullPage">
    <el-container class="main_container">
      <el-aside
        left="0rpx"
        :width="menuWith"
        class="aside-container"
        style="box-shadow: 2px 0 6px rgb(0 21 41 / 35%)"
      >
        <Aside></Aside>
      </el-aside>
      <el-container class="el-container">
        <el-header>
          <Header></Header>
        </el-header>
        <el-main style="background-color: #f2f2f2">
          <router-view v-slot="{ Component, route }">
              <component 
                :is="Component" 
                :key="route.path"
              />
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
  <router-view v-if="$route.meta.fullPage" />
</template>

<script setup lang="ts">
import Aside from "../layouts/aside/index.vue";
import Header from "../layouts/header/index.vue";
import { useMenuStore } from "@/store/menu";
import { storeToRefs } from "pinia";

const menuStore = useMenuStore();
const { menuWith } = storeToRefs(menuStore);

</script>

<style scoped lang="less">
.homeWrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.main_container {
  min-height: 100%;
}
.el-container {
  height: 100%;
  background-color: #fff;
}
.el-header {
  --el-header-padding: 0;
  --el-header-height: 80px;
  background-color: #fff;
  padding: 0;
  margin: 0;
  border-radius: 8px;  /* 添加圆角 */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);  /* 可选：添加轻微阴影效果 */
}

.aside-container {
  transition: width 0.3s ease-in-out;
}
</style>
