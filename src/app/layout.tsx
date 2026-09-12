import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Amigo Secreto para Yule",
  description:
    "Organiza tu amigo secreto con un link de WhatsApp. Confirmaciones en vivo, sorteo justo y revelación privada.",
  applicationName: "Amigo Secreto para Yule",
  appleWebApp: {
    capable: true,
    title: "Amigo Secreto Yule",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#070f0c",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable} h-full`}>
      <body className="relative min-h-full antialiased">
        <div className="snow-dots" aria-hidden />
        <div className="relative z-10 flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
