import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind class-уудыг нэгтгэх utility function
 * ShadCN UI-д ашиглагдана
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
