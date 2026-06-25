"use client";
import React from "react";
import { cn } from "@/lib/utils";
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui";
import { Loader2 } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { assets } from "@/lib/constants";

/**
 * Available variants for empty state display
 */
export type EmptyVariant = "default" | "card" | "page" | "item";

export interface EmptyStateProps {
  /** The display variant - affects layout and styling */
  variant?: EmptyVariant;
  title?: string;
  message?: string;
  /** Text for the primary action button */
  actionLabel?: string;
  /** Callback for the primary action */
  onAction?: () => void;
  /** Text for the secondary action button */
  secondaryActionLabel?: string;
  /** Callback for the secondary action */
  onSecondaryAction?: () => void;
  /** Additional CSS classes to apply */
  className?: string;
  buttonIcon?: React.ReactNode;
  buttonVariant?:
    | "default"
    | "primary"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link"
    | "tertiary";
  secondaryButtonVariant?:
    | "default"
    | "primary"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link";
  itemVariant?: "default" | "outline" | "muted";
  imageSrc?: StaticImageData;
  isLoadingAction?: boolean;
  isLoadingSecondaryAction?: boolean;
  showImage?: boolean;
}

export function EmptyState({
  variant = "default",
  title = "Nothing to see here...",
  message: message = "There are no items to display at the moment.",
  itemVariant = "default",
  actionLabel,
  imageSrc,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  buttonVariant = "primary",
  secondaryButtonVariant = "outline",
  buttonIcon,
  isLoadingAction,
  isLoadingSecondaryAction,
  showImage = true,
}: EmptyStateProps) {
  const renderPage = () => (
    <div className="bg-background flex h-full w-full flex-1 items-center justify-center">
      {renderCard()}
    </div>
  );
  const renderItem = () => (
    <Item
      variant={itemVariant}
      className={cn("mx-auto w-full max-w-md", className)}
    >
      {showImage && (
        <ItemMedia className="size-25" variant="image">
          <Image
            src={imageSrc ?? assets.not_found}
            alt="Empty state"
            className="size-full"
            width={1254}
            height={1254}
          />
        </ItemMedia>
      )}
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        {message && <ItemDescription>{message}</ItemDescription>}
      </ItemContent>
      <ItemActions>
        {onSecondaryAction && secondaryActionLabel && (
          <Button
            className="flex-1"
            onClick={onSecondaryAction}
            variant={secondaryButtonVariant}
            disabled={isLoadingSecondaryAction}
          >
            {isLoadingSecondaryAction ? (
              <Loader2 strokeWidth={2.5} className="h-4 w-4 animate-spin" />
            ) : (
              secondaryActionLabel
            )}
          </Button>
        )}
        {onAction && actionLabel && (
          <Button
            className="flex-1"
            variant={buttonVariant}
            onClick={onAction}
            disabled={isLoadingAction}
          >
            {isLoadingAction ? (
              <Loader2 strokeWidth={2.5} className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {buttonIcon}
                {actionLabel}
              </>
            )}
          </Button>
        )}
      </ItemActions>
    </Item>
  );

  const renderCard = () => (
    <Card
      className={cn(
        "mx-auto flex w-full max-w-md flex-col justify-center rounded-3xl border p-3 text-center shadow-md",
        className,
      )}
    >
      <CardHeader>
        {showImage && (
          <Image
            width={510}
            height={510}
            alt=""
            aria-hidden
            className="mx-auto w-full max-w-[240px] rounded-full p-8"
            loading="eager"
            src={imageSrc ?? assets.not_found}
          />
        )}
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {message && <CardDescription>{message}</CardDescription>}
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        {onSecondaryAction && secondaryActionLabel && (
          <CardAction className="w-full flex-1">
            <Button
              className="w-full"
              onClick={onSecondaryAction}
              variant={secondaryButtonVariant}
              disabled={isLoadingSecondaryAction}
            >
              {isLoadingSecondaryAction ? (
                <Loader2 strokeWidth={2.5} className="h-4 w-4 animate-spin" />
              ) : (
                secondaryActionLabel
              )}
            </Button>
          </CardAction>
        )}
        <CardAction className="flex-1">
          {onAction && actionLabel && (
            <Button
              className="w-full"
              variant={buttonVariant}
              onClick={onAction}
              disabled={isLoadingAction}
            >
              {isLoadingAction ? (
                <Loader2 strokeWidth={2.5} className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {buttonIcon}
                  {actionLabel}
                </>
              )}
            </Button>
          )}
        </CardAction>
      </CardFooter>
    </Card>
  );

  const renderVariant = () => {
    switch (variant) {
      case "card":
        return renderCard();
      case "page":
        return renderPage();

      case "item":
        return renderItem();
      case "default":
      default:
        return renderCard();
    }
  };

  return renderVariant();
}
