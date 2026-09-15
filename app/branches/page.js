"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Mail, Navigation, Phone } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BRANCH_CITIES, CONTACT_BRANCHES, CONTACT_EMAIL, CONTACT_PHONE } from "@/data/contact";

export default function BranchesPage() {
  const [city, setCity] = useState("الكل");

  const branches = useMemo(() => (city === "الكل" ? CONTACT_BRANCHES : CONTACT_BRANCHES.filter((branch) => branch.city === city)), [city]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          فروعنا
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        <p className="text-[#757575]">ستة فروع في أنحاء المملكة. اختر المدينة، ثم افتح الموقع أو تواصل معنا</p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {BRANCH_CITIES.map((item) => (
          <Button
            key={item}
            type="button"
            size="sm"
            variant={city === item ? "default" : "outline"}
            onClick={() => setCity(item)}
            className={cn(
              "cursor-pointer rounded-full",
              city === item
                ? "border-transparent bg-[#002623] text-white hover:bg-[#1a292e]"
                : "border-[#002623]/15 bg-white text-[#002623] hover:bg-[#002623]/5 hover:text-[#002623]"
            )}
          >
            {item}
          </Button>
        ))}
      </div>

      <p className="mb-4 text-sm text-[#757575]">
        {branches.length} {branches.length === 1 ? "فرع" : "فروع"}
      </p>

      <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {branches.map((branch) => (
          <li key={branch.id}>
            <Card
              size="sm"
              className="h-full rounded-[40px] border-none pt-0 shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[40px]">
                <Image src={branch.image} alt={branch.name} fill sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>

              <CardHeader>
                <CardTitle className="text-lg text-[#002623]">{branch.name}</CardTitle>
                <CardDescription className="text-[#757575]">
                  {CONTACT_EMAIL} · {CONTACT_PHONE}
                </CardDescription>
              </CardHeader>

              <CardFooter className="mt-auto gap-2">
                <a
                  href={branch.maps}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ variant: "default", size: "lg" }), "flex-1 rounded-full bg-[#002623] py-2 text-white hover:bg-[#1a292e]")}
                >
                  <Navigation data-icon="inline-start" />
                  الموقع
                </a>
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className={cn(buttonVariants({ variant: "outline", size: "icon-lg" }), "border-[#002623]/15 text-[#002623] hover:bg-[#002623]/5")}
                  aria-label="اتصال"
                >
                  <Phone />
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className={cn(buttonVariants({ variant: "outline", size: "icon-lg" }), "border-[#002623]/15 text-[#002623] hover:bg-[#002623]/5")}
                  aria-label="بريد"
                >
                  <Mail />
                </a>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </main>
  );
}
