import type { Metadata } from "next";
import { DynaPuff, LXGW_WenKai_TC, Nunito } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { site } from "@/data/site";
import "./globals.css";

const bodyFont = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-serif",
});

const displayFont = DynaPuff({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const noteFont = LXGW_WenKai_TC({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-note",
});

export const metadata: Metadata = {
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${bodyFont.variable} ${displayFont.variable} ${noteFont.variable}`}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
