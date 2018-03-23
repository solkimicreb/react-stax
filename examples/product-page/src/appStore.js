import { store, params } from 'react-easy-stack';
import * as api from './api';

const appStore = store({
  isLoggedIn: api.isLoggedIn(),
  products: [],
  async search(filter) {
    appStore.products = await api.search(filter);
  },
  async resolveProduct() {
    if (!params.id) {
      return { product: {} };
    }
    return { product: await api.fetchProduct(params.id) };
  },
  async saveProduct(product) {
    return api.saveProduct(product);
  },
  async editProduct(id, data) {
    return api.editProduct(id, data);
  },
  async login(loginData) {
    appStore.user = await api.login(loginData);
    appStore.isLoggedIn = true;
  },
  logout() {
    api.logout();
    appStore.isLoggedIn = false;
  },
  async register(registerData) {
    appStore.user = await api.register(registerData);
    appStore.isLoggedIn = true;
  }
});

export default appStore;
