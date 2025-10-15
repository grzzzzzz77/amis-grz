<template>
  <div class="modal">
    <el-dialog
      v-model="dialogVisible"
      width="35%"
      :title="
        isDetailRef
          ? modalConfig.header.detailTitle
          : isNewRef
          ? modalConfig.header.newTitle
          : modalConfig.header.editTitle
      "
      center
      :before-close="handleClose"
    >
      <div class="form">
        <el-form
          :model="formData"
          :rules="formRules"
          ref="formRef"
          label-width="100px"
        >
          <template v-for="item in modalConfig.formItems" :key="item.prop">
            <el-form-item
              :label="item.label"
              :prop="item.prop"
              :required="item.required"
              v-if="isFieldVisible(item)"
            >
              <template v-if="item.type === 'input'">
                <el-input
                  :disabled="isDetailRef || (!isNewRef && item.readonly)"
                  :model-value="getNestedValue(formData, item.prop)"
                  @input="(value: any) => setNestedValue(formData, item.prop, value)"
                  :placeholder="item.placeholder"
                ></el-input>
              </template>

              <template v-if="item.type === 'textarea'">
                <el-input
                  :disabled="isDetailRef || (!isNewRef && item.readonly)"
                  type="textarea"
                  :rows="3"
                  :model-value="getNestedValue(formData, item.prop)"
                  @input="(value: any) => setNestedValue(formData, item.prop, value)"
                  :placeholder="item.placeholder"
                ></el-input>
              </template>

              <template v-if="item.type === 'date-picker'">
                <el-date-picker
                  :disabled="isDetailRef || (!isNewRef && item.readonly)"
                  type="daterange"
                  range-separator="——"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  v-model="formData[item.prop]"
                />
              </template>
              <template v-if="item.type === 'timer-picker'">
                <el-date-picker
                  :disabled="isDetailRef || (!isNewRef && item.readonly)"
                  type="date"
                  :placeholder="item.placeholder || '请选择时间'"
                  v-model="formData[item.prop]"
                  value-format="YYYY-MM-DD"
                />
              </template>
              <template v-if="item.type === 'password'">
                <el-input
                  show-password
                  v-model="formData[item.prop]"
                  :disabled="isDetailRef || (!isNewRef && item.readonly)"
                  :placeholder="item.placeholder"
                />
              </template>
              <template v-if="item.type === 'select'">
                <el-select
                  :model-value="getNestedValue(formData, item.prop)"
                  @update:model-value="(value:any) => setNestedValue(formData, item.prop, value)"
                  :placeholder="item.placeholder"
                  style="width: 100%"
                  :disabled="isDetailRef || (!isNewRef && item.readonly)"
                  @change="(val:any) => handleSelectChange(val, item)"
                >
                  <template v-for="option in item.options" :key="option.value">
                    <el-option :value="option.value" :label="option.label" />
                  </template>
                </el-select>
              </template>
              <template v-if="item.type === 'image'">
                <img
                  :src="formData[item.prop]"
                  style="
                    width: 100px;
                    height: 100px;
                    object-fit: cover;
                    cursor: pointer;
                  "
                  @click="handlePreviewImage(formData[item.prop])"
                />
              </template>
              <template v-if="item.type === 'selectRole'">
                <el-select
                  :model-value="getRoleId(formData[item.prop])"
                  @update:model-value="(value:any) => handleRoleChange(value, item.prop, item.options)"
                  :placeholder="item.placeholder"
                  style="width: 100%"
                  :disabled="isDetailRef || (!isNewRef && item.readonly)"
                >
                  <template v-for="option in item.options" :key="option.value">
                    <el-option :value="option.value" :label="option.label" />
                  </template>
                </el-select>
              </template>

              <template v-if="item.type === 'upload-image'">
                <el-upload
                  ref="uploadRef"
                  class="upload-demo"
                  :auto-upload="false"
                  :disabled="isDetailRef || (!isNewRef && item.readonly)"
                  :on-change="(file:any) => handleFileChange(file, item.prop)"
                  accept="image/*"
                  :limit="1"
                >
                  <template #trigger>
                    <el-button type="primary">请选择上传的图片</el-button>
                  </template>
                </el-upload>
              </template>

              <template v-if="item.type === 'custom'">
                <slot :name="item.slotName"></slot>
              </template>
            </el-form-item>
          </template>
        </el-form>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmClick">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>

  <!-- 添加统一的图片预览组件 -->
  <el-image-viewer
    v-if="showImageViewer"
    :url-list="[previewImageUrl]"
    @close="showImageViewer = false"
  />
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import {
  ElMessageBox,
  ElMessage,
  FormInstance,
  ElImageViewer,
} from "element-plus";
import useSystemStore from "@/store/system/system";
const systemStore = useSystemStore();

//定义props
interface IProps {
  modalConfig: {
    pageName: string;
    header: {
      newTitle: string;
      editTitle: string;
      detailTitle?: string;
    };
    formItems: any[];
  };
}
const props = defineProps<IProps>();

//设置modal的显示和隐藏
const dialogVisible = ref(false);

const initialData: any = {};

for (const item of props.modalConfig.formItems) {
  initialData[item.prop] = "";
}

