"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiArrowRightSLine, RiHome4Line } from "react-icons/ri";

type BreadcrumbItem = {
  label: string;
  href: string;
  active?: boolean;
};

export function Breadcrumbs({ items, className = "" }: { items?: BreadcrumbItem[], className?: string }) {
  const pathname = usePathname();
  
  // Eğer dışarıdan liste gelmezse current path'ten üret
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter((path) => path !== "");
    const breadcrumbs: BreadcrumbItem[] = paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`;
      // Slug temizliği (tireleri boşluk yap, baş harfleri büyüt)
      const label = path
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
        
      return { label, href, active: index === paths.length - 1 };
    });
    return breadcrumbs;
  };

  const breadcrumbs = items || generateBreadcrumbs();

  if (pathname === "/") return null;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-sm text-muted-foreground ${className}`}>
      <ol className="flex items-center gap-2 flex-wrap">
        <li>
          <Link 
            href="/" 
            className="flex items-center hover:text-primary transition-colors gap-1"
            title="Ana Sayfa"
          >
            <RiHome4Line size={16} />
            <span className="sr-only">Ana Sayfa</span>
          </Link>
        </li>
        
        {breadcrumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-2">
            <RiArrowRightSLine size={14} className="text-muted-foreground/40 shrink-0" />
            {crumb.active ? (
              <span className="font-medium text-foreground truncate max-w-[200px]">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-primary transition-colors truncate max-w-[150px]"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
