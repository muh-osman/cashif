"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MakdomDrawer } from "@/components/makdom-drawer";

export default function MakdomPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  function handleOpenChange(nextOpen) {
    setOpen(nextOpen);
    if (!nextOpen) {
      router.replace("/");
    }
  }

  return <MakdomDrawer open={open} onOpenChange={handleOpenChange} />;
}
