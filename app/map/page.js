import Link from "next/link";
import { Fragment } from "react";
import { connection } from "next/server";
import { Card, CardContent } from "@/components/ui/card";
import { groupSitePagesByCategory, listSitePages } from "@/lib/site-pages";

export default async function MapPage() {
  await connection();
  const pages = listSitePages();
  const groups = groupSitePagesByCategory(pages);

  let rowNumber = 0;

  return (
    <main dir="ltr" className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          خريطة الصفحات
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        <p dir="rtl" className="text-lg text-[#002623]">
          {pages.length} صفحة. أي ملف page.js جديد داخل مجلد التطبيق يظهر هنا تلقائيًا.
        </p>
      </div>

      <Card className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
            <thead>
              <tr className="border-b border-[#e6d39c] text-[#002623]">
                <th className="px-3 py-3 font-semibold">#</th>
                <th className="px-3 py-3 font-semibold">المسار</th>
                <th className="px-3 py-3 font-semibold">الملف</th>
                <th className="px-3 py-3 font-semibold">النوع</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <Fragment key={group.category}>
                  <tr className="bg-[#f7f4ea]">
                    <td colSpan={4} className="px-3 py-3 font-semibold text-[#002623]">
                      {group.category}
                    </td>
                  </tr>
                  {group.pages.map((page) => {
                    rowNumber += 1;
                    return (
                      <tr key={page.file} className="border-b border-[#002623]/10 last:border-b-0">
                        <td className="px-3 py-3 text-[#757575]">{rowNumber}</td>
                        <td className="px-3 py-3">
                          {page.dynamic ? (
                            <span className="font-medium text-[#002623]">{page.href}</span>
                          ) : (
                            <Link href={page.href} className="font-medium text-[#174545] underline-offset-4 hover:underline">
                              {page.href}
                            </Link>
                          )}
                        </td>
                        <td className="px-3 py-3 text-[#757575]">{page.file}</td>
                        <td className="px-3 py-3 text-[#757575]">{page.dynamic ? "ديناميكية" : "ثابتة"}</td>
                      </tr>
                    );
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
}
