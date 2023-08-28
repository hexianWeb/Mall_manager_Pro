<template>
  <div class="bg">
    <!-- 根据屏幕尺寸切换布局 -->
    <div class="content">
      <div class="login-wrapper">
        <div class="left-wrapper" v-if="!data.isScreenSmall"></div>
        <div class="right-wrapper">
          <h2>hexianWeb 后台商城管理系统 🚀</h2>
          <div class="input-control">
            <input
              type="text"
              id="username"
              class="form-input"
              v-on:focus="userNameFocus = true"
              v-on:blur="userNameFocus = false"
              v-model="username.value"
              @blur="handleBlur('username')"
            />
            <label for="username" data-placeholder="Username" :class="userNameFocus ? 'focus' : ''"></label>
            <transition name="fade">
              <label for="username" v-if="username.error" class="error-message">{{ username.error }}</label>
            </transition>
          </div>
          <div class="input-control">
            <input
              id="password"
              type="password"
              class="form-input"
              v-on:focus="passWordFocus = true"
              v-on:blur="passWordFocus = false"
              @blur="handleBlur('password')"
              v-model="password.value"
            />
            <label for="password" data-placeholder="Password" :class="passWordFocus ? 'focus' : ''"></label>
            <transition name="fade">
              <label for="password" v-if="password.error" class="error-message">{{ password.error }}</label>
            </transition>
          </div>
          <input type="submit" value="Login" class="loginBtn" @click="handleSubmit" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" name="Login">
import router from '@/router';
import { useUserStore } from '@/stores/modules/login';
// ------------------------------服务于逻辑-----------------------------------

// 表单验证相关数据
interface FormField {
  value: string;
  error: string | null;
}
// 创建响应式的数据对象
const username: FormField = reactive({
  value: '',
  error: null
});

const password: FormField = reactive({
  value: '',
  error: null
});
// 表单提交处理函数
async function handleSubmit() {
  // 表单提交时进行验证
  validateField('username');
  validateField('password');

  // 如果表单验证通过，则提交表单
  if (!username.error && !password.error) {
    // 提交表单的逻辑
    const userStore = useUserStore();
    await userStore.login({ username: username.value, password: password.value });
    router.push('/');
    return;
  }
}

// 输入框失去焦点处理函数
function handleBlur(field: string) {
  // 输入框失去焦点时进行验证
  validateField(field);
}

// 表单字段验证逻辑
function validateField(field: string) {
  if (field === 'username') {
    if (!username.value) {
      username.error = '请输入用户名';
    } else {
      username.error = null;
      userNameFocus.value = true;
    }
  } else if (field === 'password') {
    if (!password.value) {
      password.error = '请输入密码';
    } else {
      password.error = null;
      passWordFocus.value = true;
    }
  }
}
//-------------------------------服务于UI-----------------------------------
// 定义组件数据类型
interface Data {
  isScreenSmall: boolean;
}

// 创建响应式的数据对象
const data: Data = reactive({
  isScreenSmall: window.innerWidth < 1240
});

// 监听窗口尺寸变化
onMounted(() => {
  window.addEventListener('resize', handleResize);
});

// 移除监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

watchEffect(() => {
  if (data.isScreenSmall) {
    ElMessage({
      type: 'success',
      message: '您正在浏览移动端布局'
    });
  } else {
    ElMessage({
      type: 'warning',
      message: '您正在浏览PC端布局'
    });
  }
});
// 窗口尺寸变化的处理函数
function handleResize() {
  data.isScreenSmall = window.innerWidth < 1200;
}
const userNameFocus = ref(false);
const passWordFocus = ref(false);
</script>
<style lang="less" scoped>
.bg {
  background-image: linear-gradient(
    to left,
    #ff8177 0%,
    #ff867a 0%,
    #f78d74 21%,
    #c45658 40%,
    #a44c53 53%,
    #583046 100%
  );
  height: 100vh;
  .content {
    display: flex;
    align-items: center;
    height: 100vh;

    .login-wrapper {
      display: flex;
      margin: 0 auto;
      border-radius: 20px;
      overflow: hidden;
      width: 56vw;
      min-width: 390px;
      height: 66vh;
      .left-wrapper {
        flex: 2;
        height: 100%;
        background-size: cover;
        background-image: url('@/assets/img/shop_img.jpg');
      }
      .right-wrapper {
        display: flex;
        flex-flow: column;
        align-items: center;
        flex: 3;
        background-color: #f1f1f1;
        h2 {
          margin: 2em;
        }
        .input-control {
          position: relative;
          width: 360px;
          margin: 20px auto;
          input {
            background: none;
            appearance: none;
            border: none;
            font-size: 1.4em;
            height: 2em;
            // border-bottom: #ccc 2px solid;
            color: #333;
            outline: none;
          }
          label {
            &::before {
              content: attr(data-placeholder);
              position: absolute;
              top: 50%;
              left: 5px;
              color: #ca3555;
              transform: translateY(-50%);
              transition: 0.5s;
            }
            &::after {
              content: '';
              position: absolute;
              width: 0%;
              height: 2px;
              background: linear-gradient(to left, #ffb7c5, #ca3555);
              transition: 0.5s;
            }
          }
          .focus {
            &::before {
              top: -5px;
            }
            &::after {
              width: 100%;
            }
          }
        }
        .loginBtn {
          display: block;
          width: 50%;
          height: 50px;
          border-radius: 18px;
          margin-top: 24px;
          border: none;
          background: linear-gradient(to left, #ff8177 0%, #c45658 40%, #a44c53 100%);
          background-size: 200%;
          color: #fff;
          outline: none;
          cursor: pointer;
          transition: 0.5s;
          &:hover {
            background-position: right;
          }
        }
        .bottom-text {
          color: #2f3542;
          margin-top: 60px;
          font-size: 18px;
          text-align: center;
          a {
            color: #ff4757;
          }
        }
        .error-message {
          font-size: 18px;
          color: #ff4757;
        }
      }
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
