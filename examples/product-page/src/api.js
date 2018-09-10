import axios from "axios";
import { startLoading, stopLoading } from "./Loader";
import { notify } from "./Notification";
import { pick, defaults } from "lodash";
import { storage } from "react-stax";

defaults(storage, {
  cache: {}
});

const api = axios.create({
  baseURL: "https://freebie-server.sloppy.zone/api/",
  timeout: 5000,
  headers: {
    token: storage.token,
    "Content-Type": "application/json"
  }
});

// TODO: it should handle errors, replace this with a counter
api.interceptors.request.use(config => {
  startLoading();
  return config;
});

api.interceptors.response.use(
  response => {
    stopLoading();
    return response;
  },
  error => {
    stopLoading();
    notify(`Error: ${JSON.stringify(error.response.data)}`);
    throw error;
  }
);

export async function search(filter) {
  const { data } = await api.get("/products", {
    params: { search: filter }
  });
  storage.cache[filter] = data.products;
  return data.products;
}

export async function fetchProduct(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

export async function saveProduct(product) {
  const { data } = await api.post("/products", product);
  return data;
}

export async function editProduct(id, product) {
  const { data } = await api.put(`/products/${id}`, product);
  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}

export async function login(loginData) {
  loginData = pick(loginData, ["email", "pass"]);
  const { data } = await api.post("/users/login", loginData);
  api.defaults.headers.token = data.token;
  storage.token = data.token;
  return data.user;
}

export function isLoggedIn() {
  return storage.token !== undefined;
}

export function logout() {
  delete api.defaults.headers.token;
  delete storage.token;
}

export async function register(registerData) {
  await api.post("/users/register", registerData);
  return login(registerData);
}
