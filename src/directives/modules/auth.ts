/**
 * v-auth
 * 按钮权限指令
 */
import { useUserStore } from '@/stores/modules/login';
import type { Directive, DirectiveBinding } from 'vue';

const auth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    const authStore = useUserStore();
    const currentPageRoles = authStore.getUserInfo?.ruleNames ?? [];
    if (value instanceof Array && value.length) {
      const hasPermission = value.every((item) => currentPageRoles.includes(item));
      if (!hasPermission) el.remove();
    } else {
      if (!currentPageRoles.includes(value)) el.remove();
    }
  }
};

export default auth;
