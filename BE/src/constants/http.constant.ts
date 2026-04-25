export const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const RESPONSE_CODE = {
  SUCCESS: "success",
  ERROR: "error",
  UNAUTHORIZED: "unauthorized",
  FORBIDDEN: "forbidden",
} as const;

export const RESPONSE_MESSAGE = {
  // Server
  INTERNAL_SERVER_ERROR: "Internal server error",
  // Auth
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_AUTHENTICATED: "User is not authenticated",
  AUTHENTICATED: "User is authenticated",
  LOGOUT_SUCCESS: "User logged out successfully",
  // Account
  EMAIL_ALREADY_IN_USE: "Email already in use",
  ACCOUNT_NOT_FOUND: "Account not found",
  INVALID_PASSWORD: "Invalid password",
  // User
  USER_REGISTER_SUCCESS: "User registered successfully",
  USER_LOGIN_SUCCESS: "Login success",
  USER_PROFILE_UPDATED: "Profile updated successfully",
  // Company
  COMPANY_REGISTER_SUCCESS: "Company registered successfully",
  COMPANY_LOGIN_SUCCESS: "Login success",
  COMPANY_PROFILE_UPDATED: "Profile updated successfully",
  // Job
  NOT_FOUND: "Not found",
  JOB_NOT_FOUND: "Job not found",
  JOB_CREATE_SUCCESS: "Create job successfully",
  JOB_DELETE_SUCCESS: "Job deleted successfully",
  JOB_UPDATE_SUCCESS: "Job updated successfully",
} as const;
