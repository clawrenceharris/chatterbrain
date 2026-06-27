import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui";
import { DomainCardResult } from "@/features/domain/application/dto";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type DomainCardProps = {
  domain: DomainCardResult;
  index?: number;
  className?: string;
};

const CLASS_NAMES = [
  "bg-[#e7f7ff]",
  "bg-[#f0e7ff]",
  "bg-[#ddfbf3]",
  "bg-[#fff3d9]",
  "bg-[#e8f0ff]",
  "bg-[#f6e7ff]",
  "bg-[#e7f7ff]",
  "bg-[#f0e7ff]",
  "bg-[#ddfbf3]",
  "bg-[#fff3d9]",
  "bg-[#e8f0ff]",
  "bg-[#f6e7ff]",
  "bg-[#e7f7ff]",
  "bg-[#f0e7ff]",
  "bg-[#ddfbf3]",
];
export function DomainCard({ domain, index = 0, className }: DomainCardProps) {
  if (!domain) return null;
  return (
    <Link
      key={domain.title}
      href={domain.slug ? `/domains/${domain.slug}` : "#"}
    >
      <Item
        className={cn(
          "group relative cursor-pointer gap-3 overflow-hidden shadow-sm transition-all duration-200 hover:-translate-y-0.5",
          CLASS_NAMES[index % CLASS_NAMES.length],
          className,
        )}
      >
        <div className="absolute right-6 -bottom-8 h-24 w-24 rounded-full bg-white/45" />
        <div className="absolute -top-8 right-26 h-20 w-20 rounded-full bg-white/35" />

        <ItemMedia
          variant="image"
          className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/45"
        >
          <Image
            src={domain.imageUrl ?? "#"}
            alt={domain.title}
            width={74}
            height={74}
            className="max-h-16 w-auto object-contain"
          />
        </ItemMedia>

        <ItemContent>
          <ItemTitle className="font-heading text-sm leading-tight font-bold text-black">
            {domain.title}
          </ItemTitle>
          <ItemDescription className="z-5">
            {domain.description}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <span className="relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/80 text-black shadow-[0_3px_10px_rgba(50,50,50,0.15)] transition-transform group-hover:translate-x-0.5">
            <ArrowRight size={16} strokeWidth={3} />
          </span>
        </ItemActions>
      </Item>
    </Link>
  );
}
