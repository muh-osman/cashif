"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FIXED_REWARDS = ["100%", "60%", "40%", "20%", "10%", "0%", "0%", "0%", "0%", "0%"];

function formatName(fullName) {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/);
  return parts[0] || "—";
}

export function FalkTop5UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [tipOpen, setTipOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/falk/top5", { cache: "no-store" });
        const data = await response.json().catch(() => []);
        if (cancelled) return;

        const list = Array.isArray(data)
          ? data
              .filter((user) => Number(user.monthlyBalance) > 0)
              .sort((a, b) => Number(b.monthlyBalance) - Number(a.monthlyBalance))
          : [];

        setUsers(list);
        setExpanded(list.length > 0);
      } catch {
        if (!cancelled) setUsers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || users.length === 0) return null;

  const monthYear = new Date().toLocaleString("en", { month: "short", year: "numeric" });

  return (
    <Card className="gap-0 overflow-hidden rounded-[40px] border-none py-0 shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] ring-0 [--card-spacing:0px]">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex flex-row-reverse w-full items-center justify-between bg-[#164547] px-5 py-4 text-left text-white"
      >
        <div>
          <p className="text-2xl font-bold">Top {users.length}</p>
          <p className="text-sm text-[#c7dff7]">{monthYear}</p>
        </div>
        <ChevronDown className={cn("h-6 w-6 transition-transform", expanded ? "rotate-0" : "rotate-180")} />
      </button>

      {expanded ? (
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[420px] text-center text-sm">
            <thead className="bg-[#164547] text-white">
              <tr>
                <th className="px-3 py-3 font-semibold">الترتيب</th>
                <th className="px-3 py-3 font-semibold">الاسم</th>
                <th className="px-3 py-3 font-semibold">الكود</th>
                <th className="relative px-3 py-3 font-semibold">
                  <button
                    type="button"
                    className="absolute top-2 right-2"
                    onClick={() => setTipOpen((value) => !value)}
                    aria-label="النسبة من قيمة العمولة"
                  >
                    <Info className="h-4 w-4 text-white" />
                  </button>
                  {tipOpen ? (
                    <span className="absolute top-8 right-2 z-10 whitespace-nowrap rounded-lg bg-black px-2 py-1 text-xs font-normal text-white">
                      النسبة من قيمة العمولة
                    </span>
                  ) : null}
                  المكافأة
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={`${user.clientId}-${user.code}`} className={index % 2 === 0 ? "bg-[#f0f4f9]" : "bg-white"}>
                  <td className="px-3 py-3">{index + 1}</td>
                  <td className="px-3 py-3">{formatName(user.clientName)}</td>
                  <td className="px-3 py-3">
                    <span className="inline-block min-w-[70px] rounded-full border border-[#174545]/30 px-3 py-1 font-semibold text-[#174545]">
                      {user.code}
                    </span>
                  </td>
                  <td className="px-3 py-3">{FIXED_REWARDS[index] || "0%"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      ) : null}
    </Card>
  );
}
