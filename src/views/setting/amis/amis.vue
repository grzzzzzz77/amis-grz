<template>
  <AMISRenderer :schema="schema" :locals="locals" />
</template>
<script setup>
import AMISRenderer from "@/components/AMISRenderer.vue";

const schema ={
  "type": "form",
  "id": "u:0fa5270fb371",
  "title": "表单",
  "mode": "flex",
  "labelAlign": "top",
  "dsType": "api",
  "feat": "Insert",
  "body": [
    {
      "name": "name",
      "label": "姓名",
      "row": 0,
      "type": "input-text",
      "id": "u:91b2684b2e18"
    },
    {
      "name": "age",
      "label": "年龄",
      "row": 1,
      "type": "input-text",
      "id": "u:a85f299055e7"
    },
    {
      "name": "text-area",
      "label": "文本域",
      "row": 2,
      "type": "textarea",
      "id": "u:b93b709f8ad8"
    }
  ],
  "actions": [
    {
      "type": "button",
      "label": "跳转",
      "onEvent": {
        "click": {
          "actions": [
            {
              "ignoreError": false,
              "actionType": "url",
              "args": {
                "url": "/home",
                "blank": false
              }
            }
          ]
        }
      },
      "id": "u:8149dbf298b6",
      "level": "warning"
    },
    {
      "type": "button",
      "label": "重置",
      "onEvent": {
        "click": {
          "actions": [
            {
              "actionType": "reset",
              "componentId": "u:0fa5270fb371"
            }
          ]
        }
      },
      "level": "default",
      "id": "u:95da1c196346"
    },
    {
      "type": "button",
      "label": "提交",
      "onEvent": {
        "click": {
          "actions": [
            {
              "actionType": "submit",
              "componentId": "u:0fa5270fb371"
            }
          ]
        }
      },
      "level": "primary",
      "id": "u:f401ced4d7bd"
    }
  ],
  "resetAfterSubmit": true,
  "asideResizor": false,
  "pullRefresh": {
    "disabled": true
  }
}

const locals = {
  // 传递初始值
  // name: "Your Name",
};
</script>
