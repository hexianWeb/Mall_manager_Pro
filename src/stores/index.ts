import { setupUser } from './modules/login';

const pinia = createPinia();
export function setupStore() {
  setupUser();
}
export default pinia;
