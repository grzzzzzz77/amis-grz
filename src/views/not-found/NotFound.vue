<template>
  <div class="content">
    <div class="page-404">
      <h1>404</h1>
      <p>You are lost this page</p>
      <p class="info">很抱歉,该页面不存在</p>
      <button class="back btn" @click="backClick">BACK</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const backClick = () => {
  router.go(-1);
};
</script>

<style lang="less" scoped>
@font-face {
  font-family: dogica;
  src: url(../../assets/font/dogica.ttf);
}
* {
  padding: 0;
  margin: 0;
}

.content {
  // background: url(../../assets/img/bg.png);
  background-size: cover; // 背景图像覆盖整个元素
  overflow: hidden; // 隐藏滚动条
  position: fixed; // 固定位置
  top: 0;
  left: 0;
  width: 100vw; // 视口宽度
  height: 100vh; // 视口高度
}

.content .page-404 {
  width: 100vw;
  font-family: dogica;
  z-index: 1;
  margin-top: 25vh;
}
.content .page-404 h1 {
  color: #000;
  font-size: 5vw;
  margin-bottom: 30px;
}
.content .page-404 p {
  color: #000;

  font-size: 1vw;
  margin: 10px 0;
  line-height: 2vw;
}
.content .page-404 .btn {
  color: #000;
  width: 10vw;
  height: 50px;
  border-radius: 30px;
  margin-top: 10px;
  cursor: pointer;
  transition: 0.3s;
  background-color: #fff;
  color: #000;
  border: 2px solid #000;
  font-size: 1vw;
}
.content .page-404 .btn:hover {
  background-color: #000;
  color: #fff;
}
</style>
