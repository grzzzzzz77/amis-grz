import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import path from "path";
import postcssPresetEnv from "postcss-preset-env";
import viteCompression from "vite-plugin-compression";
// 文档的用法会报错, 要这样引入才可以
import { Plugin as importToCDN } from "vite-plugin-cdn-import";
import DefineOptions from 'unplugin-vue-define-options/vite'
//mock
import { viteMockServe } from "vite-plugin-mock";
import legacy from "@vitejs/plugin-legacy";
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  resolve: {
    alias: {
      //别名
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      // 修复 i18n-runtime 的错误入口，指向存在的 CommonJS 文件
      "i18n-runtime": path.resolve(__dirname, "./node_modules/i18n-runtime/lib/index.js"),
    },
  },
  plugins: [
    vue(),
    DefineOptions(), // 添加这一行
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, './node_modules/amis/sdk') + '/[!.]*',
          dest: 'amis/sdk'
        }
      ]
    }),
    legacy({
      targets: ["ie >= 11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
    //该插件可以去压缩代码gzip(需要服务器支持gzip,要很大的文件)
    viteCompression(),
    // 该插件可以去引入cdn资源
    importToCDN({
      modules: [
        {
          // 引入时的包名
          name: "vue", // app.use(), 全局注册时分配给模块的变量
          var: "Vue", // 根据自己的版本号找到对应的CDN网址 //版本号很重要，如果版本有误差可能导致打包部署到服务器后，项目无法运行
          path: "https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.min.js",
        },
        {
          name: "element-plus",
          var: "ElementPlus",
          path: "https://cdn.jsdelivr.net/npm/element-plus@2.3.8/dist/index.full.min.js",
        },
        {
          name: "vue-router",
          var: "VueRouter",
          path: "https://cdn.jsdelivr.net/npm/vue-router@4.2.4/dist/vue-router.global.min.js",
        },
        {
          name: "axios",
          var: "axios",
          path: "https://cdn.jsdelivr.net/npm/axios@1.4.0/dist/axios.min.js",
        },
        {
          name: "vue-demi",
          var: "VueDemi",
          path: "https://cdn.jsdelivr.net/npm/vue-demi@0.13.6/lib/index.iife.min.js",
        },
        {
          name: "pinia",
          var: "Pinia",
          path: "https://cdn.jsdelivr.net/npm/pinia@2.1.4/dist/pinia.iife.min.js",
        },
        {
          name: "less",
          var: "less",
          path: "https://cdn.jsdelivr.net/npm/less@4.1.3/dist/less.min.js",
        },
      ],
    }),
    viteMockServe({
      mockPath: "mock", // mock文件夹路径
      enable: true,
    }),
  ],
  css: {
    preprocessorOptions: {
      sass: {
        prependData: `
          @import "@/styles/variables.scss";  // scss文件地址
          @import "@/styles/mixin.scss";     // scss文件地址
        `,
      },
      less: {
        math: "always",
        globalVars: {
          mainColor: "red",
          nextColor: "green",
        },
      },
    },
    postcss: {
      plugins: [
        //自动管理 补全浏览器前缀
        autoprefixer({
          overrideBrowserslist: [
           "last 2 versions", "not dead", "not ie <= 11", "not op_mini all"
          ],
          //启用了对CSS Grid布局的支持
          grid: true,
        }),
        //对css进行语法降级
        postcssPresetEnv({
          stage: 2,
          features: {
            "custom-properties": true,
            "nesting-rules": true,
          },
        }),
      ],
    },
  },
  build: {
    //去掉console.log
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      //打包配置
      output: {
        //控制输出(静态资源)
        assetFileNames: "[hash].[name].[ext]", //资源文件名
        //进行分包
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },

    assetsInlineLimit: 4096000, //资源文件大小限制4000kb
    outDir: "dist", //打包输出目录
    assetsDir: "assets", //静态资源目录
    emptyOutDir: true, //清空打包目录
  },
  server: {
    hmr: { overlay: false }, // 禁用或配置 HMR 连接 设置 server.hmr.overlay 为 false 可以禁用服务器错误遮罩层
    // 服务配置
    port: 5173, // 类型： number 指定服务器端口;
    open: false, // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
    cors: false, // 类型： boolean | CorsOptions 为开发服务器配置 CORS。默认启用并允许任何源
    host: "0.0.0.0", // IP配置，支持从IP启动
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080/", //实际请求地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
