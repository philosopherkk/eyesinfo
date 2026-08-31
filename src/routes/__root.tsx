import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppShell } from "@/components/app-shell";
import appCss from "../styles.css?url";
import { PUBLIC_ORIGIN, COPYRIGHT_LINE, COPYRIGHT_YEAR, COPYRIGHT_HOLDER } from "@/lib/site";

const APP_NAME = "護眼學堂";
const APP_DESC =
  "香港眼科公眾教育：常見眼疾、專題單張與自我監察工具。不能代替與註冊眼科專科醫生的面診。可加到 iPhone 與 Android 主畫面。";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1",
      },
      { title: APP_NAME },
      { name: "description", content: APP_DESC },
      { name: "theme-color", content: "#003153" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "copyright", content: COPYRIGHT_LINE },
      { name: "application-name", content: APP_NAME },
      { property: "og:url", content: PUBLIC_ORIGIN },
      { property: "og:title", content: APP_NAME },
      { property: "og:description", content: APP_DESC },
      { property: "og:site_name", content: APP_NAME },
    ],
    links: [
      { rel: "canonical", href: PUBLIC_ORIGIN },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon-192.png" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: Root,
});

function Root() {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: APP_NAME,
              url: PUBLIC_ORIGIN,
              description: APP_DESC,
              inLanguage: ["zh-Hant", "zh-Hans", "en", "ja"],
              copyrightHolder: { "@type": "Organization", name: COPYRIGHT_HOLDER },
              copyrightYear: COPYRIGHT_YEAR,
              isAccessibleForFree: true,
              educationalUse: "public health education",
              publishingPrinciples: `${PUBLIC_ORIGIN}/legal`,
            }),
          }}
        />
        <PreviewHostBridge />
        <AuthProvider>
          <AppShell>
            <Outlet />
          </AppShell>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
