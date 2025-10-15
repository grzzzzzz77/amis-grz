import service from "../request";

/** 获取页面的数据 */
export function getPageListData(pageName: string, queryInfo?: any) {
  return service({
    url: `/${pageName}`,
    method: "get",
    params: queryInfo,
  });
}

export function deletePageData(pageName: string, id: number) {
  return service({
    url: `/${pageName}`,
    method: "delete",
    params: { id },
  });
}

export function newPageData(pageName: string, addData: any) {
  return service({
    url: `/${pageName}`,
    method: "post",
    data: addData,
  });
}

export function editPageData(pageName: string, editData: any) {
  return service({
    url: `/${pageName}`,
    method: "put",
    data: editData,
  });
}
