import { Config, Effect, Schema } from "effect";
import { Pokemon } from "./schemas";
import { FetchError, JsonError } from "./errors";

const config = Config.string("BASE_URL");

const DecodePokemon = Schema.decode(Pokemon);

const fetchRequest = (baseUrl: string) =>
  Effect.tryPromise({
    try: () => fetch(`${baseUrl}/api/v2/pokemon/garchomp/`),
    catch: (): FetchError => new FetchError(),
  });
const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: (): JsonError => new JsonError(),
  });

const getPokemon = Effect.gen(function* () {
  const baseUrl = yield* config;
  const response = yield* fetchRequest(baseUrl);
  if (!response.ok) {
    return yield* new FetchError();
  }

  const json = yield* jsonResponse(response);
  return yield* DecodePokemon(json);
});

const main = getPokemon.pipe(
  Effect.catchTags({
    FetchError: () => Effect.succeed("Fetch error"),
    JsonError: () => Effect.succeed("Json error"),
    ParseError: () => Effect.succeed("Parse error"),
  }),
);

Effect.runPromise(main).then(console.log);
