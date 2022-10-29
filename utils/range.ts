import { exists } from "./exists";

export type Range = typeof range;

export function* range(start: number, end?: number) {
  if (exists(end)) {
    if (start > end) {
      throw new Error("RANGE_ERROR: start value must be less than end value.");
    }

    let curr_n = start;

    while (curr_n < end) {
      yield curr_n;
      curr_n += 1;
    }

    return;
  }

  let curr_n = 0;

  while (curr_n < start) {
    yield curr_n;
    curr_n += 1;
  }

  return;
}
