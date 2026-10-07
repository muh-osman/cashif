"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FalkVideos } from "@/components/falk/falak-videos";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

const ITEMS_PER_PAGE = 5;

function BrandIcon({ path }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="h-5 w-5">
      <path d={path} />
    </svg>
  );
}

const X_PATH =
  "M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z";
const SNAPCHAT_PATH =
  "M15.943 11.526c-.111-.303-.323-.465-.564-.599a1.416 1.416 0 0 0-.123-.064l-.219-.111c-.752-.399-1.339-.902-1.746-1.498a3.387 3.387 0 0 1-.3-.531c-.034-.1-.032-.156-.008-.207a.338.338 0 0 1 .097-.1c.129-.086.262-.173.352-.231.162-.104.289-.187.371-.245.309-.216.525-.446.66-.702a1.397 1.397 0 0 0 .069-1.16c-.205-.538-.713-.872-1.329-.872a1.829 1.829 0 0 0-.487.065c.006-.368-.002-.757-.035-1.139-.116-1.344-.587-2.048-1.077-2.61a4.294 4.294 0 0 0-1.095-.881C9.764.216 8.92 0 7.999 0c-.92 0-1.76.216-2.505.641-.412.232-.782.53-1.097.883-.49.562-.96 1.267-1.077 2.61-.033.382-.04.772-.036 1.138a1.83 1.83 0 0 0-.487-.065c-.615 0-1.124.335-1.328.873a1.398 1.398 0 0 0 .067 1.161c.136.256.352.486.66.701.082.058.21.14.371.246l.339.221a.38.38 0 0 1 .109.11c.026.053.027.11-.012.217a3.363 3.363 0 0 1-.295.52c-.398.583-.968 1.077-1.696 1.472-.385.204-.786.34-.955.8-.128.348-.044.743.28 1.075.119.125.257.23.409.31a4.43 4.43 0 0 0 1 .4.66.66 0 0 1 .202.09c.118.104.102.26.259.488.079.118.18.22.296.3.33.229.701.243 1.095.258.355.014.758.03 1.217.18.19.064.389.186.618.328.55.338 1.305.802 2.566.802 1.262 0 2.02-.466 2.576-.806.227-.14.424-.26.609-.321.46-.152.863-.168 1.218-.181.393-.015.764-.03 1.095-.258a1.14 1.14 0 0 0 .336-.368c.114-.192.11-.327.217-.42a.625.625 0 0 1 .19-.087 4.446 4.446 0 0 0 1.014-.404c.16-.087.306-.2.429-.336l.004-.005c.304-.325.38-.709.256-1.047Z";
const TIKTOK_PATH =
  "M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z";
const INSTAGRAM_PATH =
  "M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z";
const TELEGRAM_PATH =
  "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09";

function ShareIcon({ children, label, onClick, className = "" }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white transition-opacity hover:opacity-85 ${className}`}
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
                dir="rtl"
                className="relative flex justify-center overflow-hidden rounded-3xl text-center font-black"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image_data} alt={post.title || `cashif ${globalIndex + 1}`} className="h-auto w-full max-w-full" />
                <div className="absolute right-4 bottom-4 flex items-center gap-1 rounded-[9px] border-2 border-dashed border-white p-[3px] text-black max-[550px]:right-[7px] max-[550px]:bottom-[6px] max-[550px]:border-none">
                  <p className="rounded-r-md bg-white px-4 text-[32px] leading-normal max-[550px]:px-1.5 max-[550px]:text-2xl">
                    {code}
                  </p>
                  <div className="rounded-l-md bg-white">
                    <p className="px-2 text-base font-semibold max-[550px]:px-1.5 max-[550px]:text-xs">خصم</p>
                    <p className="px-2 text-base font-semibold max-[550px]:px-1.5 max-[550px]:text-xs">%{percent}</p>
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
                  className="bg-black"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(postText)}`, "_blank")}
                >
                  <BrandIcon path={X_PATH} />
                </ShareIcon>
                <ShareIcon
                  label="WhatsApp"
                  className="bg-[#25D366]"
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(postText)}`, "_blank")}
                >
                  <WhatsAppIcon className="h-5 w-5" />
                </ShareIcon>
                <ShareIcon
                  label="Snapchat"
                  className="bg-[#FFFC00] !text-black"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ text: postText }).catch(() => {});
                    } else {
                      window.open("https://www.snapchat.com/", "_blank");
                    }
                  }}
                >
                  <BrandIcon path={SNAPCHAT_PATH} />
                </ShareIcon>
                <ShareIcon label="TikTok" className="bg-black" onClick={() => window.open("https://www.tiktok.com/", "_blank")}>
                  <BrandIcon path={TIKTOK_PATH} />
                </ShareIcon>
                <ShareIcon
                  label="Instagram"
                  className="bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)]"
                  onClick={() => window.open("https://www.instagram.com/", "_blank")}
                >
                  <BrandIcon path={INSTAGRAM_PATH} />
                </ShareIcon>
                <ShareIcon
                  label="Telegram"
                  className="bg-[#229ED9]"
                  onClick={() =>
                    window.open(
                      `https://telegram.me/share/url?url=https://cashif.cc/&text=${encodeURIComponent(postText)}`,
                      "_blank"
                    )
                  }
                >
                  <BrandIcon path={TELEGRAM_PATH} />
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
