"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, TriangleAlert, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ReportVideosPage() {
  const params = useParams();
  const cardId = params?.cardId;
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!cardId) return;

    let cancelled = false;

    async function loadVideos() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/reports/videos/${encodeURIComponent(cardId)}`, { cache: "no-store" });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "تعذر تحميل الفيديو");
        }

        const urls = data?.success && Array.isArray(data?.data?.videos) ? data.data.videos.map((video) => video.video_url).filter(Boolean) : [];

        if (!cancelled) setVideos(urls);
      } catch (err) {
        if (!cancelled) {
          setVideos([]);
          setError(err.message || "تعذر تحميل الفيديو");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadVideos();
    return () => {
      cancelled = true;
    };
  }, [cardId]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          فيديو التقرير
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        <p className="text-[#757575]">مقاطع فيديو فحص السيارة الخاصة بتقريرك</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-9 w-9 animate-spin text-[#174545]" />
        </div>
      ) : null}

      {!loading && error ? (
        <div className="mx-auto flex max-w-lg items-start gap-3 rounded-[28px] bg-[#fff7ed] px-4 py-4 text-[#9a3412] shadow-[0_7px_29px_0_rgba(100,100,111,0.12)]">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : null}

      {!loading && !error && videos.length === 0 ? (
        <Card className="mx-auto max-w-lg rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
          <CardContent className="flex flex-col items-center gap-5 py-6 text-center">
            <Video className="h-10 w-10 text-[#174545]" />
            <div className="space-y-2">
              <p className="text-lg font-semibold text-[#002623]">لا يوجد فيديو</p>
              <p className="text-sm leading-relaxed text-[#757575]">لم يتم العثور على مقاطع فيديو مرتبطة بهذا التقرير.</p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {!loading && !error && videos.length > 0 ? (
        <ul className="mx-auto grid max-w-3xl gap-6">
          {videos.map((url) => (
            <li key={url}>
              <Card className="overflow-hidden rounded-[40px] border-none py-0 shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
                <video src={url} controls playsInline className="aspect-video w-full bg-black" />
              </Card>
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
