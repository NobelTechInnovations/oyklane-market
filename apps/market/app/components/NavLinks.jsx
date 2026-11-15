"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** The nav's links, with the section you're in marked. */
export function NavLinks({ links, className, label = "Browse" }) {
  const path = usePathname() || "/";
  return (
    <nav className={className} aria-label={label}>
      {links.map(([href, text, external]) =>
        external ? (
          <a key={href} href={href}>
            {text}
          </a>
        ) : (
          <Link key={href} href={href} aria-current={path === href || path.startsWith(`${href}/`) ? "page" : undefined}>
            {text}
          </Link>
        )
      )}
    </nav>
  );
}
