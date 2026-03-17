"use client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { RiSunLine, RiMoonLine } from "react-icons/ri";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Tema değiştir"
    >
      <RiSunLine className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <RiMoonLine className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Tema değiştir</span>
    </Button>
  );
}
