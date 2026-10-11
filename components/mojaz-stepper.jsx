import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOJAZ_STEPS } from "@/lib/mojaz";

export function MojazStepper({ activeStep = 0 }) {
  return (
    <ol className="flex w-full items-start justify-between gap-2">
      {MOJAZ_STEPS.map((label, index) => {
        const done = index < activeStep;
        const current = index === activeStep;

        return (
          <li key={label} className="relative flex flex-1 flex-col items-center gap-2 text-center">
            {index < MOJAZ_STEPS.length - 1 ? (
              <span
                aria-hidden
                className={cn(
                  "absolute top-4 start-[calc(50%+1.1rem)] h-0.5 w-[calc(100%-2.2rem)]",
                  index < activeStep ? "bg-[#174545]" : "bg-[#d7dddd]"
                )}
              />
            ) : null}
            <span
              className={cn(
                "relative z-10 flex size-8 items-center justify-center rounded-full text-sm font-bold",
                done || current ? "bg-[#174545] text-white" : "bg-[#e8ecec] text-[#747a79]"
              )}
            >
              {done ? <Check className="size-4" strokeWidth={3} /> : index + 1}
            </span>
            <span className={cn("text-xs font-semibold leading-5", done || current ? "text-[#174545]" : "text-[#747a79]")}>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
