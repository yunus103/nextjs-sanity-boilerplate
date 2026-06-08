import { PortableText, PortableTextComponents } from "@portabletext/react";
import Link from "next/link";
import { SanityImage } from "@/components/ui/SanityImage";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const dimensions = value.asset.metadata?.dimensions;
      const width = dimensions?.width || 1200;
      const height = dimensions?.height || 800;

      const sizeMap: Record<string, string> = {
        "25": "w-full md:w-1/4",
        "33": "w-full md:w-1/3",
        "50": "w-full md:w-1/2",
        "75": "w-full md:w-3/4",
        "100": "w-full",
        // Fallback for old values
        half: "w-full md:w-1/2",
        large: "w-full md:w-3/4",
        full: "w-full",
      };

      let containerClasses = "relative my-8 ";

      if (value.alignment === "left") {
        containerClasses += "md:float-left md:mr-8 mb-6 ";
      } else if (value.alignment === "right") {
        containerClasses += "md:float-right md:ml-8 mb-6 ";
      } else if (value.alignment === "center") {
        containerClasses += "mx-auto flex flex-col items-center ";
      } else {
        containerClasses += "w-full ";
      }

      containerClasses += sizeMap[value.size] || "w-full";

      return (
        <figure className={containerClasses.trim()}>
          <SanityImage
            image={value}
            width={width}
            height={height}
            fit="max"
            className="w-full h-auto rounded-lg shadow-md"
          />
          {value.caption && (
            <figcaption className="mt-2 text-sm text-center text-muted-foreground italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    customHtml: ({ value }) => {
      if (!value?.html) return null;
      return (
        <div
          className="my-6 overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: value.html }}
        />
      );
    },
  },
  marks: {
    textColor: ({ value, children }) => {
      // @sanity/color-input stores its color info inside the `hex` property.
      const colorHex = value?.hex;
      return <span style={{ color: colorHex }}>{children}</span>;
    },
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RichText({ value, className = "" }: { value?: any[]; className?: string }) {
  if (!value) return null;
  return (
    <div className={`prose prose-lg max-w-none break-words flow-root ${className}`}>
      <PortableText value={value} components={components} />
    </div>
  );
}
