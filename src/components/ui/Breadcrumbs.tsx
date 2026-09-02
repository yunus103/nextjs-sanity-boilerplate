"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiArrowRightSLine, RiHome4Line } from "react-icons/ri";
import { JsonLd, breadcrumbListJsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbItem } from "@/types";

const ROUTE_LABELS: Record<string, string> = {
  hakkimizda: "Hakkımızda",
  hizmetler: "Hizmetlerimiz",
  projeler: "Projelerimiz",
  blog: "Blog",
  iletisim: "İletişim",
};

function formatSlugToLabel(slug: string): string {
  try {
    const decoded = decodeURIComponent(slug).trim().toLowerCase();
    if (ROUTE_LABELS[decoded]) {
      return ROUTE_LABELS[decoded];
    }
    return decoded
      .replace(/[-_]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1))
      .join(" ");
  } catch {
    return slug;
  }
}

export function Breadcrumbs({ items, className = "" }: { items?: BreadcrumbItem[]; className?: string }) {
  const pathname = usePathname();
  
  // Eğer dışarıdan liste gelmezse current path'ten üret
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split("/").filter(Boolean);
    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`;
      const label = formatSlugToLabel(path);
      return { label, href, active: index === paths.length - 1 };
    });
  };

  const breadcrumbs = items || generateBreadcrumbs();

  if (pathname === "/") return null;

  return (
    <>
      <JsonLd data={breadcrumbListJsonLd(breadcrumbs)} />
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
              <span className="font-medium text-foreground truncate max-w-[200px]" title={crumb.label}>
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-primary transition-colors truncate max-w-[150px]"
                title={crumb.label}
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
    </>
  );
}
