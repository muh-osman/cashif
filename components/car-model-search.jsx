"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// TODO: replace with real data
const CAR_MODELS = [
  { id: 1, nameAr: "كامري", nameEn: "Camry", manufacturerAr: "تويوتا", manufacturerEn: "Toyota" },
  { id: 2, nameAr: "سوناتا", nameEn: "Sonata", manufacturerAr: "هيونداي", manufacturerEn: "Hyundai" },
  { id: 3, nameAr: "التيما", nameEn: "Altima", manufacturerAr: "نيسان", manufacturerEn: "Nissan" },
  { id: 4, nameAr: "أكورد", nameEn: "Accord", manufacturerAr: "هوندا", manufacturerEn: "Honda" },
];

const PLACEHOLDERS = ["أسعار الفحص...", "كامري | تويوتا", "أكورد | هوندا", "التيما | نيسان"];

export function CarModelSearch({ className }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (selected) return;

    const interval = setInterval(() => {
      setIsTransitioning(true); // start exit animation (old text slides down)

      setTimeout(() => {
        setCurrentPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setIsTransitioning(false); // start enter animation (new text slides down from above)
      }, 300); // must match exit animation duration below
    }, 3000); // change every 3 seconds

    return () => clearInterval(interval);
  }, [selected]);

  function handleSelect(model) {
    setSelected(model);
    setOpen(false);
    router.push(`/dashboard/prices?modelId=${model.id}`);
  }

  return (
    <div className="flex w-full justify-center">
      {/* Keyframes for the placeholder slide animation */}
      <style>{`
        @keyframes placeholderSlideOutDown {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(16px); opacity: 0; }
        }
        @keyframes placeholderSlideInDown {
          from { transform: translateY(-16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      <Popover open={open} onOpenChange={setOpen} className="w-full sm:w-auto">
        <PopoverTrigger
          className={cn(
            "flex h-16 cursor-pointer items-center justify-between rounded-full border-none bg-[#edebe0] px-6 text-base font-normal text-[#002623] shadow-xl hover:bg-[#edebe0] sm:text-lg",
            "w-[92%] sm:w-full",
            "mx-auto",
            className
          )}
        >
          <span className="flex items-center gap-2 overflow-hidden text-[#757575]">
            <span className="relative flex items-center h-8 min-w-[140px]">
              {/* Placeholder text with slide animation */}
              {!selected && (
                <span
                  key={isTransitioning ? `out-${currentPlaceholderIndex}` : `in-${currentPlaceholderIndex}`}
                  className="absolute inset-0 flex items-center whitespace-nowrap"
                  style={{
                    animation: isTransitioning ? "placeholderSlideOutDown 300ms ease-in forwards" : "placeholderSlideInDown 300ms ease-out forwards",
                  }}
                >
                  {PLACEHOLDERS[currentPlaceholderIndex]}
                </span>
              )}

              {/* Selected value text with animation */}
              <span
                className={cn(
                  "absolute inset-0 flex items-center whitespace-nowrap transition-all duration-300",
                  selected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                )}
              >
                {selected && `${selected.nameAr} - ${selected.nameEn}`}
              </span>
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>

        <PopoverContent dir="rtl" align="center" className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="ابحث بالاسم أو الشركة المصنعة..." />
            <CommandList>
              <CommandEmpty>
                <a
                  href="https://wa.me/966920019948?text=استعلام عن موديل غير موجود"
                  target="_blank"
                  rel="noreferrer"
                  className="block px-4 py-3 text-center text-sm text-[#0b6bcb] underline"
                >
                  لم تجد موديلك؟ تواصل معنا
                </a>
              </CommandEmpty>
              <CommandGroup>
                {CAR_MODELS.map((model) => (
                  <CommandItem
                    key={model.id}
                    value={`${model.nameAr} ${model.nameEn} ${model.manufacturerAr} ${model.manufacturerEn}`}
                    onSelect={() => handleSelect(model)}
                    className="flex items-center"
                  >
                    <Check className={cn("ml-2 h-4 w-4", selected?.id === model.id ? "opacity-100" : "opacity-0")} />
                    <span>
                      {model.nameAr} - {model.nameEn}
                    </span>
                    <span className="mr-2 text-xs text-[#888]">| {model.manufacturerAr}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
