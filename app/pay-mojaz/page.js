import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PayMojaz } from "@/components/pay-mojaz";
import { getPhoneNumberFromStore, getUserIdFromStore, hasAuthCookieFromStore } from "@/lib/auth";

export const metadata = {
  title: "دفع تقرير موجز | كاشف لفحص السيارات",
  description: "إتمام دفع تقرير موجز.",
};

export default async function PayMojazPage({ searchParams }) {
  const query = await searchParams;
  const lookupType = typeof query.lookup_type === "string" ? query.lookup_type : "";
  const lookupValue = typeof query.lookup_value === "string" ? query.lookup_value : "";
  const mainReportNumber =
    typeof query.main_report_number === "string" ? query.main_report_number : "";

  const cookieStore = await cookies();
  const from = `/pay-mojaz?${new URLSearchParams({
    lookup_type: lookupType,
    lookup_value: lookupValue,
    main_report_number: mainReportNumber,
  }).toString()}`;

  if (!hasAuthCookieFromStore(cookieStore)) {
    redirect(`/login?from=${encodeURIComponent(from)}`);
  }

  const userId = getUserIdFromStore(cookieStore);
  if (!userId) {
    redirect(`/login?from=${encodeURIComponent(from)}`);
  }

  return (
    <PayMojaz
      lookupType={lookupType}
      lookupValue={lookupValue}
      mainReportNumber={mainReportNumber}
      user={{
        name: cookieStore.get("username")?.value || "",
        phone: getPhoneNumberFromStore(cookieStore),
        userId,
      }}
    />
  );
}
