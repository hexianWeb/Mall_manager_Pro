<template>
  <div class="content">
    <div class="tabs">
      <el-tabs v-model="activeTab" type="card" class="demo-tabs" @tab-change="changeTab" @tab-remove="removeTab">
        <el-tab-pane
          v-for="item in tabsList"
          :key="item.path"
          :label="item.title"
          :name="item.path"
          :closable="item.path !== '/'"
        >
        </el-tab-pane>
      </el-tabs>
    </div>
    <span class="tab-btn">
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
</template>

<script lang="ts" setup name="navList">
import { useCookies } from '@vueuse/integrations/useCookies';
const cookies = useCookies();
const route = useRoute();
const router = useRouter();
const activeTab = ref(route.path);
const tabsList = ref([
  {
    title: '首页',
    path: '/'
  }
]);

/**
 * 添加标签导航
 * @param tab 将要添加的目标 tab
 */
function addTab(tab: any) {
  let isTabExisted = tabsList.value.findIndex((item) => item.path == tab.path) == -1;
  if (isTabExisted) {
    tabsList.value.push(tab);
  }
  cookies.set('TAB_LIST', tabsList.value);
}

/**
 * 根据标签导航跳转页面
 * @param tab 要跳转的 tab
 */
function changeTab(tab: any) {
  activeTab.value = tab;
  router.push(tab);
}

/**
 * 初始化标签导航栏
 * @param tab 要初始化的 tab
 */
function initTabPage() {
  let localTabsList = cookies.get('TAB_LIST');
  if (localTabsList) {
    tabsList.value = localTabsList;
  }
}

/**
 *  根据标签导航栏要跳转的 tab
 * @param tab 要移除的 tab
 */
function removeTab(tab: string) {
  let tabs = tabsList.value;
  if (tab == activeTab.value) {
    tabs.forEach((item, index) => {
      if (tab == item.path) {
        const nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          activeTab.value = nextTab.path;
        }
      }
    });
    tabsList.value = tabsList.value.filter((item) => item.path !== tab);
  }
  cookies.set('TAB_LIST', tabsList.value);
}
initTabPage();
onBeforeRouteUpdate((to) => {
  activeTab.value = to.path;
  addTab({
    title: to.meta.title,
    path: to.path
  });
});
</script>

<style scoped lang="less">
.content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  .tabs {
    align-self: flex-start;
    width: 95%;
  }
  .tab-btn {
    display: flex;
    flex: 0 0 32px;
    height: 32px;
    padding: 0 12px;
    cursor: pointer;
  }
}
</style>
