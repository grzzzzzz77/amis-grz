import { createApp } from "vue";
import ElementPlus from "element-plus";
import "./style.css";
import router from "../src/router";
import store from "./store";
import App from "./App.vue";
import "amfe-flexible";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { createPinia } from "pinia";
import zh from "element-plus/es/locale/lang/zh-cn";

// css
import "normalize.css";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/theme-chalk/display.css";

const app = createApp(App);
const pinia = createPinia();
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus, {
  locale: zh,
  size: "default",
});
app.use(store);
app.use(router);
app.use(pinia);
app.mount("#app");
