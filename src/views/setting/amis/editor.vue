<template>
  <div class="info">
    <el-button style="margin-right: 20px;" @click="save">保存</el-button>
    <el-button style="margin-right: 20px;" @click="back">返回</el-button>
  </div>
  <div class="editor-container" style="height:100vh;width: 100vw;">
    <div v-if="isLoading" class="editor-loading">
      <div class="spinner"></div>
    </div>

    <AmisEditor id="editorName"
      theme="cxd"
      className="test-amis-editor"
      :preview="previewModel"
      :isMobile="mobileModel"
      :value="schema"
      :onChange="editorChanged" />
  </div>

</template>

<script setup>
// 引入一些样式依赖
import "amis-ui/lib/themes/default.css";
import "amis-ui/lib/themes/cxd.css";
import "amis-editor-core/lib/style.css";

import { applyReactInVue } from "veaury";

import { Editor } from "amis-editor"; //引入编辑器

import { ref, reactive, onMounted, nextTick } from "vue";
import { useRoute,useRouter } from "vue-router";
import { ElMessage } from 'element-plus'

const route = useRoute();
const router = useRouter()
const AmisEditor = applyReactInVue(Editor); //使用编辑器

const previewModel = ref(false); //是否预览,实际开发中，如果需要编辑和预览，可以写一个change事件来改变这个值的状态
const mobileModel = ref(false); //是否是手机模式

console.log(route,"rrrr");

const back = ()=>{
  router.back()
}


const schema = reactive({...JSON.parse(localStorage.getItem(route.query.path))}); //渲染表单的内容

// loading 状态
const isLoading = ref(true);
const saveSchema = ref()
const editorChanged = (value) => {
  //编辑器内容变化后触发的方法
  // console.log("编辑器内容变化了。。。。",value);
   //todo  如果需要将数据保存，在这里可以操作
  saveSchema.value = JSON.stringify(value)

};

const save = ()=>{
  try{
    localStorage.setItem(`${route.query.path}`,saveSchema.value)
    ElMessage.success("保存成功")
  }catch(e){
    console.log(e,"e");
    
    ElMessage.error("保存失败")
  }
}

onMounted(async () => {
  // 等待组件渲染完毕后再隐藏 loading，确保编辑器已挂载
  await nextTick();
  // 给一点缓冲时间，让编辑器内部完成初始化
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
});
</script>


<style lang="less" scoped >
::v-deep .test-amis-editor {
  height: 100% !important;
  overflow-y: auto;
}

.editor-container {
  position: relative;
}

.editor-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.85);
  z-index: 9999;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(0,0,0,0.1);
  border-top-color: #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.info{
  display: flex;
  flex-direction: row-reverse;
}
</style>
