# Vue3 + TS 实战商城后台管理系统开发

> 作者 hexianWeb

此项目是对 网易云课堂 [Vue3 实战商城后台管理系统开发](https:/study.163.com/course/introduction/1212775807.htm?inLoc=lmxq_sjlm_400000001334002_480000004203012&share=1&shareId=1390841715) 的一次全面改进。
对我来说，这是 **Vue3 实战商城后台管理系统开发** 是一个很好的项目，仅仅存在一些很小的瑕疵！这些应该都是老师为了照顾技术还没有那么成熟的学院做出的牺牲！
没有加入 typescript 、tsx 、组件封装功能过少，这些都是我在看这门课时想要去改进的东西。我觉得这是一很好的项目，不应该因为一点点的缺憾而被学员在选择课程时因为 “技术栈不够新” 而从学习计划删除掉！我绝对翻新这门课程的代码，和想要进阶的同学一起看看这个项目的**终极形态**

## 项目概览

本项目基于原帝莎 IT 学院 《 Vue3 实战商城后台管理系统开发》的二次改进与开发。

基于 Vue3 + ElementPlus + Vite + TypeScript + TailwindCss 实战开发商城后台管理系统

其中包括 Vite 的使用，Vue3 全新的`<script setup>`语法，vuex4、Vue-router4、使用 ElementPlus & TailwindCss 库。

后台管理系统包含数据面板、轮播图管理、商品管理、订单管理、会员管理、分类管理、设置等模块。

## 项目演示 (部分页面)

**首页页面**

![主控台](./readme/login.png)

**主控台页面**

![主控台](./readme/首页.png)

**商品页面**

![](./readme/商品页.png)

**优惠券页面**

![](./readme/优惠券.png)

**评论页面**

![](./readme/评论.png)

**权限页面**

![](./readme/权限控制.png)

**订单管理**

![](./readme/订单管理.png)

**图库管理**

![](./readme/图库模块.png)

**评论管理**

![](./readme/评论.png)

## 项目结构

```
├── src
│   ├── api				      # API 接口管理
│   ├── App.vue		      # 项目主组件
│   ├── assets		      # 静态资源文件
│   ├── base-ui		      # 基础样式组件
│   ├── components	    # 业务组件
│   ├── constants			  # 全局配置项
│   ├── directives			# 全局指令文件
│   ├── hooks				    # 常用 Hooks 封装
│   ├── main.ts				  # 项目入口文件
│   ├── router				  # 路由管理
│   ├── service				  # 请求封装
│   ├── stores				  # 全局数据管理
│   ├── utils				    # 常用工具类
│   ├── views				    # 页面视图集
|    |   ├── access				# 权限管理页面
|    |   ├── category			# 分类管理
|    |   ├── comment			# 评论管理
|    |   ├── coupon				# 优惠券管理
|    |   ├── distribution	# 分销管理
|    |   ├── goods 				# 商品管理
|    |   ├── image				# 图库管理
|    |   ├── index				# 主控台
|    |   ├── level				# 会员等级
|    |   ├── login				# 登录页面
|    |   ├── main				  # router View 挂载组件
|    |   ├── manager			# 管理员管理
|    |   ├── not-found		# 404 页面
|    |   ├── notice				# 公告管理
|    |   ├── order				# 订单管理
|    |   ├── role				  # 角色管理
|    |   ├── setting			# 基础设置
|    |   ├── skus				  # 规格管理
|    |   └── user				  # 用户管理
|   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
├── auto-imports.d.ts
├── CHANGELOG.md
├── commitlint.config.js
├── components.d.ts
├── index.html
├── package.json
├── pnpm-lock.yaml
└──  postcss.config.js
```

## 本地开发环境配置

- 克隆项目到本地

```apl
https://github.com/hexianWeb/Mall_manager_Pro.git
```

- 安装依赖

```bash
pnpm install
```

- 本地启动

```basic
pnpm run dev
```

## 最后一些话

当我构建这个商城后台管理系统的时候，我一直怀着一颗开放的心。我希望每个人都能随意使用这个系统，无需拘束，尽情发挥自己的想象力和创意。技术的世界充满了无限的可能性，而我深信，只要我们不断努力，我们的技术将会越来越好。

愿你们在使用这个系统的过程中，能够找到便利和乐趣。愿你们的创意和激情在技术的海洋中迸发出耀眼的光芒。无论你是谁，无论你来自何方，我都衷心祝愿你的技术之旅充满成就和喜悦。

让我们一起探索、学习、创造，共同构建一个更美好的技术世界。前路虽有挑战，但正是这些挑战让我们变得更强大。让我们一起迎接未来，以开放的心态，创造出更多令人惊叹的技术成就！

祝福大家，技术越发展越好！
