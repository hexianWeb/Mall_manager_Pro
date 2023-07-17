# 完善商城项目管理系统

> 作者 何贤

`此处只将部分难点内容实现方案列举出`

## 一、Vue Router 的 动态路由加载

### 为什么要有动态路由加载技术  ？

当用户进入一个后台系统时 ，通常会看到一个`展示信息的界面  `(电视机)，以及一个可以帮助用户浏览不同信息页面的`前端路由 `(遥控器) 。

如果我们不使用动态路由加载技术 ，而是选择将所有路由都注册和加载到单页应用（SPA）中 ，这可能会带来较大的安全隐患 。虽然正常操作流程下用户无法访问没有权限的页面，但仍然存在通过手动输入前端路由来访问未授权页面的风险。这样的情况属实是防君子不防小人了 。

不同用户需要加载不同的路由，在用户登录后，拿到帐号有权限访问的路由，储存在vuex中，再渲染菜单。

此类应用场景通常被笔者称为 `权限控制场景`。

### 权限控制场景解决方案列举

- **前端路由控制**：在 Vue 项目中，可以使用 Vue Router 来管理路由。通过在路由配置中定义每个路由对应的权限，可以在用户访问某个路由之前进行权限验证。如果用户没有相应的权限，则可以将其重定向到登录页面或者显示无权限的提示信息。
- **后端接口权限控制**：在后端服务器上实现权限控制，前端通过调用后端提供的接口进行权限验证。后端可以根据用户的身份和权限信息，在接口中进行验证，如果用户没有相应的权限，则返回相应的错误信息。前端通过处理接口返回的错误信息，进行相应的提示或者页面跳转。
- **动态路由加载**：根据用户的权限动态生成菜单，只显示用户有权限访问的功能模块。前端通过获取用户的权限信息，在菜单组件中进行渲染和显示控制。
- **权限级别控制**：在用户管理和角色管理中，设置不同的权限级别，例如超级管理员、普通管理员和普通用户等。根据用户所属的角色或权限级别，进行不同的权限控制。

这四项技术通常是结合使用的 ，以提供全面的权限控制和安全性 。每个技术都有其特定的作用和优势 ，结合使用可以构建一个完善的权限管理系统 。

这里我只讨论前端部分：

1. 前端路由控制和动态菜单渲染通常是一起使用的 。
   - **前端路由控制通过定义路由的权限要求来限制用户访问特定的页面或功能**
   - **动态菜单渲染则根据用户的权限动态生成菜单 ，只显示用户有权限访问的功能模块 。**
2. 权限级别控制常常与用户管理和角色管理相结合。
   - 通过设置不同的权限级别，如超级管理员、普通管理员和普通用户等，可以在系统中对不同用户进行细粒度的权限控制。用户管理和角色管理模块可以用于管理用户和角色信息，并分配相应的权限。也就是面试官常问的按钮级别的鉴权 。

### 动态路由的实现思路

前面提到的动态路由加载技术，实际上是根据用户的权限动态生成菜单。其前置条件意味着用户端需要在某一时刻获取权限对应的路由表（菜单表）。这一类动作的时机往往被分配在如 **登录成功后** 或**角色切换后** 等。

那么在此之前用户浏览什么呢 ？

这里我们就要明确一点: **并不是所有的菜单都是通过动态路由加载进来的** 。

