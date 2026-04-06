import Link from "next/link";
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaPinterest,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiMailLine, RiPhoneLine, RiMapPinLine } from "react-icons/ri";

type NavItem = {
  label: string;
  href: string;
  openInNewTab?: boolean;
};

type SocialLink = {
  platform: string;
  url: string;
};

const socialIconMap: Record<string, React.ElementType> = {
  instagram: FaInstagram,
  facebook: FaFacebook,
  twitter: FaXTwitter,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  pinterest: FaPinterest,
  whatsapp: FaWhatsapp,
};

function resolveHref(item: NavItem): string {
  return item.href || "#";
}

export function Footer({ settings, navigation }: { settings: any; navigation: any }) {
  const footerLinks: NavItem[] = navigation?.footerLinks || [];
  const socialLinks: SocialLink[] = (settings?.socialLinks || []).filter((s: SocialLink) => s.url);
  const contact = settings?.contactInfo;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

          {/* Marka & İletişim */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">{settings?.siteName}</h3>
            {settings?.siteTagline && (
              <p className="text-sm text-muted-foreground">{settings.siteTagline}</p>
            )}
            <div className="space-y-2">
              {contact?.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <RiPhoneLine className="shrink-0" />
                  {contact.phone}
                </a>
              )}
              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <RiMailLine className="shrink-0" />
                  {contact.email}
                </a>
              )}
              {contact?.address && (
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <RiMapPinLine className="shrink-0 mt-0.5" />
                  {contact.address}
                </p>
              )}
            </div>
          </div>

          {/* Footer Linkleri */}
          {footerLinks.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider">Hızlı Linkler</h3>
              <nav className="space-y-2">
                {footerLinks.map((item, i) => (
                  <Link
                    key={i}
                    href={resolveHref(item)}
                    target={item.openInNewTab ? "_blank" : undefined}
                    rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}

          {/* Sosyal Medya */}
          {socialLinks.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider">Sosyal Medya</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, i) => {
                  const Icon = socialIconMap[social.platform];
                  if (!Icon) return null;
                  return (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform}
                      className="flex h-9 w-9 items-center justify-center rounded-full border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Alt Bar */}
        <div className="mt-12 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} {settings?.siteName}. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-4">
            <Link href="/yasal/gizlilik-politikasi" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/yasal/kullanim-kosullari" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
