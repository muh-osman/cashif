"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { FalkAcceptTerms } from "@/components/falk/accept-terms";
import { FalkSoon } from "@/components/falk/soon";

const FalkAccessContext = createContext({ specialCode: null, reloadAccess: async () => {} });

export function useFalkAccess() {
  return useContext(FalkAccessContext);
}

async function fetchAccess() {
  const response = await fetch("/api/falk/access", { cache: "no-store" });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "تعذر التحقق من صلاحية فالك");
  }

  return data;
}

export function FalkAccessGate({ children }) {
  const [status, setStatus] = useState("loading");
  const [specialCode, setSpecialCode] = useState(null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchAccess()
      .then((data) => {
        if (cancelled) return;

        setSpecialCode(data.specialCode ?? null);
        setError("");

        if (!data.exists) {
          setStatus("soon");
          return;
        }

        if (!data.isAcceptTerms) {
          setStatus("terms");
          return;
        }

        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "تعذر التحقق من صلاحية فالك");
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reloadAccess = () => {
    setStatus("loading");
    setReloadKey((value) => value + 1);
  };

  if (status === "loading") {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-6xl items-center justify-center px-4 pb-6 pt-4 sm:pb-36">
        <Loader2 className="h-10 w-10 animate-spin text-[#174545]" />
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-center text-[#002623] sm:pb-36">
        <p className="text-[#757575]">{error}</p>
        <button
          type="button"
          onClick={reloadAccess}
          className="mt-4 text-sm font-semibold text-[#174545] underline underline-offset-4"
        >
          إعادة المحاولة
        </button>
      </main>
    );
  }

  if (status === "soon") {
    return <FalkSoon />;
  }

  if (status === "terms") {
    return <FalkAcceptTerms onAccepted={reloadAccess} />;
  }

  return (
    <FalkAccessContext.Provider value={{ specialCode, reloadAccess }}>{children}</FalkAccessContext.Provider>
  );
}
