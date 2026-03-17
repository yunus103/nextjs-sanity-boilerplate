import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center px-4">
      <p className="text-8xl font-bold text-muted-foreground/20">404</p>
      <h1 className="text-2xl font-bold">Sayfa Bulunamadı</h1>
      <p className="text-muted-foreground max-w-md">
        Aradığınız sayfa taşınmış veya kaldırılmış olabilir.
      </p>
      <Button render={<Link href="/" />}>Ana Sayfaya Dön</Button>
    </div>
  );
}
