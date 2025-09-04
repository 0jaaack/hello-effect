import { Data, Effect } from "effect";

class FetchError extends Data.TaggedError("FetchError")<{}> {}

class JsonError extends Data.TaggedError("JsonError")<{}> {}

const fetchRequeset = Effect.tryPromise({
  try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
  catch: (): FetchError => new FetchError(),
});
const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: (): JsonError => new JsonError(),
  });

const main = fetchRequeset.pipe(
  Effect.filterOrFail(
    (response) => response.ok,
    () => new FetchError(),
  ),
  Effect.flatMap(jsonResponse),
  Effect.catchTags({
    FetchError: () => Effect.succeed("Fetch error"),
    JsonError: () => Effect.succeed("Json error"),
  }),
);

Effect.runPromise(main).then(console.log);
