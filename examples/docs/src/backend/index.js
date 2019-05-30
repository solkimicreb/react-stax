// a fake backend for the doc examples, to let it work offline too
import Router from "universal-router";
import queryString from "query-string";

const NETWORK_DELAY = 300;

const routes = [
  {
    path: "/pokemons",
    action({ data, query }) {
      return data.filter(item => item.name.indexOf(query.name) !== -1);
    }
  },
  {
    path: "/pokemons/:id",
    action({ data, params }) {
      return data.find(item => item.id == params.id);
    }
  }
];

const router = new Router(routes);

export default function fetch(url) {
  const { pathname, search, hash } = new URL(url);

  const promises = Promise.all([
    import("./data.json"),
    new Promise(resolve => setTimeout(resolve, NETWORK_DELAY))
  ]);

  return promises.then(([data]) => ({
    json: () =>
      router.resolve({
        pathname,
        query: queryString.parse(search),
        hash,
        data: data.default
      })
  }));
}
