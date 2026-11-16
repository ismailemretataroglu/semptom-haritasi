"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const linkler = [
  { href: "/", ad: "Ağrı Analizi" },
  { href: "/tahlil", ad: "Tahlil Yorumla" },
];

export default function Navbar() {
  const yol = usePathname();

  return (
    <nav className="sticky top-0 z-50 flex h-[60px] items-center gap-6 border-b border-cizgi bg-white">
      <Link href="/" className="ml-4 text-lg font-semibold text-yazi md:ml-[50px]">
        Semptom Haritası
      </Link>
      <div className="flex">
        {linkler.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-4 py-1.5 text-sm font-medium ${
              yol === link.href
                ? "bg-mavi-acik text-mavi"
                : "text-soluk hover:bg-[#F8F7F4] hover:text-yazi"
            }`}
          >
            {link.ad}
          </Link>
        ))}
      </div>
    </nav>
  );
}