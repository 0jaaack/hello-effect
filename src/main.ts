import { Effect } from "effect";

const fetchRequeset = Effect.tryPromise(() =>
  fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
);
const jsonResponse = (response: Response) =>
  Effect.tryPromise(() => response.json());

const main = fetchRequeset.pipe(
  Effect.flatMap(jsonResponse),
  Effect.catchTag("UnknownException", () =>
    Effect.succeed("There was an error"),
  ),
);

Effect.runPromise(main).then(console.log);
