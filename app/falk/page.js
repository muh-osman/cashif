import { Handshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FALK_PARAGRAPHS, FALK_TITLE } from "@/data/falk";

export default function FalkPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          فالك
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        <p className="text-[#757575]">{FALK_TITLE}</p>
      </div>

      <Card className="mx-auto max-w-3xl rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
        <CardContent className="space-y-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#174545]/10">
            <Handshake className="h-7 w-7 text-[#174545]" />
          </span>
          {FALK_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph} className="text-[15px] leading-relaxed text-[#757575]">
              {paragraph}
            </p>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
