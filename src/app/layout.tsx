import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Semptom Haritası",
    template: "%s · Semptom Haritası", // alt sayfalarda: "Tahlil Yorumla · Semptom Haritası"
  },
  description:
    "Vücut haritası üzerinden ağrıyan bölgeleri seçin, yapay zeka destekli ön değerlendirme alın ve tahlil sonuçlarınızı yorumlatın.",
};

export const viewport: Viewport = {
  themeColor: "#1B5E8C",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Navbar />
        <Ticker />
        {/* flex-1: içerik kısa olsa bile footer sayfanın en altında durur */}
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
