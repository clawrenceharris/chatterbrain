import type { Metadata } from "next";
import { Cal_Sans, Dongle, Lexend_Deca } from "next/font/google";
import "./globals.css";
import {
  AuthProvider,
  ModalProvider,
  QueryProvider,
  ThemeProvider,
  UserProvider,
} from "@/components/providers";
import { ChitterChatProvider } from "@/features/ai/presentation/providers/chitter-chat-provider";
import { Toaster } from "sonner";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { prefetchAuthenticatedAppData } from "@/lib/queries/prefetchAuthenticatedAppData";
import type { User } from "@supabase/supabase-js";

const dongle = Dongle({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "700"],
});
const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});
const calSans = Cal_Sans({
  subsets: ["latin"],
  variable: "--font-primary-heading",
  weight: "400",
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
        className={`${dongle.variable} ${lexendDeca.variable} ${calSans.variable} font-body antialiased`}
      >
        <QueryProvider dehydratedState={dehydratedState}>
          <AuthProvider initialUser={initialUser}>
            <ThemeProvider>
              <ChitterChatProvider>
                <ModalProvider>{children}</ModalProvider>
              </ChitterChatProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>

        <Toaster />
      </body>
    </html>
  );
}
