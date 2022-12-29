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
  PrismaClientUnavailable = "PrismaClientUnavailable",
  Unknown = "Unknown",
  UnrecognizedResponse = "UnrecognizedResponse",
  TokenFailure = "TokenFailure",
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

export const PrismaClientUnavailable = (): BlogError => ({
  message: "PrismaClient is unavailable",
  type: BlogErrorType.PrismaClientUnavailable,
});

export const Unknown = (ext_lib?: BlogError["ext_lib"]): BlogError => ({
  message: "An unknown error occurred",
  type: BlogErrorType.Unknown,
  ext_lib,
});

export const UnrecognizedResponse = (procedure: string): BlogError => ({
  message: `An UnrecognizedResponse for procedure: ${procedure}`,
  type: BlogErrorType.UnrecognizedResponse,
});

export function is_blog_err(val: unknown): val is BlogError {
  const _val = val as BlogError;

  for (const e in BlogErrorType) {
    if (e === _val?.type) {
      return true;
    }
  }

  return false;
}

export const TokenSignFailedError = (reason: string): BlogError => ({
  type: BlogErrorType.TokenFailure,
  message: `Failed to sign token: ${reason}`,
});

export const TokenVerificationError = (reason: string): BlogError => ({
  type: BlogErrorType.TokenFailure,
  message: `Failed to verify token: ${reason}`,
});
