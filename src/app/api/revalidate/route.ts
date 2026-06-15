import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("sanity-webhook-signature");
    if (!signature) {
      return NextResponse.json(
        { message: "No signature provided" },
        { status: 401 }
      );
    }

    const { isValidSignature } = await import("@sanity/webhook");
    const secret = process.env.SANITY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("SANITY_WEBHOOK_SECRET is not set in environment variables");
      return NextResponse.json(
        { message: "Server misconfiguration: missing secret" },
        { status: 500 }
      );
    }

    const body = await req.text();

    // Verify signature using Sanity's official package
    if (!isValidSignature(body, signature, secret)) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );
    }

    const payload = JSON.parse(body);
    const _id = payload._id || payload.document?._id;
    const _type = payload._type || payload.document?._type;
    const slug = payload.slug || payload.document?.slug;

    if (_id && _id.startsWith("drafts.")) {
      console.log(`[Sanity Webhook] Skipping draft document revalidation: ${_id}`);
      return NextResponse.json({ revalidated: false, message: "Skipped draft document" });
    }

    console.log(`[Sanity Webhook] Revalidating type: ${_type}`);

    const tagMap: Record<string, string[]> = {
      siteSettings: ["layout"],
      navigation: ["layout"],
      homePage: ["home"],
      aboutPage: ["about"],
      contactPage: ["contact"],
      blogPage: ["blogPage"],
      servicesPage: ["servicesPage"],
      projectsPage: ["projectsPage"],
      blogPost: ["blog", "sitemap"],
      service: ["services", "sitemap"],
      project: ["projects", "sitemap"],
      blogCategory: ["blog"],
      faq: ["faq"],
    };

    const tags = tagMap[_type] || ["all"];

    tags.forEach((tag) => {
      // Revalidate target tags using the user's exact parameters that worked previously
      revalidateTag(tag, { expire: 0 });
      console.log(`Revalidated tag: ${tag}`);
    });

    // For specific document updates based on slug
    if (_type && slug?.current) {
      const itemTag = `${_type}:${slug.current}`;
      revalidateTag(itemTag, { expire: 0 });
      console.log(`Revalidated tag: ${itemTag}`);
    }

    return NextResponse.json({ revalidated: true, tags, now: Date.now() });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Revalidation error:", error.message);
    return NextResponse.json(
      { message: "Error revalidating", error: error.message },
      { status: 500 }
    );
  }
}
