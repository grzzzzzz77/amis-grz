<template>
    <AMISRenderer :schema="schema" :locals="locals" />
  </template>
  <script setup lang="ts">
  import AMISRenderer from "@/components/AMISRenderer.vue";
  import { useRoute } from "vue-router";
  
  const route = useRoute();
  
  const schema = {...JSON.parse(localStorage.getItem(route.path)!)}
  
  const locals = {
    // 传递初始值
    // name: "Your Name",
  };
  </script>

