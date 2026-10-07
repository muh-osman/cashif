import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CONTACT_BRANCHES } from "@/data/contact";

function branchMaps(branchId) {
  return CONTACT_BRANCHES.find((branch) => branch.id === branchId)?.maps || "/branches";
}

export function FalkInfoAboutCashif() {
  return (
    <Card className="rounded-[40px] border-none py-0 shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
      <CardContent className="space-y-5 p-6 text-right">
        <h2 className="text-xl font-semibold text-[#002623]">معلومات عن كاشف:</h2>

        <div>
          <h3 className="mb-2 font-semibold text-[#002623]">من هو كاشف؟</h3>
          <ul className="list-disc space-y-1.5 pr-5 text-[14px] leading-relaxed text-[#757575]">
              <li>كاشف هو مركز متخصص في فحص السيارات المستعملة، يقدم فحصاً دقيقاً لحالة السيارة، ويصدر تقريراً شاملاً يساعد العميل على اتخاذ قرار الشراء بثقة واطمئنان.</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-[#002623]">الفئة المستهدفة</h3>
          <ul className="list-disc space-y-1.5 pr-5 text-[14px] leading-relaxed text-[#757575]">
              <li>الأفراد المتواجدون في الرياض، جدة، القصيم، الدمام، وخميس مشيط، والراغبون في شراء سيارة مستعملة، ويبحثون عن فحص شامل يكشف الحالة الفعلية للمركبة قبل اتخاذ قرار الشراء.</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-[#002623]">مالذي يميز كاشف عن غيره؟</h3>
          <ul className="list-disc space-y-1.5 pr-5 text-[14px] leading-relaxed text-[#757575]">
              <li>خبرة تفوق 12 عاما في فحص السيارات</li>
              <li>استخدام أحدث الأجهزة والتقنيات</li>
              <li>فنيين ذات كفاءة عالية</li>
              <li>تقارير دقيقة وموثوقة تُعد بصيغتيها الورقية والإلكترونية</li>
              <li>إمكانية حجز الموعد والدفع الإلكتروني بكل سهولة، مع خيار الدفع بالتقسيط</li>
              <li>تحميل تقرير الفحص من الموقع الإلكتروني في أي وقت دون الحاجة لمراجعة الفرع</li>
              <li>نظام نقاط مكافآت مع كل زيارة يمكن استبدالها بخصومات</li>
              <li>نقدم ضماًنا على سلامة وصحة نتائج تقارير الفحص</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-[#002623]">أماكن فروع كاشف؟</h3>
          <ul className="space-y-2">
              <li>
                <a
                  href={branchMaps("qadisiyah")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[14px] leading-relaxed text-[#174545] underline-offset-4 hover:underline"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-[#174545]" />
                  <span>الرياض – القادسية</span>
                </a>
              </li>
              <li>
                <a
                  href={branchMaps("shifa")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[14px] leading-relaxed text-[#174545] underline-offset-4 hover:underline"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-[#174545]" />
                  <span>الرياض – الشفا</span>
                </a>
              </li>
              <li>
                <a
                  href={branchMaps("jeddah")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[14px] leading-relaxed text-[#174545] underline-offset-4 hover:underline"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-[#174545]" />
                  <span>جدة – الجوهرة</span>
                </a>
              </li>
              <li>
                <a
                  href={branchMaps("dammam")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[14px] leading-relaxed text-[#174545] underline-offset-4 hover:underline"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-[#174545]" />
                  <span>الدمام - ضاحية الملك فهد</span>
                </a>
              </li>
              <li>
                <a
                  href={branchMaps("qassim")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[14px] leading-relaxed text-[#174545] underline-offset-4 hover:underline"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-[#174545]" />
                  <span>القصيم - شارع قرطبة</span>
                </a>
              </li>
              <li>
                <a
                  href={branchMaps("khamis")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[14px] leading-relaxed text-[#174545] underline-offset-4 hover:underline"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-[#174545]" />
                  <span>خميس مشيط</span>
                </a>
              </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-[#002623]">خدمات كاشف الأساسية</h3>
          <ul className="list-disc space-y-1.5 pr-5 text-[14px] leading-relaxed text-[#757575]">
              <li>فحص الشراء: فحص جميع أجزاء المركبة المستعملة لمعرفة واكتشاف الأعطال والعيوب قبل اتخاذ قرار الشراء مع إمكانية اختيار باقات متنوعة تناسب العميل</li>
              <li>فحص المسافر: التأكد من سلامة السيارة على الطريق، يشمل أهم الفحوصات التي تضمن رحلة آمنة ومريحة</li>
              <li>خدمة مخدوم : في حال وجدت سيارة للبيع في الرياض، جدة، القصيم، الدمام أو خميس مشيط، يتولى مركز كاشف إجراء فحص شامل ودقيق للسيارة بالنيابة، دون الحاجة إلى السفر لمعاينتها، مما يساهم في تقليل التكاليف. ويتوفر تقرير الفحص عبر الموقع الإلكتروني، مع إمكانية تسهيل إجراءات نقل الملكية والتأمين</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-[#002623]">خدمات كاشف المتاحة عبر الموقع الإلكتروني </h3>
          <ul className="list-disc space-y-1.5 pr-5 text-[14px] leading-relaxed text-[#757575]">
              <li>معرفة الخدمات والتعرف على باقات ونقاط الفحص</li>
              <li>معرفة أسعار الباقات</li>
              <li>توفر وسائل دفع إلكتروني متنوعة</li>
              <li>إمكانية تقسيط مبلغ الفحص عبر شركات الدفع بالتقسيط</li>
              <li>حجز موعد فحص السيارة</li>
              <li>إمكانية استعراض وتحميل تقرير الفحص إلكترونًيا</li>
              <li>إمكانية الاطلاع على رصيد المكافئات المجانية المجاني (نقاط الولاء)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
