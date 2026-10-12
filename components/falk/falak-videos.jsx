"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function FalkVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/falk/videos", { cache: "no-store" });
        const data = await response.json().catch(() => ({}));
        if (cancelled) return;

        if (!response.ok) {
          throw new Error(data?.message || "تعذر تحميل الفيديوهات");
        }

        setVideos(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        if (!cancelled) {
          toast.error(err.message || "تعذر تحميل الفيديوهات");
          setVideos([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDownload = async (videoId) => {
    setPending((prev) => ({ ...prev, [videoId]: true }));

    try {
      const response = await fetch(`/api/falk/videos/${encodeURIComponent(videoId)}/download`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("تعذر تحميل الفيديو");
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `falak-video-${videoId}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      toast.error(err.message || "تعذر تحميل الفيديو");
    } finally {
      setPending((prev) => ({ ...prev, [videoId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <Card key={index} className="overflow-hidden rounded-[32px] border-none py-0 shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
            <CardContent className="space-y-3 p-4">
              <Skeleton className="h-48 w-full rounded-2xl bg-[#174545]/10" />
              <Skeleton className="h-13 w-full rounded-full bg-[#174545]/10" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <Card className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
        <CardContent className="py-10 text-center text-[#757575]">لا يوجد فيديو حالياً</CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {videos.map((video, index) => {
        const isLastOdd = index === videos.length - 1 && videos.length % 2 === 1;

        return (
          <Card
            key={video.id}
            className={cn(
              "overflow-hidden rounded-[32px] border-none py-0 shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]",
              isLastOdd && "sm:col-span-2 sm:w-full sm:max-w-[calc((100%-1rem)/2)] sm:justify-self-center"
            )}
          >
            <CardContent className="space-y-3 p-4">
              <video src={video.video_url} controls crossOrigin="anonymous" className="h-48 w-full rounded-2xl bg-black object-cover" />
              <Button
                className="w-full cursor-pointer rounded-4xl bg-[#174545] text-white hover:bg-[#174545]/90"
                disabled={pending[video.id]}
                onClick={() => handleDownload(video.id)}
              >
                {pending[video.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : "تحميل"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
