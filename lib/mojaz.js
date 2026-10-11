export const MOJAZ_PRICE = 119;

export const MOJAZ_STEPS = ["بيانات المركبة", "الدفع", "تحميل التقرير"];

export const LOOKUP_SEQUENCE = "sequence";
export const LOOKUP_VIN = "vin";

export function isLookupType(value) {
  return value === LOOKUP_SEQUENCE || value === LOOKUP_VIN;
}

export function lookupMaxLength(lookupType) {
  return lookupType === LOOKUP_SEQUENCE ? 10 : 17;
}

export function lookupLabel(lookupType) {
  return lookupType === LOOKUP_SEQUENCE ? "رقم التسلسلي" : "رقم الهيكل";
}

export function buildMojazMoyasarMetadata({
  lookupType,
  lookupValue,
  name,
  phone,
  userId,
  branchNameAr,
  mainReportNumber,
}) {
  return {
    flag: "mojaz",
    lookupType: lookupType || "",
    lookupValue: lookupValue || "",
    name: name || "",
    phone: phone || "",
    userId: userId ? String(userId) : "",
    price: MOJAZ_PRICE,
    email: branchNameAr || null,
    main_report_number: mainReportNumber || "",
  };
}
