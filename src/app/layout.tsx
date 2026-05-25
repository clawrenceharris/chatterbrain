import type { Metadata } from "next";
import { Dongle, Lexend_Deca } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";

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
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dongle.variable} ${lexendDeca.variable} font-body antialiased`}
    >
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
