import { validate_and_add_comment } from "./api";

describe("validate_and_add_comment", () => {
  it("should call on_error for content that is not long enough", (done) => {
    const input = {
      content: "a",
      blogId: 1,
    };

    const on_error = () => {
      done();
    };
    const on_success = jest.fn();

    const add_comment = validate_and_add_comment(on_error, on_success);

    add_comment(input);
  });
});
