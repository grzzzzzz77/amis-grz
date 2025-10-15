<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { type FormInstance, FormRules, ElMessage } from "element-plus";
import { User, Lock } from "@element-plus/icons-vue";
import { useMenuStore } from '@/store/menu'
import { login } from '@/api/login/login'
const router = useRouter();
const menuStore = useMenuStore()
/** 登录表单元素的引用 */
const loginFormRef = ref<FormInstance | null>(null);

/** 登录按钮 Loading */
const loading = ref(false);

/** 登录表单数据 */
const loginFormData = reactive({
  username: "admin",
  password: "12345678",
});
/** 登录表单校验规则 */
const loginFormRules: FormRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" },
  ],
};
/** 登录逻辑 */
const handleLogin =() => {
  // 添加表单验证
  loginFormRef.value?.validate( async (valid: boolean) => {
    if (valid) {
      // 验证过后执行登录操作
      // try {
        // const { data } = await login(loginFormData);
        // if (data.status === 'success') {
        //   menuStore.addTag({
        //    name: "home",
        //    path: "home",
        //    label: "首页",
        //   });
          ElMessage.success("登录成功");
          router.push("/home");
        // } else {
        //   ElMessage.error(data.message || "登录失败");
        // }
    //   } catch (error) {
    //     ElMessage.error("登录异常，请稍后重试");
    //     console.error(error);
    //   }
    // } else {
    //   ElMessage.error("请填写正确的登录信息");
    // }
    }
  });
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="title">停售今日心情</div>
      <div class="content">
        <el-form
          ref="loginFormRef"
          :model="loginFormData"
          :rules="loginFormRules"
          @keyup.enter="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model.trim="loginFormData.username"
              placeholder="用户名"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="loginFormData.password"
              placeholder="密码"
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
              show-password
              style="font-size: 14px"
            />
          </el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            size="large"
            @click.prevent="handleLogin"
            >登录</el-button
          >
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  .theme-switch {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }
  .login-card {
    width: 480px;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: #fff;
    overflow: hidden;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;
      color: #000;
      font-size: 50px;
    }
    .titleImg {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;
    }
    .content {
      padding: 20px 50px 50px 50px;
      :deep(.el-input-group__append) {
        padding: 0;
        overflow: hidden;
        .el-image {
          width: 100px;
          height: 40px;
          border-left: 0px;
          user-select: none;
          cursor: pointer;
          text-align: center;
        }
      }
      .el-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
