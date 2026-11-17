"use client";

import { useState } from "react";
import SonucKarti from "@/components/SonucKarti";
import TahlilSonuclari from "@/components/TahlilSonuclari";
import { siddetAdlari } from "@/lib/bolgeler";
import { kayitSil, tumunuSil, useGecmis, type Kayit } from "@/lib/gecmis";

const aciliyetRozeti = {
  DUSUK: { yazi: "Düşük", sinif: "bg-[#EBF5F0] text-[#1F6B45]" },
  ORTA: { yazi: "Orta", sinif: "bg-[#FBF3E8] text-[#8C5A1B]" },
  YUKSEK: { yazi: "Yüksek", sinif: "bg-[#FBE8E8] text-[#8C1B1B]" },
};

function tarihYaz(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", { dateStyle: "long", timeStyle: "short" });
}

// Listede görünen kısa başlık ve alt satır
function ozet(kayit: Kayit) {
  if (kayit.tur === "agri") {
    return {
      baslik: kayit.bolgeler.map((b) => b.ad).join(" + "),
      alt: kayit.belirtiler.length ? kayit.belirtiler.join(", ") : "Ek belirti yok",
    };
  }
  const normalDisi = kayit.sonuc.parametreler.filter((p) => p.durum !== "NORMAL").length;
  return {
    baslik: `Tahlil · ${kayit.dosyaAdi}`,
    alt: `${kayit.sonuc.parametreler.length} test, ${normalDisi} normal dışı`,
  };
}

function Detay({ kayit }: { kayit: Kayit }) {
  if (kayit.tur === "tahlil") return <TahlilSonuclari sonuc={kayit.sonuc} />;

  const ekSatirlar = [
    kayit.ek.sure && `Süre: ${kayit.ek.sure}`,
    kayit.ek.tip && `Ağrının tipi: ${kayit.ek.tip}`,
    kayit.ek.yas !== undefined && `Yaş: ${kayit.ek.yas}`,
    kayit.ek.cinsiyet && `Cinsiyet: ${kayit.ek.cinsiyet}`,
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-3">
      <ul className="text-sm leading-[1.7] text-yazi">
        <li>
          <strong>Bölgeler:</strong>{" "}
          {kayit.bolgeler.map((b) => `${b.ad} (${siddetAdlari[b.siddet]})`).join(", ")}
        </li>
        <li>
          <strong>Ek belirtiler:</strong>{" "}
          {kayit.belirtiler.length ? kayit.belirtiler.join(", ") : "belirtilmedi"}
        </li>
        {ekSatirlar.length > 0 && <li>{ekSatirlar.join(" · ")}</li>}
        {kayit.acil && (
          <li className="font-semibold text-[#8C1B1B]">
            ⚠ Bu değerlendirmede acil durum uyarısı gösterildi.
          </li>
        )}
      </ul>
      <SonucKarti sonuc={kayit.sonuc} />
    </div>
  );
}

export default function GecmisListesi() {
  const kayitlar = useGecmis();
  const [acikId, setAcikId] = useState<string | null>(null);
  const [silmeOnayi, setSilmeOnayi] = useState(false);

  if (kayitlar.length === 0) {
    return (
      <div className="mx-auto max-w-[800px] px-4 py-10 text-center md:px-20">
        <p className="mb-1 text-base text-yazi">Henüz kayıt yok</p>
        <p className="text-[13px] text-silik">
          Bir değerlendirme aldıktan sonra &quot;Geçmişe Kaydet&quot; butonuna basarak buraya
          ekleyebilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[800px] px-4 py-6 md:px-20 md:py-8 print:max-w-none print:p-0">
      {/* Üst satır: sayı ve işlemler (yazdırırken gizlenir) */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-silik">
          {kayitlar.length} kayıt
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => window.print()}
            className="cursor-pointer rounded-lg bg-mavi px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-mavi-koyu"
          >
            Yazdır / PDF Olarak Kaydet
          </button>
          {silmeOnayi ? (
            <>
              <button
                onClick={() => {
                  tumunuSil();
                  setSilmeOnayi(false);
                }}
                className="cursor-pointer rounded-lg bg-[#C53030] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#9B2C2C]"
              >
                Evet, hepsini sil
              </button>
              <button
                onClick={() => setSilmeOnayi(false)}
                className="cursor-pointer rounded-lg border-[1.5px] border-cizgi bg-white px-4 py-2 text-[13px] font-medium text-soluk"
              >
                Vazgeç
              </button>
            </>
          ) : (
            <button
              onClick={() => setSilmeOnayi(true)}
              className="cursor-pointer rounded-lg border-[1.5px] border-cizgi bg-white px-4 py-2 text-[13px] font-medium text-soluk transition-all hover:border-[#C53030] hover:text-[#8C1B1B]"
            >
              Tümünü Sil
            </button>
          )}
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {kayitlar.map((kayit) => {
          const { baslik, alt } = ozet(kayit);
          const acik = acikId === kayit.id;
          const rozet = kayit.tur === "agri" ? aciliyetRozeti[kayit.sonuc.aciliyet] : null;

          return (
            <li
              key={kayit.id}
              className="break-inside-avoid rounded-xl border border-cizgi bg-white print:border-0"
            >
              <div className="flex flex-wrap items-center gap-3 p-4 md:p-5">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-silik">{tarihYaz(kayit.tarih)}</p>
                  <p className="truncate text-base font-semibold text-yazi print:whitespace-normal">
                    {baslik}
                  </p>
                  <p className="truncate text-[13px] text-soluk print:whitespace-normal">{alt}</p>
                </div>

                {rozet && (
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${rozet.sinif}`}>
                    {rozet.yazi}
                  </span>
                )}

                <div className="flex gap-2 print:hidden">
                  <button
                    onClick={() => setAcikId(acik ? null : kayit.id)}
                    aria-expanded={acik}
                    className="cursor-pointer rounded-lg border-[1.5px] border-cizgi bg-white px-3 py-1.5 text-[13px] font-medium text-soluk transition-all hover:border-mavi-orta hover:text-mavi"
                  >
                    {acik ? "Kapat" : "Aç"}
                  </button>
                  <button
                    onClick={() => kayitSil(kayit.id)}
                    aria-label={`${baslik} kaydını sil`}
                    className="cursor-pointer rounded-lg px-2.5 text-lg leading-none text-silik transition-colors hover:bg-[#FBE8E8] hover:text-[#8C1B1B]"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Ayrıntı: ekranda sadece açık olan görünür, yazdırırken hepsi görünür */}
              <div
                className={`border-t border-cizgi p-4 md:p-5 print:block ${acik ? "" : "hidden"}`}
              >
                <Detay kayit={kayit} />
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs text-silik print:hidden">
        Kayıtlar yalnızca bu tarayıcıda saklanır; başka bir cihazda ya da tarayıcıda görünmez.
        Tarayıcı verilerini temizlerseniz silinir.
      </p>
    </div>
  );
}
