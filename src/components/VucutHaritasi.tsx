"use client";

import { useState } from "react";
import { bolgeler, type Bolge, type Gorunum, type Siddet } from "@/lib/bolgeler";

// Seçimler: bölge id'si -> o bölgenin şiddeti (henüz seçilmediyse null)
export type Secimler = Record<string, Siddet | null>;

type Props = {
  secimler: Secimler;
  onTikla: (id: string) => void;
};

// Seçili bölgenin rengi şiddete göre değişir (eski .p-mild / .p-mod / .p-sev)
const siddetRengi: Record<Siddet, string> = {
  hafif: "fill-[#FDE68A] stroke-[#D97706]",
  orta: "fill-[#FDBA74] stroke-[#EA580C]",
  siddetli: "fill-[#FCA5A5] stroke-[#C53030]",
};

const gorunumler: { deger: Gorunum; ad: string }[] = [
  { deger: "on", ad: "Ön" },
  { deger: "arka", ad: "Arka" },
];

export default function VucutHaritasi({ secimler, onTikla }: Props) {
  const [gorunum, setGorunum] = useState<Gorunum>("on");
  // Fare hangi bölgenin üzerinde? (adını göstermek için)
  const [uzerindeki, setUzerindeki] = useState<Bolge | null>(null);

  const gorunenler = bolgeler.filter((b) => b.gorunum === gorunum);

  // Bir görünümde kaç bölge seçili? (Ön/Arka butonlarındaki sayı için)
  function seciliSayisi(g: Gorunum) {
    return bolgeler.filter((b) => b.gorunum === g && b.id in secimler).length;
  }

  function renk(bolge: Bolge) {
    // Bu bölge seçili değilse
    if (!(bolge.id in secimler)) {
      return "fill-mavi-acik stroke-[#93C5E8] hover:fill-[#C5DFF4]";
    }
    // Seçili ve şiddeti belli
    const siddet = secimler[bolge.id];
    if (siddet) return siddetRengi[siddet];
    // Seçili ama şiddeti henüz belirlenmemiş
    return "fill-mavi-orta stroke-mavi";
  }

  return (
    <div className="mx-auto w-[240px]">
      {/* Ön / Arka geçişi */}
      <div className="mb-2 flex rounded-lg bg-mavi-zemin p-1">
        {gorunumler.map((g) => (
          <button
            key={g.deger}
            onClick={() => setGorunum(g.deger)}
            className={`flex-1 cursor-pointer rounded-md py-1.5 text-[13px] font-medium transition-all ${
              gorunum === g.deger
                ? "bg-white text-mavi shadow-sm"
                : "text-soluk hover:text-yazi"
            }`}
          >
            {g.ad}
            {seciliSayisi(g.deger) > 0 && (
              <span className="ml-1.5 rounded-full bg-mavi px-1.5 py-0.5 text-[11px] text-white">
                {seciliSayisi(g.deger)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Fareyle üzerine gelinen bölgenin adı */}
      <p className="h-5 text-[13px] font-medium text-mavi">
        {uzerindeki ? uzerindeki.ad : ""}
      </p>

      <svg viewBox="0 0 240 545" width="240" height="545" role="group" aria-label="Vücut haritası">
        {gorunenler.map((bolge) => (
          <path
            key={bolge.id}
            d={bolge.d}
            // Aynalama: x koordinatını orta çizgiye (120) göre ters çevirir
            transform={bolge.ayna ? "matrix(-1 0 0 1 240 0)" : undefined}
            role="button"
            tabIndex={0}
            aria-label={bolge.ad}
            aria-pressed={bolge.id in secimler}
            onClick={() => onTikla(bolge.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onTikla(bolge.id);
              }
            }}
            onMouseEnter={() => setUzerindeki(bolge)}
            onMouseLeave={() => setUzerindeki(null)}
            onFocus={() => setUzerindeki(bolge)}
            onBlur={() => setUzerindeki(null)}
            className={`cursor-pointer stroke-[1.5] outline-none transition-colors duration-200 focus-visible:stroke-mavi focus-visible:stroke-[2.5] ${renk(bolge)}`}
          />
        ))}

        {/* Arka görünümde omurga çizgisi: sadece görsel ipucu */}
        {gorunum === "arka" && (
          <path
            d="M120 100 L120 262"
            className="pointer-events-none fill-none stroke-[#93C5E8] stroke-[1.5]"
            strokeDasharray="3 4"
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* Hangi taraf sağ, hangi taraf sol */}
      <div className="flex justify-between px-2 text-[11px] font-semibold tracking-wider text-silik">
        <span>{gorunum === "on" ? "SAĞ" : "SOL"}</span>
        <span>{gorunum === "on" ? "SOL" : "SAĞ"}</span>
      </div>
    </div>
  );
}
