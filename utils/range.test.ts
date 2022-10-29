import { range } from "./range";

describe("range", () => {
  it("should create a range starting at 0 and ending at 3", () => {
    let curr_val = 3;
    for (const i of range(3, 20)) {
      expect(i).toBe(curr_val);
      curr_val += 1;
    }
  });

  it("should create a range from 0 to 100", () => {
    let curr_val = 0;

    for (const i of range(100)) {
      expect(i).toBe(curr_val);
      curr_val += 1;
    }
  });

  it("should not include end point", () => {
    let curr_val = 0;
    for (const i of range(3, 20)) {
      curr_val = i;
    }

    expect(curr_val).toBe(19);

    for (const i of range(100)) {
      curr_val = i;
    }

    expect(curr_val).toBe(99);
  });

  it("should throw if start is greater than end", () => {
    expect(range(10, 9).next).toThrow();
  });
});
