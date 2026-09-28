import { Card, CardContent } from "@/components/ui/card";

const TERMS = [
  {
    title: "الدفع والرسوم",
    body: "يتم تحديد الرسوم مقابل خدمات الفحص بشكل واضح على الموقع. الدفع يتم عبر بوابة الدفع الإلكترونية، ولن يتم تقديم الخدمة حتى يتم استلام الدفع بالكامل.",
  },
  {
    title: "التزامات العميل",
    body: "تحمل العميل مسؤولية تقديم معلومات دقيقة عن السيارة التي يرغب في فحصها، ويجب أن يلتزم بترتيب موعد الفحص مع المركز المختار وفقاً للإجراءات المحددة.",
  },
  {
    title: "خدمة مخدوم",
    body: "وصف الخدمة: في حال وجدت سيارة للبيع في مدينة الرياض او الدمام وكنت تسكن خارج هاتين المدينين، مركز كاشف يقوم نيابة عنك بحفص السيارة وتصويرها وارسال تقريرها لك، ونساعدك في تأمينها ونقل ملكيتها وشحنها. الخدمة تشمل",
    steps: [
      "حضور صاحب السيارة الى إحدى مراكز كاشف",
      "نقوم بفحص السيارة وتجربتها ميدانيا.",
      "نرسل لك تقرير يظهر لك تفاصيل السيارة بصيغة PDF.",
    ],
    note: "مع العلم يتوفر خدمات إضافية مثل التصوير او الفحص المتنقل برسوم إضافية ويتم تفعيلها حسب الرغبة.",
  },
  {
    title: "الخدمات المضافة",
    body: "يقدم مركز كاشف، بالتعاون مع شركائه، خدمات إضافية بعد إجراء الفحص مثل: نقل ملكية السيارة، تأمين السيارة، وشحن السيارة. تجدر الإشارة إلى أن هذه الخدمات الإضافية تتم من خلال شركائه، وبالتالي فإن مركز كاشف لا يتحمل أي مسؤولية قانونية عن الأخطاء أو التعويضات أو المطالبات المتعلقة بهذه الخدمات.",
  },
];

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          الأحكام والشروط
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
      </div>

      <Card className="mx-auto max-w-3xl rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
        <CardContent className="space-y-4">
          <p className="text-[15px] leading-relaxed text-[#757575]">
            من خلال الوصول إلى هذا الموقع أو استخدامه، فإنك تقر بأنك قد قرأت وفهمت ووافقت على الالتزام بهذه الأحكام والشروط.
          </p>
          <ul className="space-y-4">
            {TERMS.map((item) => (
              <li key={item.title} className="text-[15px] leading-relaxed text-[#757575]">
                <span className="font-semibold text-[#002623]">{item.title}: </span>
                {item.body}
                {item.steps ? (
                  <ol className="mt-2 list-decimal space-y-1 pr-5">
                    {item.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                ) : null}
                {item.note ? <p className="mt-2">{item.note}</p> : null}
              </li>
            ))}
          </ul>
          <p className="text-[15px] leading-relaxed text-[#757575]">
            <span className="font-semibold text-[#002623]">دور مركز كاشف الرئيسي يقتصر على فحص السيارة وإصدار التقرير فقط، </span>
            وبذلك ينتهي دوره الرسمي بمجرد تسليم التقرير للعميل
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
