// Server Component — no 'use client', zero JS bundle cost
// Animation runs entirely on GPU compositor thread (transform: rotate)
// will-change: transform → separate compositor layer, no layout/paint triggers

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

const sizes: Record<NonNullable<SpinnerProps["size"]>, { wrapper: string; border: string }> = {
  sm: { wrapper: "w-6 h-6", border: "border-2" },
  md: { wrapper: "w-10 h-10", border: "border-[3px]" },
  lg: { wrapper: "w-14 h-14", border: "border-4" },
};

export function Spinner({ size = "md" }: SpinnerProps) {
  const { wrapper, border } = sizes[size];

  return (
    <span
      role="status"
      aria-label="Yükleniyor"
      className={`block rounded-full animate-spin ${wrapper} ${border}`}
      style={{
        // color-mix ile tek element üzerinde hem faded ring hem de renkli top border
        borderColor: "color-mix(in oklch, var(--primary) 15%, transparent)",
        borderTopColor: "var(--primary)",
        // GPU compositor layer'a al — main thread'e dokunmaz
        willChange: "transform",
      }}
    />
  );
}
