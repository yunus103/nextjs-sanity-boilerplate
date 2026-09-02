import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-2",
        align === "center" ? "text-center max-w-3xl mx-auto" : "text-left max-w-2xl",
        className
      )}
    >
      <FadeIn direction="up">
        {eyebrow && (
          <span className="text-xs font-semibold tracking-wider text-primary uppercase inline-block mb-1">
            {eyebrow}
          </span>
        )}
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mt-2">
            {subtitle}
          </p>
        )}
      </FadeIn>
    </div>
  );
}
