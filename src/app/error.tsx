"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RiAlertLine, RiRefreshLine } from "react-icons/ri";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hatayı logla
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="rounded-full bg-destructive/10 p-6 text-destructive">
        <RiAlertLine size={64} />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Bir şeyler yanlış gitti</h1>
        <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
          Beklenmedik bir hata oluştu. Sayfayı yenilemeyi deneyebilir veya ana sayfaya dönebilirsiniz.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button onClick={() => reset()} className="gap-2">
          <RiRefreshLine className="h-4 w-4" />
          Tekrar Dene
        </Button>
        <Button variant="outline" render={<Link href="/" />}>
          Ana Sayfaya Dön
        </Button>
      </div>
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-8 rounded-lg bg-muted p-4 text-left text-xs overflow-auto max-w-full">
          {error.message}
        </pre>
      )}
    </div>
  );
}
