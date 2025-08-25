import { toast } from "sonner";

export const handleError = (error: any, navigate?: (path: string) => void) => {
  const res = error?.response;
  const data = res?.data;
  console.log(error)

  const statusCode: number | undefined = data?.status_code ?? res?.status;
  const code: string | undefined = data?.code;
  const details = data?.errors;

  let message: string =
    data?.message ??
    data?.error?.message ??
    error?.message ??
    res?.message ??
    "Something went wrong";

  if (Array.isArray(details) && details.length > 0) {
    const first = details[0];
    if (first?.message && typeof first.message === "string") {
      message = first.message;
    }
  }

  if (!res) {
    if (error?.message === "Network Error") {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error(message);
    }
    return { statusCode, code, message, details };
  }

  const PLAN_CODES = new Set([
    "SUBSCRIPTION_INACTIVE",
    "FEATURE_NOT_AVAILABLE",
    "PLAN_CLIENT_LIMIT_REACHED",
    "PLAN_PROJECT_LIMIT_REACHED",
    "PLAN_AI_LIMIT_REACHED",
  ]);

  toast.error(message);

  if (PLAN_CODES.has(code as string)) {
    navigate?.("/pricing");
  }
  return { statusCode, code, message, details };
};
