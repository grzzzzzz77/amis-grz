<template>
  <!-- 搜索的模板 -->
  <div class="search">
    <!-- 1.输入搜索关键词的表单 -->
    <el-form :model="searchForms" label-width="80px" size="large" ref="formRef">
      <el-row :gutter="20">
        <!-- key用item.prop,因为item.prop是唯一标识,肯定是不同的 -->
        <template v-for="item in searchConfig.formItem" :key="item.prop">
          <el-col :span="8">
            <!-- label就是标签文本,就是搜索框前的文本 -->
            <!-- prop就是	model 的键名,是绑定数据 -->
            <el-form-item :label="item.label" :prop="item.prop">
              <!-- type是类型选择 -->
              <template v-if="item.type === 'input'">
                <el-input
                  v-model="searchForms[item.prop]"
                  :placeholder="item.placeholder"
                ></el-input>
              </template>
              <template v-if="item.type === 'data-picker'">
                <el-date-picker
                  type="daterange"
                  range-separator="——"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  v-model="searchForms[item.prop]"
                />
              </template>
              <template v-if="item.type === 'password'">
                <el-input
                  show-password
                  v-model="searchForms[item.prop]"
                  :placeholder="item.placeholder"
                />
              </template>
              <template v-if="item.type === 'select'">
                <el-select
                  clearable
                  v-model="searchForms[item.prop]"
                  :placeholder="item.placeholder"
                  style="width: 100%"
                >
                  <template v-for="value in item.options" :key="value.value">
                    <el-option :value="value.value" :label="value.label" />
                  </template>
                </el-select>
              </template>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <!-- 2.重置和搜索的按钮 -->
    <div class="btns">
      <el-button size="large" icon="Refresh" @click="handleResetClick"
        >重置</el-button
      >
      <el-button
        size="large"
        type="primary"
        icon="Search"
        @click="handleQueryClick"
        >查询</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElForm } from "element-plus";
import { reactive, ref } from "vue";
import useSystemStore from "@/store/system/system";
const systemStore = useSystemStore();
//自定义事件/接受的属性
interface Iprops {
  searchConfig: {
    formItem: any[];
  };
}
//子组件向父组件传递事件
const emit = defineEmits(["quaryClick", "resetClick"]);

//接受父组件传递的属性
const props = defineProps<Iprops>();

//定义form数据
const Form: any = {};
for (const item of props.searchConfig.formItem) {
  Form[item.prop] = "";
}
//响应式数据
//searchForms就是这样的数据：{name: "", leader: ""}
const searchForms = reactive(Form);
systemStore.searchForms = searchForms;

//获取表单的ref,用来重置表单
const formRef = ref<InstanceType<typeof ElForm>>();

function handleResetClick() {
  //1.form中的数据全部做一个重置 对于表单来说用来清空表单数据的
  formRef.value?.resetFields();
  //2.将事件传递出去 content内部重新发送网络请求
  emit("resetClick");
}
function handleQueryClick() {
  console.log(searchForms,"searchForms");
  emit("quaryClick", searchForms);
}
</script>

<style lang="less" scoped>
.search {
  background-color: #fff;
  padding: 20px;

  .el-form-item {
    padding: 20px 30px;
    margin-bottom: 0;
  }
}

.btns {
  text-align: right;
  padding: 0 50px 10px 0;
}
</style>
