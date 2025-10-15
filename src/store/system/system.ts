import { defineStore } from "pinia";
import {
  getPageListData,
  deletePageData,
  newPageData,
  editPageData,
} from "@/api/system/system";

const useSystemStore = defineStore("system", {
  state: (): {
    pageList: any[];
    pageTotalCount: number;
    searchForms: any;
    pageInfo: any;
    modalData: any;
  } => ({
    pageList: [],
    pageTotalCount: 0,
    searchForms: {},
    pageInfo: {},
    modalData: {},
  }),

  getters: {
    queryInfo(): any {
      return { ...this.pageInfo, ...this.searchForms };
    },
  },

  actions: {
    // 页面的网络请求
    async getPageListDataAction(pageName: string, queryInfo: any) {
      const pageListResult = await getPageListData(pageName, queryInfo);
      const { items, total } = pageListResult.data;
      this.pageList = items;
      this.pageTotalCount = total;
    },
    // 删除数据
    async deletePageDataAction(pageName: string, id: number) {
      await deletePageData(pageName, id);
      await this.getPageListDataAction(pageName, this.queryInfo);
    },
    // 新建数据
    async newPageDataAction(pageName: string, addData: any) {
      await newPageData(pageName, addData);
      await this.getPageListDataAction(pageName, this.queryInfo);
    },
    // 编辑数据
    async editPageDataAction(pageName: string, editData: any) {
      await editPageData(pageName, editData);
      await this.getPageListDataAction(pageName, this.queryInfo);
    },
    clearPageData() {
      this.pageList = [];
      this.pageTotalCount = 0;
      this.searchForms = {};
    },
  },
});

export default useSystemStore;
