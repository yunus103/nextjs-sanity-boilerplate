import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

type WebhookOperation = "create" | "update" | "delete";

type WebhookPayload = {
  _id?: unknown;
  _type?: unknown;
  operation?: unknown;
  slug?: unknown;
  previousSlug?: unknown;
  categoryId?: unknown;
  previousCategoryId?: unknown;
  slugChanged?: unknown;
  noIndexChanged?: unknown;
  affectsList?: unknown;
};

type CollectionConfig = {
  detailPrefix: string;
  listTag: string;
};

const collectionConfig: Record<string, CollectionConfig> = {
  blogPost: { detailPrefix: "blog:detail", listTag: "blog:list" },
  service: { detailPrefix: "service:detail", listTag: "service:list" },
  project: { detailPrefix: "project:detail", listTag: "project:list" },
};

const singletonTags: Record<string, string> = {
  siteSettings: "layout",
  navigation: "layout",
  homePage: "home",
  aboutPage: "about",
  contactPage: "contact",
  blogPage: "blogPage",
  servicesPage: "servicesPage",
  projectsPage: "projectsPage",
  faq: "faq",
};

const sitemapPageTypes = new Set([
  "homePage",
  "aboutPage",
  "contactPage",
  "blogPage",
  "servicesPage",
  "projectsPage",
]);

function readSlug(value: unknown): string | undefined {
  if (typeof value === "string" && value.length > 0) return value;
  if (typeof value !== "object" || value === null) return undefined;

  const current = (value as { current?: unknown }).current;
  return typeof current === "string" && current.length > 0
    ? current
    : undefined;
}

function readOperation(value: unknown): WebhookOperation | undefined {
  return value === "create" || value === "update" || value === "delete"
    ? value
    : undefined;
}

function getRevalidationTags(
  documentType: string,
  operation: WebhookOperation,
  payload: WebhookPayload
): string[] {
  const tags = new Set<string>();
  const currentSlug = readSlug(payload.slug);
  const previousSlug = readSlug(payload.previousSlug);
  const categoryId =
    typeof payload.categoryId === "string" ? payload.categoryId : undefined;
  const previousCategoryId =
    typeof payload.previousCategoryId === "string"
      ? payload.previousCategoryId
      : undefined;
  const slugChanged = payload.slugChanged === true;
  const noIndexChanged = payload.noIndexChanged === true;
  const affectsList = payload.affectsList !== false;
  const inventoryChanged =
    operation === "create" ||
    operation === "delete" ||
    slugChanged ||
    noIndexChanged;

  const collection = collectionConfig[documentType];
  if (collection) {
    if (currentSlug) tags.add(`${collection.detailPrefix}:${currentSlug}`);
    if (previousSlug) tags.add(`${collection.detailPrefix}:${previousSlug}`);

    if (inventoryChanged || affectsList) {
      tags.add(collection.listTag);
      tags.add("home:featured");

      if (documentType === "blogPost") {
        if (categoryId) tags.add(`blog:related:${categoryId}`);
        if (previousCategoryId) {
          tags.add(`blog:related:${previousCategoryId}`);
        }
      }
    }

    if (inventoryChanged) tags.add("sitemap");
    return [...tags];
  }

  if (documentType === "blogCategory") {
    tags.add("blog:list");
    tags.add("blog:categories");
    tags.add("home:featured");
    return [...tags];
  }

  const singletonTag = singletonTags[documentType];
  if (singletonTag) tags.add(singletonTag);

  if (sitemapPageTypes.has(documentType) && inventoryChanged) {
    tags.add("sitemap");
  }

  return [...tags];
}

export async function POST(req: Request) {
  const signature = req.headers.get("sanity-webhook-signature");
  if (!signature) {
    return NextResponse.json(
      { message: "No signature provided" },
      { status: 401 }
    );
  }

  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("SANITY_WEBHOOK_SECRET is not set in environment variables");
    return NextResponse.json(
      { message: "Server misconfiguration: missing secret" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const { isValidSignature } = await import("@sanity/webhook");

  try {
    if (!(await isValidSignature(body, signature, secret))) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.warn("Invalid Sanity webhook signature", error);
    return NextResponse.json(
      { message: "Invalid signature" },
      { status: 401 }
    );
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(body) as WebhookPayload;
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const documentId = typeof payload._id === "string" ? payload._id : undefined;
  const documentType = typeof payload._type === "string" ? payload._type : undefined;
  const operation = readOperation(payload.operation);

  if (documentId?.startsWith("drafts.")) {
    return NextResponse.json({
      revalidated: false,
      message: "Skipped draft document",
    });
  }

  if (!documentType || !operation) {
    return NextResponse.json(
      {
        message:
          "Invalid webhook payload. Configure the documented Sanity webhook projection.",
      },
      { status: 400 }
    );
  }

  const tags = getRevalidationTags(documentType, operation, payload);
  if (tags.length === 0) {
    return NextResponse.json({
      revalidated: false,
      message: `No cache tags configured for ${documentType}`,
    });
  }

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  console.log("[Sanity Webhook] Revalidated", {
    documentType,
    operation,
    tags,
  });

  return NextResponse.json({
    revalidated: true,
    documentType,
    operation,
    tags,
    now: Date.now(),
  });
}
