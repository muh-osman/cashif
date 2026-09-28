import { Card, CardContent } from "@/components/ui/card";

const PRIVACY = [
  {
    title: "جمع المعلومات",
    body: "نقوم بجمع المعلومات الشخصية الضرورية لتقديم خدماتنا، بما في ذلك اسم العميل، معلومات الاتصال، تفاصيل السيارة، ومعلومات الدفع.",
  },
  {
    title: "استخدام المعلومات",
    body: "تُستخدم المعلومات التي نجمعها فقط لأغراض تقديم الخدمة، بما في ذلك التنسيق مع مراكز الفحص، إرسال التقارير، ومعالجة عمليات الدفع.",
  },
  {
    title: "من خلال تقديمك لبياناتك الشخصية",
    body: "بما في ذلك رقم الهاتف، فإنك توافق على أن مركز كاشف قد يستخدم هذه المعلومات لأغراض التسويق والتواصل معك بشأن العروض والخدمات الجديدة",
  },
  {
    title: "مشاركة المعلومات",
    body: "نحن لا نشارك معلوماتك الشخصية مع أطراف ثالثة إلا بما يقتضيه تقديم الخدمة، مثل بوابة الدفع أو شركاء الفحص والشحن. يتم التعامل مع جميع المعلومات بسرية تامة وفقاً لمعايير الأمان المتبعة.",
  },
  {
    title: "حماية المعلومات",
    body: "نلتزم باتخاذ كافة التدابير اللازمة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو الكشف عنها أو استخدامها بأي طريقة غير قانونية.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          سياسة الخصوصية
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
      </div>

      <Card className="mx-auto max-w-3xl rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
        <CardContent>
          <ul className="space-y-4">
            {PRIVACY.map((item) => (
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
