import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

function YoutubeIcon({ className }) {
  return (
    <svg viewBox="0 0 576 512" fill="currentColor" className={className} aria-hidden>
      <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
    </svg>
  );
}

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 448 512" fill="currentColor" className={className} aria-hidden>
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
    </svg>
  );
}

function TiktokIcon({ className }) {
  return (
    <svg viewBox="0 0 448 512" fill="currentColor" className={className} aria-hidden>
      <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
    </svg>
  );
}

function XIcon({ className }) {
  return (
    <svg viewBox="0 0 512 512" fill="currentColor" className={className} aria-hidden>
      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
    </svg>
  );
}

function SnapchatIcon({ className }) {
  return (
    <svg viewBox="0 0 512 512" fill="currentColor" className={className} aria-hidden>
      <path d="M510.846 392.673c-5.211 12.157-27.239 21.089-67.36 27.318-2.064 2.786-3.775 14.686-6.507 23.956-1.625 5.566-5.623 8.869-12.128 8.869l-.297-.005c-9.395 0-19.203-4.323-38.852-4.323-26.521 0-35.662 6.043-56.254 20.588-21.832 15.438-42.771 28.764-74.027 27.399-31.646 2.334-58.025-16.908-72.871-27.404-20.714-14.643-29.828-20.582-56.241-20.582-18.864 0-30.736 4.72-38.852 4.72-8.073 0-11.213-4.922-12.422-9.04-2.703-9.189-4.404-21.263-6.523-24.13-20.679-3.209-67.31-11.344-68.498-32.15a10.627 10.627 0 0 1 8.877-11.069c69.583-11.455 100.924-82.901 102.227-85.934.074-.176.155-.344.237-.515 3.713-7.537 4.544-13.849 2.463-18.753-5.05-11.896-26.872-16.164-36.053-19.796-23.715-9.366-27.015-20.128-25.612-27.504 2.437-12.836 21.725-20.735 33.002-15.453 8.919 4.181 16.843 6.297 23.547 6.297 5.022 0 8.212-1.204 9.96-2.171-2.043-35.936-7.101-87.29 5.687-115.969C158.122 21.304 229.705 15.42 250.826 15.42c.944 0 9.141-.089 10.11-.089 52.148 0 102.254 26.78 126.723 81.643 12.777 28.65 7.749 79.792 5.695 116.009 1.582.872 4.357 1.942 8.599 2.139 6.397-.286 13.815-2.389 22.069-6.257 6.085-2.846 14.406-2.461 20.48.058l.029.01c9.476 3.385 15.439 10.215 15.589 17.87.184 9.747-8.522 18.165-25.878 25.018-2.118.835-4.694 1.655-7.434 2.525-9.797 3.106-24.6 7.805-28.616 17.271-2.079 4.904-1.256 11.211 2.46 18.748.087.168.166.342.239.515 1.301 3.03 32.615 74.46 102.23 85.934 6.427 1.058 11.163 7.877 7.725 15.859z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    name: "Snapchat",
    handle: "cashif_sa",
    href: "https://www.snapchat.com/add/cashif_sa",
    icon: SnapchatIcon,
    iconClass: "bg-[#FFFC00] text-black",
  },
  {
    name: "X",
    handle: "cashif_sa",
    href: "https://x.com/cashif_sa",
    icon: XIcon,
    iconClass: "bg-black text-white",
  },
  {
    name: "Instagram",
    handle: "cashif_sa",
    href: "https://www.instagram.com/cashif_sa",
    icon: InstagramIcon,
    iconClass: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white",
  },
  {
    name: "TikTok",
    handle: "@cashif_sa",
    href: "https://www.tiktok.com/@cashif_sa",
    icon: TiktokIcon,
    iconClass: "bg-black text-white",
  },
  {
    name: "YouTube",
    handle: "@cashifcc",
    href: "https://www.youtube.com/@cashifcc",
    icon: YoutubeIcon,
    iconClass: "bg-[#FF0000] text-white",
  },
  {
    name: "WhatsApp",
    handle: "0920019948",
    href: "https://wa.me/966920019948",
    icon: WhatsAppIcon,
    iconClass: "bg-[#25D366] text-white",
  },
];

export default function SocialMediaPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          تابعنا
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        <p className="text-[#757575]">تابع كاشف على منصات التواصل الاجتماعي</p>
      </div>

      <Card className="mx-auto max-w-md rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
        <CardContent className="flex flex-col gap-2">
          {SOCIAL_LINKS.map((social) => {
            const Icon = social.icon;

            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                dir="ltr"
                className="flex min-h-16 items-center gap-3 rounded-full bg-[#002623]/[0.04] px-2 py-2 text-[#002623] transition-colors hover:bg-[#428177]/15"
              >
                <span className={`flex size-12 shrink-0 items-center justify-center rounded-full ${social.iconClass}`}>
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block text-base font-medium leading-tight">{social.name}</span>
                  <span className="block text-sm text-[#757575]">{social.handle}</span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-[#757575]" />
              </a>
            );
          })}
        </CardContent>
      </Card>
    </main>
  );
}
