import { isAxiosError } from "axios";

// Prefer the backend's own message ("City not found"); fall back for network and unexpected errors.
export function getErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    if (!err.response) {
      return "Network error. Check your connection and try again.";
    }

    const detail = err.response.data?.detail;
    if (typeof detail === "string") return detail;
  }

  return fallback;
}
