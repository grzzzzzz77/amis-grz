<template>
  <div class="content">
    <div class="header">
      <h3 class="title" v-if="contentConfig?.header?.title">
        {{ contentConfig?.header?.title }}
      </h3>
      <div>
        <slot name="header-left"></slot>
        <el-button
          type="primary"
          @click="handleNewUserClick"
          v-if="contentConfig.header?.btnTitle"
        >
          {{ contentConfig?.header?.btnTitle }}
        </el-button>
        <el-tooltip content="刷新当前页" placement="top">
          <el-button
            type="success"
            :icon="RefreshRight"
            circle
            @click="refreshPage"
          />
        </el-tooltip>
      </div>
    </div>

    <div class="table">
      <el-table
        v-loading="isLoading"
        element-loading-text="加载中..."
        :data="pageList"
        border
        style="width: 100%"
      >
        <template v-for="item in contentConfig.propsList" :key="item.prop">
          <template v-if="item.type === 'timer'">
            <el-table-column align="center" v-bind="item">
              <template #default="scope">
                {{ formatUTC(scope.row[item.prop]) }}
              </template>
            </el-table-column>
          </template>
          <template v-else-if="item.type === 'timerange'">
            <el-table-column align="center" v-bind="item">
              <template #default="scope">
                {{ formatUTC(scope.row[item.prop]?.[0]) }}~{{
                  formatUTC(scope.row[item.prop]?.[1])
                }}
              </template>
            </el-table-column>
          </template>
          <template v-else-if="item.type === 'handler'">
            <el-table-column align="center" v-bind="item">
              <template #default="scope">
                <div class="btns">
                  <el-button
                    text
                    type="primary"
                    icon="ZoomIn"
                    @click="handleDetailClick(scope.row)"
                    v-if="contentConfig.handler?.detailBtn"
                  >
                    {{ contentConfig.handler?.detailBtn }}
                  </el-button>
                  <el-button
                    text
                    type="primary"
                    icon="Edit"
                    @click="handleEditBtnClick(scope.row)"
                    v-if="contentConfig.handler?.editBtn"
                  >
                    {{ contentConfig.handler?.editBtn }}
                  </el-button>
                  <el-button
                    text
                    type="danger"
                    icon="Delete"
                    @click="handleDeleteBtnClick(scope.row.id)"
                    v-if="contentConfig.handler?.deleteBtn"
                  >
                    {{ contentConfig.handler?.deleteBtn }}
                  </el-button>
                  <slot name="other-buttons" :row="scope.row"></slot>
                </div>
              </template>
            </el-table-column>
          </template>

          <template v-else-if="item.type === 'image'">
            <el-table-column align="center" v-bind="item">
              <template #default="scope">
                <img
                  :src="scope.row[item.prop]"
                  style="width: 45px; height: 45px; cursor: pointer"
                  @click="handlePreviewImage(scope.row[item.prop])"
                />
              </template>
            </el-table-column>
          </template>

          <template v-else-if="item.type === 'tag'">
            <el-table-column align="center" v-bind="item">
              <template #default="scope">
                <el-tag
                  :type="
                    contentConfig[item.status]?.[scope.row[item.prop]]?.type
                  "
                  style="margin-left: 5px"
                >
                  {{ contentConfig[item.status]?.[scope.row[item.prop]]?.text }}
                </el-tag>
              </template>
            </el-table-column>
          </template>

          <template v-else-if="item.type === 'enumerate'">
            <el-table-column align="center" v-bind="item">
              <template #default="scope">
                {{ contentConfig[item.status]?.[scope.row[item.prop]]?.text }}
              </template>
            </el-table-column>
          </template>

          <template v-else-if="item.type === 'isChange'">
            <el-table-column align="center" v-bind="item">
              <template #default="scope">
                {{
                  contentConfig.withText[scope.row[item.prop]] ||
                  scope.row[item.prop]
                }}
              </template>
            </el-table-column>
          </template>

          <template v-else>
            <el-table-column align="center" v-bind="item"></el-table-column>
          </template>
        </template>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        v-model:current-page="CurrentPage"
        v-model:page-size="PageSize"
        :page-sizes="[1, 10, 20, 30]"
        small="small"
        layout="sizes, prev, pager, next, jumper,"
        :total="pageTotalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 添加统一的图片预览组件 -->
    <el-image-viewer
      v-if="showImageViewer"
      :url-list="[previewImageUrl]"
      @close="showImageViewer = false"
    />
  </div>
