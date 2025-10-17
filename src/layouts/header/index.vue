<template>
  <div class="info">
    <el-button class="editor" @click="goEditor" v-if="isAmis" >编辑器</el-button>
    <el-dropdown>
      <span class="user-info">
        <el-avatar
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
          size="small"
        />
        <span class="name">admin</span>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="handleExitClick">
            <el-icon><CircleCloseFilled /></el-icon>
            退出系统
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <div class="lower-section">
    <div class="content-item">
      <el-icon class="fold-icon" @click="handleCollapse">
        <Fold v-if="!isCollapse" />
        <Expand v-else />
      </el-icon>
      <el-breadcrumb class="breadcrumb">
        <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">
          {{ item.meta?.breadcrumb }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-item tags-container">
      <el-tag
        v-for="(tag, index) in menuStore.state.tagList"
        :key="tag.path"
        :closable="tag.label !== '首页'"
        :effect="$route.path === '/' + tag.path ? 'dark' : 'plain'"
        class="tag-item"
        @click="handleTagClick(tag)"
        @close="handleClose(tag, index)"
      >
        {{ tag.label }}
      </el-tag>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { RouteLocationMatched } from "vue-router";
import { useMenuStore } from "@/store/menu";
import { storeToRefs } from "pinia";
import { Fold, Expand } from "@element-plus/icons-vue";

const router = useRouter();
const route = useRoute();
const menuStore = useMenuStore();
const { isCollapse } = storeToRefs(menuStore);
const { collapseMenu } = menuStore;

async function handleExitClick() {
  sessionStorage.clear();
  router.push("/login");
}

const breadcrumbList = ref<RouteLocationMatched[]>([]);
// 监听路由变化，更新面包屑
watch(
  () => route.matched,
  (newValue) => {
    breadcrumbList.value = newValue.filter((item) => item.meta?.breadcrumb);
  },
  { immediate: true }
);

const isAmis = computed(()=>{
  return route.meta.isAmis
})

const handleCollapse = () => {
  collapseMenu();
};

const handleTagClick = (tag: any) => {
  router.push("/" + tag.path);
};

const handleClose = (tag: any, index: number) => {
  // 如果关闭的是当前激活的标签
  if (route.path === "/" + tag.path) {
    // 跳转到上一个标签（如果没有上一个，则跳转到下一个）
    const nextTag = menuStore.state.tagList[index - 1];
    if (nextTag) {
      router.push("/" + nextTag.path);
    }
  }
  // 删除当前tag
  menuStore.state.tagList.splice(index, 1);
  // 保存到 sessionStorage
  sessionStorage.setItem("tagList", JSON.stringify(menuStore.state.tagList));
};


const goEditor = ()=>{
  const path = route.path
  router.push({
    path:"/ed",
    query:{path}
  })
}
</script>

<style scoped lang="less">
.info {
  position: absolute;
  top: 15px;
  right: 20px;

  .editor{
    margin-bottom: 26px;
    margin-right: 10px;
  }
}
.tag {
  margin-top: 14px;
  margin-left: 5px;
}
.user-info {
  display: flex;
  align-items: center;
  cursor: pointer; //放上去变手
  outline: none;
  border: none;
  box-shadow: none;

  .name {
    margin-left: 6px;
    font-size: 16px;
  }
}

.lower-section {
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.content-item {
  flex: 1;
  color: black;
  display: flex;
  align-items: center;
}

.fold-icon {
  font-size: 20px;
  cursor: pointer;
  margin-right: 15px;

  &:hover {
    color: #409eff;
  }
}

.tags-container {
  padding: 8px;
  background: #fff;
}

.tag-item {
  margin-right: 8px;
  margin-top: 6px;
  margin-bottom: 6px;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  height: 26px;
  line-height: 26px;
  padding: 0 12px;

  &:hover {
    opacity: 0.85;
  }
}

.el-tag {
  &.el-tag--dark {
    border-color: #409eff;
    background-color: #409eff;
  }

  &.el-tag--plain {
    background-color: #fff;
    border-color: #d9ecff;
    color: #409eff;
  }

  :deep(.el-tag__close) {
    right: -2px;
    font-size: 14px;
    height: 16px;
    width: 16px;
    line-height: 16px;
  }
}
</style>