let formData = reactive<any>(initialData);
systemStore.modalData = formData;
const initialFormData = ref<any>();
const isNewRef = ref(true);
const editData = ref();
const isDetailRef = ref(false);

// 添加表单引用
const formRef = ref<FormInstance>();

// 创建表单验证规则对象
const formRules = computed(() => {
  const rules: any = {};
  props.modalConfig.formItems.forEach((item) => {
    if (item.rules) {
      rules[item.prop] = item.rules;
    }
  });
  return rules;
});

// 添加文件处理相关变量
const fileList = ref<{ [key: string]: File }>({});

// 处理文件选择变化
const handleFileChange = (file: any, prop: string) => {
  if (file.raw) {
    fileList.value[prop] = file.raw;
  }
};

function setModalVisible(
  isNew: boolean = true,
  itemData?: any,
  isDetail: boolean = false
) {
  dialogVisible.value = true;
  isNewRef.value = isNew;
  isDetailRef.value = isDetail; // 添加这行
  //如果是编辑，需要把数据填充到表单里面
  if (!isNew && itemData) {
    // 使用 reactive 创建响应式对象
    formData = reactive(JSON.parse(JSON.stringify(itemData)));
    editData.value = itemData;
    initialFormData.value = JSON.parse(JSON.stringify(formData));

    //如果是新建，需要把表单数据清空
  } else {
    for (const key in formData) {
      formData[key] = "";
    }
    editData.value = null;
  }
}

//点击了确定的逻辑
async function handleConfirmClick() {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    // 处理文件
    for (const prop in fileList.value) {
      if (fileList.value[prop]) {
        formData[prop] = fileList.value[prop];
      }
    }
    dialogVisible.value = false;
    if (isNewRef.value) {
      console.log(formData, "formData");
      await systemStore.newPageDataAction(props.modalConfig.pageName, formData);
      ElMessage.success("创建成功");
    } else {
      formData.id = editData.value.id;
      await systemStore.editPageDataAction(
        props.modalConfig.pageName,
        formData
      );
      ElMessage.success("编辑成功");
    }
  } catch (error) {
    console.error("表单验证失败:", error);
  }
}

//点击了关闭的逻辑
const handleClose = (done: () => void) => {
  const isDataModified = () => {
    // 如果是新建页面，检查 formData 是否有非空字段
    if (isNewRef.value) {
      return Object.values(formData).some(
        (value) => value !== undefined && value !== ""
      );
    }
    // 如果是编辑页面，检查 formData 是否和初始数据不一致
    return JSON.stringify(formData) !== JSON.stringify(initialFormData.value);
  };

  // 弹出确认提示框并处理关闭逻辑
  const handleConfirmClose = () => {
    ElMessageBox.confirm("关闭了信息将不会保存，您确定要关闭此窗口吗？")
      .then(() => done())
      .catch(() => {});
  };

  // 如果数据有修改，弹出确认提示框，否则直接关闭
  isDataModified() ? handleConfirmClose() : done();
};

// 添加获取嵌套值的方法
const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

// 添加设置嵌套值的方法
const setNestedValue = (obj: any, path: string, value: any) => {
  if (path.includes(".")) {
    // 处理嵌套属性
    const parts = path.split(".");
    const lastPart = parts.pop()!;
    const target = parts.reduce((acc, part) => {
      if (!(part in acc)) acc[part] = {};
      return acc[part];
    }, obj);
    target[lastPart] = value;
  } else {
    // 直接属性直接赋值
    obj[path] = value;
  }

  // 强制触发响应式更新
  // formData = { ...formData };
};

// 获取角色ID的辅助函数
const getRoleId = (roles: any[] | undefined) => {
  return roles?.[0]?.id ?? "";
};

// 处理角色选择变更
const handleRoleChange = (value: number, prop: string, options: any[]) => {
  const selectedOption = options.find((opt) => opt.value === value);
  formData[prop] = [
    {
      id: value,
      name: selectedOption?.label,
    },
  ];
};

// 添加 select 变化处理函数
const handleSelectChange = (value: any, item: any) => {
  if (item.linkage && value === item.linkage.value) {
    // 清空指定字段
    item.linkage.clearProps?.forEach((prop: string) => {
      formData[prop] = "";
    });
  }
};

// 修改表单项的显示逻辑
const isFieldVisible = (item: any) => {
  // 检查 only 属性
  if (item.only) {
    const currentMode = isDetailRef.value
      ? "detail"
      : isNewRef.value
      ? "new"
      : "edit";
    if (!item.only.includes(currentMode)) {
      return false;
    }
  }

  // 检查联动隐藏逻辑
  return !props.modalConfig.formItems.some(
    (formItem) =>
      formItem.linkage?.hideProps?.includes(item.prop) &&
      formData[formItem.prop] === formItem.linkage.value
  );
};

// 添加图片预览相关的响应式变量
const showImageViewer = ref(false);
const previewImageUrl = ref("");

// 添加图片预览处理函数
const handlePreviewImage = (url: string) => {
  previewImageUrl.value = url;
  showImageViewer.value = true;
};

defineExpose({ setModalVisible });
</script>

<style lang="less" scoped>
.form {
  padding: 0 20px;
}
.modal {
  overflow: visible !important;
}
</style>
