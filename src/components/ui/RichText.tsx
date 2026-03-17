import { PortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlForImage, getImageLqip } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const imageUrl = urlForImage(value)?.auto("format").url();
      const blurDataURL = getImageLqip(value);

      const sizeClass =
        value.size === "half" ? "max-w-md" :
        value.size === "large" ? "max-w-2xl" : "w-full";
      const alignClass =
        value.alignment === "left" ? "mr-auto" :
        value.alignment === "right" ? "ml-auto" : "mx-auto";

      return (
        <figure className={`my-8 ${sizeClass} ${alignClass}`}>
          <Image
            src={imageUrl || ""}
            alt={value.alt || ""}
            width={1200}
            height={800}
            className="w-full h-auto rounded-lg"
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL}
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ value, children }) => {
      const isInternal = value?.href?.startsWith("/");
      return isInternal ? (
        <Link href={value.href} className="underline underline-offset-4 hover:text-primary">
          {children}
        </Link>
      ) : (
        <a href={value.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary">
          {children}
        </a>
      );
    },
  },
};

export function RichText({ value, className = "" }: { value: any[]; className?: string }) {
  if (!value) return null;
  return (
    <div className={`prose prose-lg max-w-none dark:prose-invert ${className}`}>
      <PortableText value={value} components={components} />
    </div>
  );
}
