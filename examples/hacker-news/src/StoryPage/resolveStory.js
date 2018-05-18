import { params } from "react-easy-stack";
import { fetchFullStory } from "../api";

export default async function resolveStory() {
  return { story: await fetchFullStory(params.id) };
}
