import { defineStore } from "pinia";

const useSystemStore = defineStore("system", {
  state: (): {
    usersList: any[];
    usersTotalCount: number;
    pageList: any[];
    pageTotalCount: number;
  } => ({
    usersList: [],
    usersTotalCount: 0,
    pageList: [
      {
        id: 55555,
        name: "售后",
        intro: "产品后期",
        createAt: "2023-09-14T08:39:23.000Z",
        updateAt: "2023-09-14T08:39:23.000Z",
      },
      {
        id: 55556,
        name: "售后1",
        intro: "产品后期1",
        createAt: "2023-09-14T08:39:23.000Z",
        updateAt: "2023-09-14T08:39:23.000Z",
      },
      {
        id: 55557,
        name: "售后3",
        intro: "产品后期3",
        createAt: "2023-09-14T08:39:23.000Z",
        updateAt: "2023-09-14T08:39:23.000Z",
      },
      {
        id: 55557,
        name: "售后3",
        intro: "产品后期3",
        createAt: "2023-09-14T08:39:23.000Z",
        updateAt: "2023-09-14T08:39:23.000Z",
      },
      {
        id: 55557,
        name: "售后3",
        intro: "产品后期3",
        createAt: "2023-09-14T08:39:23.000Z",
        updateAt: "2023-09-14T08:39:23.000Z",
      },
      {
        id: 55557,
        name: "售后3",
        intro: "产品后期3",
        createAt: "2023-09-14T08:39:23.000Z",
        updateAt: "2023-09-14T08:39:23.000Z",
      },
      {
        id: 55557,
        name: "售后3",
        intro: "产品后期3",
        createAt: "2023-09-14T08:39:23.000Z",
        updateAt: "2023-09-14T08:39:23.000Z",
      },
      {
        id: 55557,
        name: "售后3",
        intro: "产品后期3",
        createAt: "2023-09-14T08:39:23.000Z",
        updateAt: "2023-09-14T08:39:23.000Z",
      },
      {
        id: 55557,
        name: "售后3",
        intro: "产品后期3",
        createAt: "2023-09-14T08:39:23.000Z",
        updateAt: "2023-09-14T08:39:23.000Z",
      },
      {
        id: 55557,
        name: "售后3",
        intro: "产品后期3",
        createAt: "2023-09-14T08:39:23.000Z",
        updateAt: "2023-09-14T08:39:23.000Z",
      },
    ],
    pageTotalCount: 10,
  }),
});

export default useSystemStore;
