import { is_comment } from "./comment_type_guards";

describe("is_comment", () => {
  it("should return true", () => {
    const maybe_comment = {
      blogId: 1,
      content: "err test 6",
      createdAt: "2022-11-22T05:32:29.506Z",
      id: 20,
      updatedAt: "2022-11-22T05:32:29.506Z",
    };

    expect(is_comment(maybe_comment)).toBe(true);
  });
});
