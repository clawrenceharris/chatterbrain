import type { Metadata } from "next";
import { Dongle, Lexend_Deca } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { prefetchAuthenticatedAppData } from "@/lib/queries/prefetchAuthenticatedAppData";
import { UserProvider } from "@/components/providers/user-provider";
import { Toaster } from "@/components/ui";

const dongle = Dongle({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "700"],
});

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Chatterbrain",
  description:
    "Your safe space to practice social skills and demystify social settings ",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  let initialUser: User | null | undefined;

  try {
    initialUser = await prefetchAuthenticatedAppData(queryClient);
  } catch (error) {
    console.error("[RootLayout] prefetchAuthenticatedAppData failed:", error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${dongle.variable} ${lexendDeca.variable} font-body antialiased`}
      >
        <QueryProvider dehydratedState={dehydratedState}>
          <AuthProvider initialUser={initialUser}>
            <UserProvider>{children}</UserProvider>
          </AuthProvider>
        </QueryProvider>

        <Toaster />
      </body>
    </html>
  );
}
