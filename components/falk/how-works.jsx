import { Card, CardContent } from "@/components/ui/card";

export function FalkHowWorks() {
  return (
    <Card className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
      <CardContent className="space-y-4 p-6 text-right">
        <h2 className="text-xl font-semibold text-[#002623]">نحن سعداء لانضمامك إلى فالك!</h2>
        <ul className="list-disc space-y-2 pr-5 text-[15px] leading-relaxed text-[#757575]">
          <li>باستخدام الصورة التسويقية التي تحتوي على كودك الخاص، يمكنك الترويج لخدمة فحص السيارات.</li>
          <li>الكود يمنح العملاء خصم 20%، بينما تحصل أنت على عمولة 10% عن كل عملية حجز تتم باستخدام الكود.</li>
        </ul>
        <h3 className="font-semibold text-[#002623]">كيفية العمل:</h3>
        <ol className="list-decimal space-y-2 pr-5 text-[15px] leading-relaxed text-[#757575]">
          <li>استخدم الصورة والكود للترويج عبر منصاتك الإلكترونية.</li>
          <li>شارك مع جمهورك بأن الكود يتيح لهم خصم 20% عند حجز خدمة فحص السيارات.</li>
          <li>احصل على عمولة 10% عن كل حجز يتم باستخدام كودك.</li>
        </ol>
        <p className="text-[15px] leading-relaxed text-[#757575]">انطلق في الترويج الآن وابدأ في جني الأرباح!</p>
        <p className="font-semibold text-[#002623]">وفالك التوفيق!</p>
      </CardContent>
    </Card>
  );
}
