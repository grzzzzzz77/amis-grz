//在searchForm组件中，点击查询或者重置是，进行content里面的操作

import { ref } from "vue";
import type pageContent from "@/components/page-content/page-content.vue";

function usePageContent() {
  //点击查询，content里面的操作,获取到pageContent组件的实例
  //导入了名为pageContent的类型
  const contentRef = ref<typeof pageContent>();

  function handleQueryClick(quaryInfo: any) {
    //调用pageContent组件里面的fetchPageListData方法,因为在组件中函数暴露了
    contentRef.value?.fetchPageListData(quaryInfo);
  }

  function handleResetClick() {
    contentRef.value?.handleResetClick();
  }

  return {
    contentRef,
    handleQueryClick,
    handleResetClick,
  };
}

export default usePageContent;
