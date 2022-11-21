import * as F from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import { validate_and_add_comment } from "./comment_api";
//import * as TE from "fp-ts/TaskEither";

describe("validate_and_add_comment", () => {
  it("should call on_error for content that is not long enough", (done) => {
    const input = {
      content: "a",
      blogId: 1,
    };

    const add_invalid_comment = F.pipe(
      validate_and_add_comment(input),
      TE.mapLeft(() => {
        done();
      })
    );

    add_invalid_comment();
  });
});
