import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { Link } from "@/i18n/navigation";

function MdxLink({ href, children, ...rest }: ComponentPropsWithoutRef<"a">) {
  if (href?.startsWith("/")) {
    return <Link href={href}>{children}</Link>;
  }
  return (
    <a href={href} rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { a: MdxLink, ...components };
}
