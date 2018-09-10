import { params } from "react-stax";
import { fetchFullStory } from "../api";

export default async function resolveStory() {
  return { story: await fetchFullStory(params.id) };
}
