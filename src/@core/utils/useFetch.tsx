import { appConfig } from "@/configs/schemas";
import { useState } from "react";
import { useSettings } from "../hooks/useSettings";

export default function useFetch<T>() {
  const config = appConfig;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  const { settings } = useSettings();

  const request = async (
    method: "GET" | "POST" | "PUT" | "DELETE",
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
      let url = new URL(config.apiRoot);
      if (pathname.startsWith("http")) {
        url = new URL(pathname);
      } else {
        url.pathname = pathname;
      }
      const res = await fetch(url, options);
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
