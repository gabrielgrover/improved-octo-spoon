import type { Range } from "./range";

export function range_iter(range: ReturnType<Range>) {
  return {
    for_each: (fn: (n: number) => void) => {
      for (const n of range) {
        fn(n);
      }
    },
    map: <T>(fn: (n: number) => T): T[] => {
      const result: T[] = [];

      for (const n of range) {
        result.push(fn(n));
      }

      return result;
    },
  };
}