也就是说我们仍然需要部分**一直存在的前端路由**以支撑监听如登录成功的行为 。 这类路由被笔者称为 `静态路由` (也有人叫公共路由) 。 它们通常被用来注册如 login 、404 、白名单页面等。在用户登录成功后再获取对应的路有菜单注册动态路由，将其做数据持久化存储 (Vuex、Pinia、Localstorage) 。后面的事情就交给 [Vue Router 动态路由](https://router.vuejs.org/zh/guide/advanced/dynamic-routing.html) 中提供的 `addRouter` API 来实现了 。

# 二、实现

## 1、公共路由定义

```js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/* Layout */
import Layout from '../views/layout/Layout'

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
]
export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
```



## 2、获取菜单信息

```js
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress ba
  if (getToken()) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger    afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => { // 拉取user_info
         const roles = res.roles
          store.dispatch("GetMenu").then(data => {
            initMenu(router, data);
          });
          next()
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress ba
})
```



在这里 我们通过在router的beforeEach钩子函数 判断用户是否已经获得角色信息，如果没有，则请求后台获取对应的角色信息，然后通过角色信息再次请求获取对应的菜单列表，获取到菜单列表，然后去格式化菜单列表，使其转换成router数组的结构。

## 3、动态加载路由

```js
import store from '../store'

export const initMenu = (router, menu) => {
  if (menu.length === 0) {
    return
  }
  let menus = formatRoutes(menu);
  // 最后添加
  let unfound = { path: '*', redirect: '/404', hidden: true }
  menus.push(unfound)
  router.addRoutes(menus)
  store.commit('ADD_ROUTERS',menus)
}

export const formatRoutes = (aMenu) => {
  const aRouter = []
  aMenu.forEach(oMenu => {
    const {
      path,
      component,
      name,
      icon,
      childrens
    } = oMenu
    if (!validatenull(component)) {
      let filePath;
      const oRouter = {
        path: path,
        component(resolve) {
          let componentPath = ''
          if (component === 'Layout') {
            require(['../views/layout/Layout'], resolve)
            return
          } else {
            componentPath = component
          }
          require([`../${componentPath}.vue`], resolve)
        },
        name: name,
        icon: icon,
        children: validatenull(childrens) ? [] : formatRoutes(childrens)
      }
      aRouter.push(oRouter)
    }

  })
  return aRoute
}
```

在这里我们把menList转换成routerList因为我们后台返回的数据不是规范的router结构，所以这里需要我们处理一下，如果你们后台返回规范的就不需要处理，然后通过router.addRoutes把后台返回的加入到我们的路由中，并且将其保存在我们的vuex中，需要主要的 如果404组件一定要放在动态路由在后载入。

## 4、渲染菜单

其实这里已经不属于我们的所讲的重点，在这里只需要取出上一步存在`vuex`中的路由信息，并且将其渲染成我们的左侧菜单栏就可以。在这里我们使用了`element-ui`。

```js
<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in permission_routers" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { validatenull } from "@/utils/validate";
import { initMenu } from "@/utils/util";

export default {
  components: { SidebarItem },
  created() {
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar',
      'addRouters'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
```

就这样我们动态加载路由就是实现了，是不是很简单，关键点就是`router.addRoute`方法。下面我就说一下防踩坑点。

# 三、防坑

## 1、关于加载菜单信息的时机

  在此之前我将第二步获取菜单信息放在我的SideBar组件的create函数中，当时我发现也没有什么问题。登录跳转到home界面 左侧菜单也成功渲染，点击菜单进入我们动态加载的路由界面，也没问题。但是当我点击刷新的时候问题来。页面空白 控制台也不报错。当时我就蒙蔽了，什么情况，不是好好的嘛？如果大家也遇到这种这时候大家不要着急，冷静的分析整个流程，就会发现问题的所在。

1、登陆成功跳转home界面，home组件是公共路由，存在的没问题。

2、这时候 sidebar组件create钩子触发，成功获取菜单列表

3、菜单列表转成路由数组，并且加载到router实例中和vuex中

4、sidebar从vuex获取到路由数组渲染菜单  进入我们动态加载页面中，显示正常，这一切看起来没什么问题

5、点击浏览器的刷新按钮、或者F5，页面空白。

原因： 第五步中我们我们浏览器刷新，在spa应用整个vue实例会重新加载，也是说我的vue-router会重新初始化，那么我们之前的动态addRoute就不存在了，但是我们此时访问一个不存在的页面，所以我们的sidebar组件也就不会被访问，那么也无法获取菜单信息，就导致页面空白。所以我们需要把加载菜单信息这一步放在router的全局守卫beforeEach中就可以了。

## 2、关于404组件的位置

大家可以看到

```js
export const initMenu = (router, menu) => {
  if (menu.length === 0) {
    return
  }
  let menus = formatRoutes(menu);
  // 最后添加
  let unfound = { path: '*', redirect: '/404', hidden: true }
  menus.push(unfound)
  router.addRoutes(menus)
  store.commit('ADD_ROUTERS',menus)
}
```

复制

我强调了 404组件一定要放在动态路由组件的最后，不然你刷新动态加载的页面，会跳转到404页面的。
