import { Config, Context, Effect, ParseResult, Schema } from "effect";
import { Pokemon } from "./schemas";
import { FetchError, JsonError } from "./errors";
import { ConfigError } from "effect/ConfigError";

export interface PokeApiImpl {
  readonly getPokemon: Effect.Effect<
    typeof Pokemon.Type,
    FetchError | JsonError | ParseResult.ParseError | ConfigError
  >;
}

export class PokeApi extends Context.Tag("PokeApi")<PokeApi, PokeApiImpl>(){
  static readonly Live = PokeApi.of({
    getPokemon: Effect.gen(function* () {
      const baseUrl = yield* Config.string("BASE_URL");
      const response = yield* Effect.tryPromise({
        try: () => fetch(`${baseUrl}/api/v2/pokemon/garchomp/`),
        catch: (): FetchError => new FetchError(),
      });

      if (!response.ok) {
        return yield* new FetchError();
      }

      const json = yield* Effect.tryPromise({
        try: () => response.json(),
        catch: (): JsonError => new JsonError(),
      });

      return yield* Schema.decode(Pokemon)(json);
    }),
  });
};

