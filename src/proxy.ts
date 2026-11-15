import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { REGION_COOKIE, regionModeFor } from "@/lib/consent-region";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);
  const mode = regionModeFor(request.headers.get("x-vercel-ip-country"));
  response.cookies.set(REGION_COOKIE, mode, { path: "/", sameSite: "lax" });
  return response;
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
