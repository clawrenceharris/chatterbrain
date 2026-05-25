"use client";
import { assets } from "@/lib/constants/assets";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function AuthLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page to-primary from-secondary bg-white p-0">
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
type TileProps = {
  children: React.ReactNode;
  className: string;
};
function Tile({ children, className }: TileProps) {
  return (
    <div
      className={cn(
        "text-md absolute z-1 rounded-md bg-black px-5 py-3 font-bold text-nowrap shadow-[2px_4px_12px_0_rgba(0,0,0,0.7)] md:rounded-2xl md:px-8 md:py-6 md:text-5xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
