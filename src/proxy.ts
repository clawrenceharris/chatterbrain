import { type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}
export const config = {
  matcher: [
    "/home",
    "/domains/:path*",
    "/encounters/:path*",
    "/scenarios/:path*",
    "/actors/:path*",
    "/library/:path*",
    "/user/:path*",
    "/onboarding",
    "/account/:path*",
    "/settings/:path*",
    "/api/:path*",
  ],
};
