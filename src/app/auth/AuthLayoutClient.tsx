"use client";
import { ThemeToggle } from "@/components/sidebar";
import { assets } from "@/lib/constants";
import Image from "next/image";

export default function AuthLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page to-primary from-secondary bg-white p-0">
      <ThemeToggle className="absolute top-4 right-4 z-50" />
      <main className="flex flex-col md:flex-row">
        <div className="relative flex-[0.7]">
          <Image
            src={assets.chitterbrain}
            className="absolute bottom-0 left-0 h-auto w-full"
            alt="Chatterbrain Logo"
            width={1254}
            height={1254}
          />
        </div>
        <div className="bg-surface flex h-full w-full flex-1 items-center justify-center md:flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
