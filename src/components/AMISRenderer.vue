<template><div ref="rootEl">Loading...</div></template>

<script setup>
// import "amis/sdk/sdk.js";
// import "amis/sdk/sdk.css";
// import "amis/sdk/iconfont.css";

// 可以不引用, 如果你不想要任何辅助类样式的话 (比如 `m-t-xs` 这种)
// https://aisuda.bce.baidu.com/amis/zh-CN/style/index
import "amis/sdk/helper.css";
import qs from "qs";
import { ref, reactive, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";

function loadScript(src, callback) {
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", src);
  script.onload = () => callback();
  script.onerror = () => callback(new Error(`Failed to load ${src}`));
  document.body.appendChild(script);
}

function loadStyles(styles) {
  for (const path of styles) {
    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("type", "text/css");
    style.setAttribute("href", path);
    document.head.appendChild(style);
  }
}

function loadSDK() {
  return new Promise((resolve, reject) => {
    if (window.amisRequire) {
      resolve();
      return;
    }
    loadStyles([
      "/amis/sdk/sdk.css",
      "/amis/sdk/helper.css",
      "/amis/sdk/iconfont.css",
    ]);
    loadScript("/amis/sdk/sdk.js", (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
const emit = defineEmits(["ready"]);

const compProps = defineProps({
  schema: {
    type: Object,
    default: () => ({
      type: "page",
      body: "Hello World!",
    }),
  },
  locals: {
    type: Object,
    default: () => ({}),
  },
  props: {
    type: Object,
    default: () => ({}),
  },
  env: {
    type: Object,
    default: () => ({}),
  },
});

const router = useRouter();
const route = useRoute();

const rootEl = ref(null);
const state = reactive({
  context: { siteName: "AMIS DEMO" },
  loading: false,
});

const locationObj = computed(() => {
  const current = route;
  return {
    pathname: current.path,
    hash: current.hash,
    query: current.query,
    search: `?${qs.stringify(current.query)}`,
  };
});

let amisInstance = null;
let isUnmounted = false;

function updateProps() {
  amisInstance?.updateProps({
    data: { ...compProps.locals },
    context: state.context,
    ...compProps.props,
  });
}

watch(
  () => [compProps.locals, compProps.props, route.fullPath],
  () => {
    updateProps();
  }
);

onMounted(async () => {
  try {
    state.loading = true;
    await loadSDK();
  } finally {
    state.loading = false;
  }
  if (isUnmounted) {
    return;
  }

  const scoped = amisRequire("amis/embed");
  const { normalizeLink } = amisRequire("amis-core");

  const instance = scoped.embed(
    rootEl.value,
    compProps.schema,
    {
      data: { ...compProps.locals },
      context: state.context,
      location: locationObj.value,
      ...compProps.props,
    },
    {
      jumpTo: (to, action) => {
        if (to === "goBack") {
          return router.go(-1);
        }

        to = normalizeLink(to, locationObj.value);

        if (action?.actionType === "url") {
          action.blank === false ? router.push(to) : window.open(to);
          return;
        }

        if (action && to && action.target) {
          window.open(to, action.target);
          return;
        }

        if (/^https?:\/\//.test(to)) {
          window.location.replace(to);
        } else {
          router.push(to);
        }
      },

      updateLocation: (location, replace) => {
        if (location === "goBack") {
          return router.go(-1);
        }

        location = normalizeLink(location, locationObj.value);
        replace ? router.replace(location) : router.replace(location);
      },

      ...compProps.env,
    },
    () => {
      emit("ready", { instance });
    }
  );

  amisInstance = instance;
});

onUnmounted(() => {
  isUnmounted = true;
  amisInstance?.unmount();
});
</script>