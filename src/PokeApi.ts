import { Context, Effect, ParseResult } from "effect";
import { Pokemon } from "./schemas";
import { FetchError, JsonError } from "./errors";
import { ConfigError } from "effect/ConfigError";

export interface PokeApi {
  readonly getPokemon: Effect.Effect<
    typeof Pokemon.Type,
    FetchError | JsonError | ParseResult.ParseError | ConfigError
  >;
}

export const PokeApi = Context.GenericTag<PokeApi>("PokeApi");
