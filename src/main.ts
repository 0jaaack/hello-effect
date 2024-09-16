import { Effect } from "effect";

const getElement = (querySelector: Parameters<Element["querySelector"]>[0]) => {
  const element = document.querySelector(querySelector);
  return element
    ? Effect.succeed(element)
    : Effect.fail(new Error("Element not found"));
};

Effect.runSync(getElement("#board"));
