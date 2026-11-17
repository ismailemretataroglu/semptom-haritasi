"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// "kisa": telefonda sığması için kullanılan kısa ad
const linkler = [
  { href: "/", ad: "Ağrı Analizi", kisa: "Ağrı" },
  { href: "/tahlil", ad: "Tahlil Yorumla", kisa: "Tahlil" },
  { href: "/gecmis", ad: "Geçmiş", kisa: "Geçmiş" },
];

export default function Navbar() {
  const yol = usePathname();

  return (
    <nav className="sticky top-0 z-50 flex h-[60px] items-center justify-between gap-2 border-b border-cizgi bg-white px-3 md:justify-start md:gap-6 md:px-0 print:hidden">
      <Link
        href="/"
        className="shrink-0 text-sm font-semibold text-yazi min-[400px]:text-[15px] md:ml-[50px] md:text-lg"
      >
        Semptom Haritası
      </Link>
      <div className="flex">
        {linkler.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={yol === link.href ? "page" : undefined}
            className={`rounded-md px-2 py-1.5 text-[13px] font-medium whitespace-nowrap md:px-4 md:text-sm ${
              yol === link.href
                ? "bg-mavi-acik text-mavi"
                : "text-soluk hover:bg-[#F8F7F4] hover:text-yazi"
            }`}
          >
            <span className="md:hidden">{link.kisa}</span>
            <span className="hidden md:inline">{link.ad}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
