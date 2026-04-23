import { seoType } from "./objects/seo";
import { socialLinkType } from "./objects/socialLink";
import { customHtmlType } from "./objects/customHtml";
import { siteSettingsType } from "./singletons/siteSettings";
import { navigationType } from "./singletons/navigation";
import { homePageType } from "./singletons/homePage";
import { aboutPageType } from "./singletons/aboutPage";
import { contactPageType } from "./singletons/contactPage";
import { blogPageType } from "./singletons/blogPage";
import { servicesPageType } from "./singletons/servicesPage";
import { projectsPageType } from "./singletons/projectsPage";
import { blogPostType } from "./documents/blogPost";
import { blogCategoryType } from "./documents/blogCategory";
import { serviceType } from "./documents/service";
import { projectType } from "./documents/project";
import { legalPageType } from "./documents/legalPage";
import { faqType } from "./documents/faq";

export const schemaTypes = [
  // Objects
  seoType,
  socialLinkType,
  customHtmlType,
  // Singletons
  siteSettingsType,
  navigationType,
  homePageType,
  aboutPageType,
  contactPageType,
  blogPageType,
  servicesPageType,
  projectsPageType,
  // Collections
  blogPostType,
  blogCategoryType,
  serviceType,
  projectType,
  legalPageType,
  faqType,
];

