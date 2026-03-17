"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SanityImage } from "@/components/ui/SanityImage";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";

type NavItem = {
  label: string;
  linkType: "internal" | "external";
  internalSlug?: string;
  externalUrl?: string;
  openInNewTab?: boolean;
};

function resolveHref(item: NavItem): string {
  if (item.linkType === "external") return item.externalUrl || "#";
  return item.internalSlug === "home" || !item.internalSlug ? "/" : `/${item.internalSlug}`;
}

export function Header({ settings, navigation }: { settings: any; navigation: any }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links: NavItem[] = navigation?.headerLinks || [];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          {settings?.logo ? (
            <>
              <SanityImage
                image={settings.logo}
                width={120}
                height={40}
                className="h-10 w-auto object-contain dark:hidden"
              />
              {settings?.logoDark ? (
                <SanityImage
                  image={settings.logoDark}
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain hidden dark:block"
                />
              ) : (
                <SanityImage
                  image={settings.logo}
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain hidden dark:block"
                />
              )}
            </>
          ) : (
            <span className="font-bold text-lg">{settings?.siteName}</span>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((item, i) => (
            <Link
              key={i}
              href={resolveHref(item)}
              target={item.openInNewTab ? "_blank" : undefined}
              rel={item.openInNewTab ? "noopener noreferrer" : undefined}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menüyü aç/kapat">
            {menuOpen ? <RiCloseLine size={20} /> : <RiMenu3Line size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t md:hidden overflow-hidden"
          >
            <nav className="container mx-auto flex flex-col gap-4 px-4 py-6">
              {links.map((item, i) => (
                <Link
                  key={i}
                  href={resolveHref(item)}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
