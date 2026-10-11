import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="جاري التحميل">
      <Loader2 className="h-9 w-9 animate-spin text-[#174545]" />
    </div>
  );
}
