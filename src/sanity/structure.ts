import { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("İçerik")
    .items([
      S.listItem()
        .title("⚙️ Global Ayarlar")
        .child(
          S.list().title("Global Ayarlar").items([
            S.listItem().title("Site Ayarları").id("siteSettings").schemaType("siteSettings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.listItem().title("Navigasyon").id("navigation").schemaType("navigation")
              .child(S.document().schemaType("navigation").documentId("navigation")),
          ])
        ),
      S.divider(),
      S.listItem()
        .title("📄 Sabit Sayfalar")
        .child(
          S.list().title("Sabit Sayfalar").items([
            S.listItem().title("🏠 Ana Sayfa").id("homePage").schemaType("homePage")
              .child(S.document().schemaType("homePage").documentId("homePage")),
            S.listItem().title("ℹ️ Hakkımızda").id("aboutPage").schemaType("aboutPage")
              .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
            S.listItem().title("📬 İletişim").id("contactPage").schemaType("contactPage")
              .child(S.document().schemaType("contactPage").documentId("contactPage")),
            S.listItem().title("📝 Blog").id("blogPage").schemaType("blogPage")
              .child(S.document().schemaType("blogPage").documentId("blogPage")),
            S.listItem().title("🛠 Hizmetler").id("servicesPage").schemaType("servicesPage")
              .child(S.document().schemaType("servicesPage").documentId("servicesPage")),
            S.listItem().title("💼 Projeler").id("projectsPage").schemaType("projectsPage")
              .child(S.document().schemaType("projectsPage").documentId("projectsPage")),
          ])
        ),
      S.divider(),
      S.documentTypeListItem("blogCategory").title("📝 Blog Kategorileri"),
      S.documentTypeListItem("blogPost").title("📝 Blog Yazıları"),
      S.documentTypeListItem("service").title("🛠 Hizmetler"),
      S.documentTypeListItem("project").title("💼 Projeler"),
      S.documentTypeListItem("legalPage").title("⚖️ Yasal Sayfalar"),
    ]);
