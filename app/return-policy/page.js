import { Card, CardContent } from "@/components/ui/card";

const POLICY = [
  {
    title: "عدم استرجاع الرسوم بعد الفحص",
    body: "بمجرد إتمام الدفع والحضور لمركز الفحص وإجراء الفحص على السيارة، لن يتم استرجاع الرسوم المدفوعة.",
  },
  {
    title: "إعادة الجدولة",
    body: "في حالة عدم تمكن العميل من الحضور في الموعد المحدد، يمكن إعادة جدولة موعد الفحص بشرط إبلاغنا قبل 24 ساعة من الموعد. لا يتم فرض رسوم إضافية على إعادة الجدولة إذا تم الالتزام بالإشعار المسبق.",
  },
  {
    title: "مشكلات الدفع",
    body: "في حال وجود أي خطأ تقني أو مشكلة في الدفع، يتعين على العميل التواصل مع فريق الدعم لحل المشكلة في أسرع وقت ممكن. سيتم معالجة أي استرداد بناءً على قرار الإدارة وفقاً للحالة.",
  },
];

export default function ReturnPolicyPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          الاسترجاع والاستبدال
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
      </div>

      <Card className="mx-auto max-w-3xl rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
        <CardContent className="space-y-4">
          <h2 className="font-display text-2xl text-[#002623]">سياسة الاسترجاع</h2>
          <ul className="space-y-4">
            {POLICY.map((item) => (
              <li key={item.title} className="text-[15px] leading-relaxed text-[#757575]">
                <span className="font-semibold text-[#002623]">{item.title}: </span>
                {item.body}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
