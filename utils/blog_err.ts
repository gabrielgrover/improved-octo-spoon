export type BlogError = {
  message: string;
  ext_lib?: {
    name: string;
    lib_message?: string;
  };
  type: BlogErrorType;
};

export enum BlogErrorType {
  AddCommentFailed = "AddCommentFailed",
  GetCommentFailed = "GetCommentFailed",
  InvalidCommentInput = "InvalidCommentInput",
}

export const AddCommentError = (
  message: string,
  ext_lib?: BlogError["ext_lib"]
): BlogError => ({
  message,
  ext_lib,
  type: BlogErrorType.AddCommentFailed,
});

export const GetCommentError = (
  message: string,
  ext_lib?: BlogError["ext_lib"]
): BlogError => ({
  message,
  ext_lib,
  type: BlogErrorType.GetCommentFailed,
});

export const InvalidCommentInputError = (
  ext_lib?: BlogError["ext_lib"]
): BlogError => ({
  message: "Invalid Comment input data",
  ext_lib,
  type: BlogErrorType.InvalidCommentInput,
});
