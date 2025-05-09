// src/components/XyrlanTableProvider.tsx
import { HeroUIProvider } from "@heroui/system";
import { PropsWithChildren } from "react";

export const XyrlanTableProvider = ({ children }: PropsWithChildren) => {
  return <HeroUIProvider>{children}</HeroUIProvider>;
};
