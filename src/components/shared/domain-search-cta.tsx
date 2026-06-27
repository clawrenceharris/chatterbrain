import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import { assets } from "@/lib/constants";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "../ui";

type DomainSearchCtaProps = {
  domain: {
    slug: string;
    title: string;
  };
};
export function DomainSearchCta({ domain }: DomainSearchCtaProps) {
  const router = useRouter();
  return (
    <Item
      onClick={() => router.push(`/domains/${domain.slug}`)}
      variant="outline"
      aria-label={`Explore ${domain.title}`}
      tabIndex={0}
      className="max-w-3xl cursor-pointer shadow-xs"
    >
      <ItemMedia
        className="from-primary/10 to-primary/17 via-primary/28 bg-muted relative size-25 shrink-0 overflow-hidden rounded-lg bg-linear-to-b"
        variant="image"
      >
        <div className="bg-primary/15 absolute top-0 left-0 h-[20px] w-[40px] -rotate-6 rounded-full" />
        <div className="bg-primary/10 absolute right-0 -bottom-5 h-[40px] w-[40px] rounded-full" />
        <div className="bg-primary/20 absolute bottom-[5px] -left-5 h-[12px] w-[24px] -rotate-6 rounded-full" />

        <span className="text-primary/60 absolute bottom-[9px] left-[16px]">
          ✦
        </span>
        <span className="text-primary/60 absolute top-[11px] right-[13px]">
          ✦
        </span>
        <Image
          src={assets.rephraser_sticker}
          alt="Chatterbrain mascot holding a book"
          width={100}
          className="z-5 size-full object-contain"
          height={100}
        />
      </ItemMedia>
      <ItemContent className="w-full max-w-md">
        <ItemTitle className="font-heading text-xl">
          Explore{" "}
          <span className="font-medium">&quot;{domain.title}&quot;</span>
        </ItemTitle>
        <ItemDescription>
          Discover and explore related scenarios in this domain for more
          targetted practice.
        </ItemDescription>
      </ItemContent>
      <ItemActions className="justify-end">
        <Button
          size="sm"
          variant="primary"
          className="bg-primary/20 text-primary"
        >
          Let&apos;s Go!
        </Button>
      </ItemActions>
    </Item>
  );
}
