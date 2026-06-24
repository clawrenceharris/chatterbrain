import { type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}
export const config = {
  matcher: [
    "/auth/:path*",
    "/dashboard/:path*",
    "/account/:path*",
    "/settings/:path*",
    "/api/:path*",
  ],
};
