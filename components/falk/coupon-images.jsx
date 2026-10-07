"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FalkVideos } from "@/components/falk/falak-videos";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ITEMS_PER_PAGE = 5;

function ShareIcon({ children, label, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#757575] text-white hover:opacity-90"
    >
      {children}
    </button>
  );
}

export function FalkCouponImages({ code, percent }) {
  const overlayRefs = useRef([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/falk/marketing-posts", { cache: "no-store" });
        const data = await response.json().catch(() => ({}));
        if (cancelled) return;

        if (!response.ok) {
          throw new Error(data?.message || "تعذر تحميل المحتوى التسويقي");
        }

        setPosts(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        if (!cancelled) {
          toast.error(err.message || "تعذر تحميل المحتوى التسويقي");
          setPosts([]);
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

  const pageCount = Math.max(1, Math.ceil(posts.length / ITEMS_PER_PAGE));
  const currentPosts = posts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const createPostText = useCallback(
    (index) => {
      const globalIndex = (page - 1) * ITEMS_PER_PAGE + index;
      const title = posts[globalIndex]?.title || "";
      return `${title}
  كود الخصم: ${code}
  https://cashif.cc
  #كاشف_لفحص_السيارات`;
    },
    [code, page, posts]
  );

  const downloadImg = useCallback(
    (index) => {
      const globalIndex = (page - 1) * ITEMS_PER_PAGE + index;
      const node = overlayRefs.current[globalIndex];
      if (!node) return;

      toPng(node, { quality: 1, pixelRatio: 2 })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `coupon-image-${globalIndex + 1}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch(() => {
          toast.error("فشل تحميل الصورة");
        });
    },
    [page]
  );

  if (loading) {
    return (
      <Card className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#174545]" />
        </CardContent>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
        <CardContent className="py-10 text-center text-[#757575]">لا يوجد محتوى تسويقي حالياً</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {currentPosts.map((post, index) => {
        const globalIndex = (page - 1) * ITEMS_PER_PAGE + index;
        const postText = createPostText(index);

        return (
          <Card key={globalIndex} className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
            <CardContent className="space-y-4 p-5">
              <div
                ref={(el) => {
                  overlayRefs.current[globalIndex] = el;
                }}
                className="relative overflow-hidden rounded-3xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image_data} alt={post.title || `cashif ${globalIndex + 1}`} className="w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-10 text-white">
                  <h3 className="text-2xl font-bold tracking-wide">{code}</h3>
                  <div className="rounded-xl bg-[#174545] px-3 py-2 text-center">
                    <p className="text-xs">خصم</p>
                    <p className="text-lg font-bold">%{percent}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-[#002623]/5 p-3">
                <p className="flex-1 whitespace-pre-line text-sm leading-relaxed text-[#757575]">{postText}</p>
                <button
                  type="button"
                  aria-label="تم النسخ"
                  onClick={() => {
                    navigator.clipboard.writeText(postText);
                    toast.success("تم النسخ");
                  }}
                  className="shrink-0 rounded-xl p-2 text-[#174545] hover:bg-white"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <ShareIcon
                  label="X"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(postText)}`, "_blank")}
                >
                  <span className="text-sm font-bold">X</span>
                </ShareIcon>
                <ShareIcon
                  label="WhatsApp"
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(postText)}`, "_blank")}
                >
                  <span className="text-sm font-bold">WA</span>
                </ShareIcon>
                <ShareIcon
                  label="Snapchat"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ text: postText }).catch(() => {});
                    } else {
                      window.open("https://www.snapchat.com/", "_blank");
                    }
                  }}
                >
                  <span className="text-sm font-bold">SC</span>
                </ShareIcon>
                <ShareIcon label="TikTok" onClick={() => window.open("https://www.tiktok.com/", "_blank")}>
                  <span className="text-sm font-bold">TT</span>
                </ShareIcon>
                <ShareIcon label="Instagram" onClick={() => window.open("https://www.instagram.com/", "_blank")}>
                  <span className="text-sm font-bold">IG</span>
                </ShareIcon>
                <ShareIcon
                  label="Telegram"
                  onClick={() =>
                    window.open(
                      `https://telegram.me/share/url?url=https://cashif.cc/&text=${encodeURIComponent(postText)}`,
                      "_blank"
                    )
                  }
                >
                  <span className="text-sm font-bold">TG</span>
                </ShareIcon>
              </div>

              <Button
                className="w-full rounded-4xl bg-[#174545] text-white hover:bg-[#174545]/90"
                onClick={() => downloadImg(index)}
              >
                تحميل
              </Button>
            </CardContent>
          </Card>
        );
      })}

      {pageCount > 1 ? (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setPage(value)}
              className={`h-9 w-9 rounded-full text-sm font-semibold ${
                page === value ? "bg-[#174545] text-white" : "bg-[#002623]/5 text-[#174545]"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      ) : null}

      <FalkVideos />
    </div>
  );
}
