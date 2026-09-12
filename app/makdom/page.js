import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "فحص السيارة",
    items: [
      "بعد طلب الخدمة سيصلك رقم الحجز، قم بإرساله لصاحب السيارة",
      "اطلب من صاحب السيارة التوجه الى الفرع المحدد",
      "بعد الانتهاء من الفحص، يتم إرفاق تقرير الفحص عبر الواتساب والموقع الالكتروني",
      "ملاحظة: يظهر التقرير فقط للرقم المسجل أثناء الدفع، ولن يتم عرض التقرير على صاحب السيارة (البائع).",
    ],
  },
  {
    title: "نقل الملكية والتأمين",
    items: ["عند الرغبة بنقل الملكية أو التأمين، سيتم تزويدك برقم المسؤول ويتم النقل بشكل فوري."],
  },
  {
    title: "شحن السيارة",
    items: [
      "شحن السيارة من مدينة الفحص إلى مدينتك بكل سهولة، بالتعاون مع شركة البسامي الدولية للنقليات، دون الحاجة لوجودك.",
      "بعد إكمال الطلب عبر موقعنا الإلكتروني، يمكن لصاحب السيارة التوجه مباشرة إلى شركة البسامي للنقليات.",
      "أو يمكنه الانتظار حتى وصول السطحة التابعة لشركة البسامي للنقليات، لاستلام السيارة وشحنها إلى مدينتك.",
      "ملاحظة: مركز كاشف لا يستلم السيارة من صاحب السيارة.",
    ],
  },
];

const FAQS = [
  {
    q: "هل السعر يشمل الفحص والنقل والشحن؟",
    a: (
      <>
        <p>لا. السعر لا يشمل جميع الخدمات في مبلغ واحد.</p>
        <ul className="mt-3 list-disc space-y-1 pr-4">
          <li>الفحص له سعر مستقل</li>
          <li>نقل الملكية والتأمين خدمة اختيارية بسعر مستقل</li>
          <li>شحن السيارة يتم احتسابه بسعر مستقل حسب المدينة والمسافة</li>
        </ul>
      </>
    ),
  },
  {
    q: "هل يستلم مركز كاشف السيارة من البائع؟",
    a: "لا. مركز كاشف لا يستلم السيارة من صاحبها. يجب على مالك السيارة الحضور بها إلى الفرع المحدد لإجراء الفحص.",
  },
  {
    q: "متى أستلم تقرير الفحص؟",
    a: (
      <>
        <p>بعد الانتهاء من الفحص:</p>
        <ul className="mt-3 list-disc space-y-1 pr-4">
          <li>يصلك التقرير عبر واتساب</li>
          <li>ويمكن تحميله من الموقع في أي وقت</li>
        </ul>
      </>
    ),
  },
  {
    q: "هل يمكنني نقل الملكية والتأمين من خلالكم؟",
    a: "نعم. يتوفر موظف مختص لتسهيل إجراءات نقل الملكية والتأمين عند الرغبة.",
  },
  {
    q: "كيف يتم شحن السيارة؟",
    a: (
      <>
        <p>بعد اكمال الطلب عبر موقعنا الالكتروني:</p>
        <ul className="mt-3 list-disc space-y-1 pr-4">
          <li>يمكن لمالك السيارة التوجه مباشرة إلى شركة البسامي للنقل.</li>
          <li>أو الانتظار حتى وصول السطحة لاستلام السيارة ونقلها الى شركة البسامي.</li>
        </ul>
        <p className="mt-3">تنويه: مركز كاشف لا يستلم السيارة من صاحب السيارة «البائع»</p>
      </>
    ),
  },
];

export default function MakdomPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          خدمة مخدوم
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        <p className="mx-auto max-w-2xl text-[#757575]">
          كاشف يقوم بفحص السيارة بدقة مع تسجيل مرئي وشرح تقرير الفحص بمقطع فيديو مسجل، ويسهّل عليك إجراءات نقل الملكية والتأمين وشحن المركبة.
        </p>
      </div>

      <ul className="grid gap-6 lg:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title}>
            <Card className="h-full rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
              <CardHeader>
                <p className="text-sm text-[#174545]">الخطوة {index + 1}</p>
                <CardTitle className="font-display text-xl text-[#002623]">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal space-y-3 pr-4 text-[#757575]">
                  {step.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <section className="mx-auto mt-12 max-w-3xl">
        <h2 className="mb-6 text-center">
          <span className="font-display relative inline-block text-2xl text-[#002623]">
            الأسئلة الشائعة
            <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
          </span>
        </h2>
        <Accordion className="overflow-hidden rounded-[40px] border-none bg-white shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
          {FAQS.map(({ q, a }, i) => (
            <AccordionItem key={q} value={`faq-${i}`} className="border-b border-gray-200 last:border-b-0">
              <AccordionTrigger
                dir="rtl"
                className="w-full cursor-pointer justify-between px-5 py-4 text-right font-semibold text-[#002623] **:data-[slot=accordion-trigger-icon]:ml-0 **:data-[slot=accordion-trigger-icon]:shrink-0"
              >
                <span className="min-w-0 flex-1">{q}</span>
              </AccordionTrigger>
              <AccordionContent className="px-1 pb-5 text-[15px] leading-relaxed text-[#707171]" dir="rtl">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <div className="mt-10 flex justify-center">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "default", size: "lg" }), "rounded-full bg-[#002623] px-8 py-2 text-white hover:bg-[#1a292e]")}
        >
          أطلب الأن
        </Link>
      </div>
    </main>
  );
}
