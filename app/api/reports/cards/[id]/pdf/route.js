import { cookies } from "next/headers";
import { fetchWithAuth } from "@/lib/api-url";
import { hasAuthCookieFromStore } from "@/lib/auth";

export async function GET(request, { params }) {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك لتحميل التقرير" }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return Response.json({ message: "رقم التقرير مطلوب" }, { status: 400 });
  }

  const withImages = request.nextUrl.searchParams.get("images") === "1";
  const path = withImages ? `api/CardImages/DownloadPdf/${encodeURIComponent(id)}` : `api/StageReports/${encodeURIComponent(id)}`;

  try {
    const { unauthorized, response } = await fetchWithAuth(cookieStore, path);

    if (unauthorized) {
      return Response.json({ message: "سجّل دخولك لتحميل التقرير" }, { status: 401 });
    }

    if (!response.ok) {
      return Response.json({ message: "تعذر تحميل التقرير" }, { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "application/pdf";

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType.includes("json") ? "application/pdf" : contentType,
        "Content-Disposition": `attachment; filename="card_${id}.pdf"`,
      },
    });
  } catch (error) {
    return Response.json({ message: error.message || "تعذر تحميل التقرير" }, { status: 500 });
  }
}
