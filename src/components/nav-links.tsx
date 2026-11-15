"use client";

import { Link, usePathname } from "@/i18n/navigation";

type NavItem = {
  href: "/desktop" | "/cli" | "/guides" | "/submit";
  label: string;
};

type Props = {
  items: readonly NavItem[];
};

export function NavLinks({ items }: Props) {
  const pathname = usePathname();
  return items.map((item) => {
    const active =
      pathname === item.href || pathname.startsWith(`${item.href}/`);
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={
          active
            ? "rounded-full bg-muted px-3 py-1.5 font-medium text-foreground"
            : "rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        }
      >
        {item.label}
      </Link>
    );
  });
}
