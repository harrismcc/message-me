import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export * from "./button";
export * from "./input";
export * from "./breadcrumb";
export * from "./scroll-area";
export * from "./dropdown-menu";
export * from "./context-menu";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
