import { defineStore } from "pinia";
import { reactive, ref } from "vue";

interface TagItem {
  path: string;
  label: string;
  name: string;
}

interface MenuState {
  tagList: TagItem[];
}

export const useMenuStore = defineStore("menu", () => {
  const isCollapse = ref(false);
  const menuWith = ref("220px");

  // 从 localStorage 获取保存的数据
  const defaultTags = [{ path: "home", name: "home", label: "首页" }];
  const savedTags = JSON.parse(
    sessionStorage.getItem("tagList") || JSON.stringify(defaultTags)
  );

  const state = reactive<MenuState>({
    tagList: savedTags,
  });

  // 监听 tagList 变化并保存到 localStorage
  function saveTagsToStorage() {
    sessionStorage.setItem("tagList", JSON.stringify(state.tagList));
  }

  function collapseMenu() {
    isCollapse.value = !isCollapse.value;
    setTimeout(() => {
      if (isCollapse.value) {
        menuWith.value = "60px";
      } else {
        menuWith.value = "220px";
      }
    }, 0);
  }

  function closeMenu() {
    isCollapse.value = true;
    setTimeout(() => {
      menuWith.value = "60px";
    }, 0);
  }

  function addTag(val: TagItem) {
    // 确保首页标签始终存在
    const homeIndex = state.tagList.findIndex((item) => item.path === "home");
    if (homeIndex === -1) {
      state.tagList.unshift({ path: "home", label: "首页", name: "home" });
    }

    // 添加新标签
    const index = state.tagList.findIndex((item) => item.path === val.path);
    if (index === -1) {
      state.tagList.push({
        ...val,
        name: val.name,
      });
      saveTagsToStorage();
    }
  }

  function cleanTag() {
    // 清空标签时保留首页
    state.tagList = [
      {
        path: "home",
        label: "首页",
        name: "home",
      },
    ];
    saveTagsToStorage(); // 保存到 sessionStorage
  }

  return {
    isCollapse,
    collapseMenu,
    menuWith,
    state,
    addTag,
    cleanTag,
    closeMenu,
  };
});
