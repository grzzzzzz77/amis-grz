import { ref } from "vue";
import type pageModal from "@/components/page-modal/page-modal.vue";

function usePageModal() {
  const modalRef = ref<typeof pageModal>();

  function handleNewBtnClick() {
    modalRef.value?.setModalVisible();
  }
  function handleEditClick(itemData: any) {
    modalRef.value?.setModalVisible(false, itemData);
  }
  function handleDetailClick(itemData: any) {
    modalRef.value?.setModalVisible(false, itemData, true);
  }
  return {
    modalRef,
    handleNewBtnClick,
    handleEditClick,
    handleDetailClick,
  };
}

export default usePageModal;
