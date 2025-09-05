import { Config, Data, Effect, Schema } from "effect";

const config = Config.string("BASE_URL");

class Pokemon extends Schema.Class<Pokemon>("Pokemon")({
  id: Schema.Number,
  order: Schema.Number,
  name: Schema.String,
  height: Schema.Number,
  weight: Schema.Number,
}) {}

const DecodePokemon = Schema.decode(Pokemon);

class FetchError extends Data.TaggedError("FetchError")<{}> {}

class JsonError extends Data.TaggedError("JsonError")<{}> {}

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

const program = Effect.gen(function* () {
  const baseUrl = yield* config;
  const response = yield* fetchRequest(baseUrl);
  if (!response.ok) {
    return yield* new FetchError();
  }

  const json = yield* jsonResponse(response);
  return yield* DecodePokemon(json);
});

const main = program.pipe(
  Effect.catchTags({
    FetchError: () => Effect.succeed("Fetch error"),
    JsonError: () => Effect.succeed("Json error"),
    ParseError: () => Effect.succeed("Parse error"),
  }),
);

Effect.runPromise(main).then(console.log);
