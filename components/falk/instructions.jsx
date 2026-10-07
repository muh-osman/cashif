import { Card, CardContent } from "@/components/ui/card";

export function FalkInstructions() {
  return (
    <Card className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
      <CardContent className="space-y-5 p-6 text-right">
        <h2 className="text-xl font-semibold text-[#002623]">تعليمات هامه قبل نشر المحتوى:</h2>

        <div>
          <h3 className="mb-2 font-semibold text-[#002623]">أولاً: التأكد من صحة المعلومات</h3>
          <ul className="list-disc space-y-1.5 pr-5 text-[14px] leading-relaxed text-[#757575]">
            <li>تأكد من صحة جميع المعلومات التي تذكرها في المقطع.</li>
            <li>{"اقرأ قسم 'معلومات عن كاشف' بشكل جيد قبل بدء بالتصوير."}</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-[#002623]">ثانيا: تعليمات التصوير والمحتوى</h3>
          <ul className="list-disc space-y-1.5 pr-5 text-[14px] leading-relaxed text-[#757575]">
            <li>عدم تصوير مركز الفحص وهو فارغ (يفضل يظهر فيه حركة عمل طبيعية).</li>
            <li>التنسيق مع مدير الفرع لتهيئة المكان للتأكد من نظافة بيئة التصوير وعدم وجود أي فوضى أو أدوات غير مرتبة.</li>
            <li>إبلاغ مدير الفرع قبل بدء التصوير لتهيئة الفنيين في مواقعهم.</li>
            <li>عدم الطلب من العامليين داخل صالات الفحص بالظهور أو الحديث اثناء التصوير</li>
            <li>عدم تصوير الفنيين بشكل مباشر اثناء أداء عملهم مما يظهر هوياتهم</li>
            <li>عدم تصوير العملاء أو سيارتهم الخاصة اثناء الفحص بشكل واضح الا بعد اخذ الاذن منهم</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-[#002623]">ثالثا: تعليمات تحسين ظهور الفيديو في البحث (هامة جداً):</h3>
          <ul className="list-disc space-y-1.5 pr-5 text-[14px] leading-relaxed text-[#757575]">
            <li>
              إضافة هاشتاقات في وصف الفيديو: <span className="font-semibold text-[#002623]">#كاشف #فحص_سيارات</span>
            </li>
            <li>تثبيت كود الخصم في الفيديو بشكل واضح</li>
            <li>
              في وصف الفيديو قم بتضمين المعلومات التالية:
              <ul className="mt-2 list-disc space-y-1 pr-5">
                <li>{"كتابة وصف يحتوي بشكل طبيعي على كلمة 'كاشف' و'فحص سيارات'."}</li>
                <li>مثال: تجربتي اليوم مع مركز كاشف لفحص السيارات</li>
                <li>قم بوضع كود الخصم واذكر أماكن الفروع ورابط الموقع الالكتروني</li>
              </ul>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
