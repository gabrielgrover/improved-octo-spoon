"use client";

import { useRouter } from "next/navigation";
import React from "react";

type Props = React.PropsWithChildren<{
  href: string;
}>;

export const DynamicLink: React.FC<Props> = ({ href, children }) => {
  const router = useRouter();

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        router.push(href);
      }}
    >
      {children}
    </a>
  );
};
