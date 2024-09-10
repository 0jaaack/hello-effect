import * as Effect from "npm:effect/Effect";

const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
};

Effect.succeed(42);

Effect.fail(new Error("Something went wrong"));

const effectiveDivide = (a: number, b: number): Effect.Effect<number, Error> =>
  b === 0
    ? Effect.fail(new Error("Cannot divide by zero"))
    : Effect.succeed(a / b);

interface User {
  readonly id: number;
  readonly name: string;
}

const getUser = (userId: number): Effect.Effect<User, Error> => {
  const userDatabase: Record<number, User> = {
    1: { id: 1, name: "John Doe" },
    2: { id: 2, name: "Jane Smith" },
  };
  const user = userDatabase[userId];

  return user != null
    ? Effect.succeed(user)
    : Effect.fail(new Error("User not found"));
};

getUser(1);

const log = (message: string) =>
  Effect.sync(() => {
    console.log(message);
  });

log("Hello, World!");

const parse = (input: string) =>
  Effect.try({
    try: () => JSON.parse(input),
    catch: (unknown) => new Error(`something went wrong ${unknown}`),
  });

parse("");

const delay = (message: string) =>
  Effect.promise<string>(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(message);
        }, 2000);
      })
  );

delay("Async operation completed successfully!");

const getTodo = (id: number) =>
  Effect.tryPromise(() =>
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
  );

getTodo(1);
