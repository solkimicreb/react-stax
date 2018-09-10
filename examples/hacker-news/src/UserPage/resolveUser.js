import { params } from "react-stax";
import { fetchUser } from "../api";

export default async function resolveUser() {
  return { user: await fetchUser(params.id) };
}
