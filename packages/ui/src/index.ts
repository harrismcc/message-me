import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export * from "./button";
export * from "./input";
export * from "./breadcrumb";
export * from "./scroll-area";
export * from "./dropdown-menu";
export * from "./context-menu";
export * from "./card";
export * from "./textarea";
export * from "./aspect-ratio";
export * from "./dialog";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
