"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useOnClickOutside } from "@/hooks";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Button } from "../ui";

export type SearchInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "onChange" | "type"
> & {
  /** Controlled value. If omitted, the SearchBar is uncontrolled. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Called with the next value string. */
  onChange?: (value: string) => void;
  /** Called when the clear button is pressed (in addition to onChange("")). */
  onClear?: () => void;

  /** Optional controlled expansion state. */
  expanded?: boolean;
  /** Called when expanded state changes (click/focus/outside/Escape). */
  onExpandedChange?: (expanded: boolean) => void;

  /** Wrapper classes (controls width + transition). */
  containerClassName?: string;
  /** InputGroup classes. */
  className?: string;
  /** Input element classes. */
  inputClassName?: string;

  /** Tailwind width classes for collapsed/expanded states. */
  collapsedWidthClassName?: string;
  expandedWidthClassName?: string;

  /** If true, outside click collapses the bar. */
  collapseOnOutsideClick?: boolean;
  /** If true, Escape collapses and blurs the input. */
  collapseOnEscape?: boolean;
};

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      onClear,
      expanded,
      onExpandedChange,
      className,
      inputClassName,
      collapseOnOutsideClick = true,
      placeholder = "Search…",
      disabled,
      readOnly,
      ...inputProps
    },
    forwardedRef,
  ) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const shouldFocusOnExpandRef = React.useRef(false);

    const isValueControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      defaultValue ?? "",
    );
    const currentValue = isValueControlled ? value : uncontrolledValue;

    const isExpandedControlled = expanded !== undefined;
    const [uncontrolledExpanded, setUncontrolledExpanded] =
      React.useState(false);
    const isExpanded = isExpandedControlled ? expanded : uncontrolledExpanded;

    const setExpandedState = React.useCallback(
      (next: boolean) => {
        if (!isExpandedControlled) setUncontrolledExpanded(next);
        onExpandedChange?.(next);
      },
      [isExpandedControlled, onExpandedChange],
    );

    const setValueState = React.useCallback(
      (next: string) => {
        if (!isValueControlled) setUncontrolledValue(next);
        onChange?.(next);
      },
      [isValueControlled, onChange],
    );

    const focusInput = React.useCallback(() => {
      inputRef.current?.focus();
    }, []);
    React.useEffect(() => {
      if (
        !isExpanded ||
        disabled ||
        readOnly ||
        !shouldFocusOnExpandRef.current
      )
        return;
      shouldFocusOnExpandRef.current = false;
      requestAnimationFrame(() => {
        focusInput();
      });
    }, [isExpanded, disabled, readOnly, focusInput]);

    const clear = React.useCallback(() => {
      if (disabled || readOnly) return;
      setValueState("");
      onClear?.();
      focusInput();
    }, [disabled, readOnly, setValueState, onClear, focusInput]);
    const collapse = React.useCallback(() => {
      if (currentValue) return;
      setExpandedState(false);
      inputRef.current?.blur();
    }, [setExpandedState, currentValue]);

    useOnClickOutside(
      containerRef,
      () => {
        if (!collapseOnOutsideClick) return;
        collapse();
      },
      "mousedown",
    );

    return (
      <InputGroup
        className={cn("h-full w-full", className)}
        data-disabled={disabled}
      >
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <Search strokeWidth={3} />
          </InputGroupText>
        </InputGroupAddon>

        <InputGroupInput
          {...inputProps}
          ref={(node) => {
            inputRef.current = node;
            if (typeof forwardedRef === "function") forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
          }}
          type="search"
          value={currentValue}
          id="search-bar-input"
          disabled={disabled}
          placeholder={placeholder}
          className={inputClassName}
          onChange={(e) => setValueState(e.target.value)}
        />

        {isExpanded && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              asChild
              aria-label="Clear search"
              title={currentValue ? "Clear search" : "Close search"}
              disabled={disabled || readOnly}
              className="text-muted-foreground"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (currentValue) {
                  clear();
                  return;
                }
                collapse();
              }}
            >
              <Button variant="ghost" size="icon-xs">
                <X strokeWidth={3} />
              </Button>
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    );
  },
);
SearchInput.displayName = "SearchBar";
