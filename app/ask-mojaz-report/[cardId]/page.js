import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AskMojazReport } from "@/components/ask-mojaz-report";
import { getPhoneNumberFromStore, getUserIdFromStore, hasAuthCookieFromStore } from "@/lib/auth";

export const metadata = {
  title: "طلب تقرير موجز | كاشف لفحص السيارات",
  description: "اطلب تقرير موجز لتاريخ السيارة الكامل.",
};

export default async function AskMojazReportPage({ params }) {
  const { cardId } = await params;
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    redirect(`/login?from=${encodeURIComponent(`/ask-mojaz-report/${cardId}`)}`);
  }

  const userId = getUserIdFromStore(cookieStore);
  if (!userId) {
    redirect(`/login?from=${encodeURIComponent(`/ask-mojaz-report/${cardId}`)}`);
  }

  return (
    <AskMojazReport
      cardId={cardId}
      user={{
        name: cookieStore.get("username")?.value || "",
        phone: getPhoneNumberFromStore(cookieStore),
        userId,
      }}
    />
  );
}