</template>

<script setup lang="ts">
import { formatUTC } from "@/utils/format";
import { ref, onBeforeUnmount } from "vue";
import { ElMessageBox, ElMessage, ElImageViewer } from "element-plus";
import { RefreshRight } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import useSystemStore from "@/store/system/system";

interface IProps {
  contentConfig: {
    pageName: string;
    header?: {
      title?: string;
      btnTitle?: string;
    };
    handler?: {
      detailBtn?: string;
      editBtn?: string;
      deleteBtn?: string;
    };
    withText?: any;
    propsList: any[];
    pageList?: any;
    pageTotalCount?: any;
    [key: string]: any;
    isDev?: boolean;
  };
}

//父组件传递过来的属性
const props = defineProps<IProps>();

//自定义事件,子组件向父组件传递事件
const emit = defineEmits(["newClick", "editClick", "detailClick"]);

//1.发起action,请求usersList数据
const systemStore = useSystemStore();

const CurrentPage = ref(1);
const PageSize = ref(10);

const isLoading = ref(false);

//页面加载的时候就要发起请求,获取数据
fetchPageListData();

//2.获取userslist数据进行展示
// 2.展示数据
const { pageList, pageTotalCount } = props.contentConfig.isDev
  ? storeToRefs(systemStore)
  : {
      pageList: props.contentConfig.pageList,
      pageTotalCount: props.contentConfig.pageTotalCount,
    };
//3.页码相关的逻辑

//每页显示多少条数据切换的时候,也要重新发起请求
function handleSizeChange() {
  CurrentPage.value = 1;
  fetchPageListData();
}

//换页请求,页码改变的时候,也要重新发起请求
function handleCurrentChange() {
  fetchPageListData();
}

function handleResetClick() {
  CurrentPage.value = 1;
  PageSize.value = 10;
  fetchPageListData();
}

// 4.定义函数，用来发送网络请求
async function fetchPageListData(formData: any = systemStore.searchForms) {
  if (isLoading.value) return;

  try {
    isLoading.value = true;
    const pageSize = PageSize.value;
    const pageNum = CurrentPage.value;
    const pageInfo = { pageSize, pageNum };
    systemStore.pageInfo = pageInfo;

    const quaryInfo = { ...pageInfo, ...formData };

    if (props.contentConfig.isDev) {
      await systemStore.getPageListDataAction(
        props.contentConfig.pageName,
        quaryInfo
      );
    }
  } finally {
    isLoading.value = false;
  }
}

onBeforeUnmount(() => {
  if (props.contentConfig.isDev) {
    systemStore.clearPageData();
  }
});

//将函数暴露出去
defineExpose({ fetchPageListData, handleResetClick });

//5.删除的操作
function handleDeleteBtnClick(id: number) {
  ElMessageBox.confirm("确认删除吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "error",
  })
    .then(async () => {
      // 用户点击了确定按钮
      await systemStore.deletePageDataAction(props.contentConfig.pageName, id);
      ElMessage.success("删除成功");
    })
    .catch(() => {
      // 用户点击了取消按钮或者关闭了弹窗
    });
}

//编辑的操作
function handleEditBtnClick(itemData: any) {
  //从组件中的scope.row传给这个函数,就是这个itemData
  emit("editClick", itemData);
}

//详情操作
function handleDetailClick(itemData: any) {
  //从组件中的scope.row传给这个函数,就是这个itemData
  emit("detailClick", itemData);
}

//6.新建用户
function handleNewUserClick() {
  emit("newClick");
}

//7. 实现刷新当前页的逻辑
const refreshPage = () => {
  fetchPageListData();
};

// 添加图片预览相关的响应式变量
const showImageViewer = ref(false);
const previewImageUrl = ref("");

// 添加图片预览处理函数
const handlePreviewImage = (url: string) => {
  previewImageUrl.value = url;
  showImageViewer.value = true;
};
</script>

<style lang="less" scoped>
.content {
  padding: 20px;
  margin-top: 20px;
  background-color: #fff;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;

  .title {
    font-size: 22px;
  }
}
.input-file {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.table {
  :deep(.el-table_cell) {
    padding: 12px 0;
  }

  .btns {
    display: flex;
  }
  .btns > * {
    flex: 1;
  }

  .btns > :only-child {
    margin: 0 auto;
  }
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
