import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-webhook-secret");
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { _type } = body;

    const tagMap: Record<string, string[]> = {
      siteSettings: ["layout"],
      navigation: ["layout"],
      homePage: ["home"],
      aboutPage: ["about"],
      contactPage: ["contact"],
      blogPost: ["blog"],
      service: ["services"],
      project: ["projects"],
      legalPage: ["legal"],
      faq: ["faq"],
    };

    const tags = tagMap[_type] || ["all"];
    tags.forEach((tag) => revalidateTag(tag, "page"));

    return NextResponse.json({ revalidated: true, tags, now: Date.now() });
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}
