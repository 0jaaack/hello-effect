import { Effect } from "effect";

const fetchRequeset = Effect.promise(() => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"));
const jsonResponse = (response: Response) => Effect.promise(() => response.json());

const main = Effect.flatMap(
  fetchRequeset,
  jsonResponse
);

Effect.runPromise(main);
