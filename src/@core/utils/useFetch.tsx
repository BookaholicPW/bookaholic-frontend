import { useState } from "react";
import { useSettings } from "../hooks/useSettings";

export default function useFetch<T>() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  const { settings } = useSettings();

  const request = async (
    method: "GET",
    pathname: string,
    headers?: Record<string, string>,
    data?: Record<string, string>,
    options?: RequestInit
  ) => {
    options = options || {};
    options.method = method;
    options.headers = headers || {};
    if (!options.headers["Content-Type"]) {
      options.headers["Content-Type"] = "application/json";
    }
    if (
      !options.headers["Authorization"] &&
      settings.user &&
      settings.user.accessToken
    ) {
      options.headers["Authorization"] = `Bearer ${settings.user.accessToken}`;
    }
    if (data) {
      options.body = JSON.stringify(data);
    }
    setLoading(true);
    try {
      const res = await fetch(pathname, options);
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        setError(new Error(json.message));
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Unknown error"));
      }
    }
    setLoading(false);
  };

  return { loading, error, data, request };
}
