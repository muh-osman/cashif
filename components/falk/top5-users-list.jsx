"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Info, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FIXED_REWARDS = ["100%", "60%", "40%", "20%", "10%", "0%", "0%", "0%", "0%", "0%"];

const RANK_STYLES = [
  "bg-[#e6d39c] text-[#174545]",
  "bg-[#d7e4e1] text-[#174545]",
  "bg-[#f3ece2] text-[#8a6a3b]",
];

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
        aria-expanded={expanded}
        className="flex w-full cursor-pointer items-center gap-3 px-5 py-5 text-right"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#174545]/10">
          <Trophy className="h-6 w-6 text-[#174545]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-semibold text-[#002623]">Top {users.length}</span>
          <span className="mt-0.5 block text-sm text-[#757575]">{monthYear}</span>
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-[#174545] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            expanded && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0 overflow-hidden" inert={expanded ? undefined : true}>
          <div
            className={cn(
              "px-4 pb-5 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              expanded ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            )}
          >
            <div className="mb-3 border-t border-[#002623]/10 pt-4">
              <div className="grid grid-cols-4 items-center px-2 text-center text-xs font-medium text-[#757575]">
                <span>الترتيب</span>
                <span>الاسم</span>
                <span>الكود</span>
                <button
                  type="button"
                  onClick={() => setTipOpen((value) => !value)}
                  aria-expanded={tipOpen}
                  className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-full px-2 py-1 hover:bg-[#174545]/8 hover:text-[#174545]"
                >
                  المكافأة
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                  tipOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <p className="min-h-0 overflow-hidden text-xs leading-5 text-[#174545]">
                  <span className="mt-2 block rounded-2xl bg-[#174545]/8 px-3 py-2 text-center">النسبة من قيمة العمولة</span>
                </p>
              </div>
            </div>

            <ul className="space-y-2">
              {users.map((user, index) => (
                <li
                  key={`${user.clientId}-${user.code}`}
                  className="grid grid-cols-4 items-center rounded-2xl bg-[#002623]/[0.04] px-2 py-3 text-center"
                >
                  <span
                    className={cn(
                      "mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
                      RANK_STYLES[index] || "bg-[#174545]/10 text-[#174545]"
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="truncate px-1 text-sm font-semibold text-[#002623]">
                    {formatName(user.clientName)}
                  </span>
                  <span>
                    <span className="inline-block rounded-full border border-[#174545]/20 bg-white px-3 py-1 text-xs font-semibold text-[#174545]">
                      {user.code}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-[#174545]">{FIXED_REWARDS[index] || "0%"}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
