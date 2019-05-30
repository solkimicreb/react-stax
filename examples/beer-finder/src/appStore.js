import { store } from "react-stax";
import * as api from "./api";

const appStore = store({
  beers: [],
  isLoading: false
});

export async function fetchBeers(filter) {
  appStore.isLoading = true;
  appStore.beers = await api.fetchBeers(filter);
  appStore.isLoading = false;
}

export default appStore;
