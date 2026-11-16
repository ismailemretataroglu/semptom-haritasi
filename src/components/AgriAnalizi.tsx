"use client";

import { useState } from "react";
import Kart from "@/components/Kart";
import SonucKarti from "@/components/SonucKarti";
import VucutHaritasi, { type Secimler } from "@/components/VucutHaritasi";
import type { AnalizIstegi, AnalizSonucu } from "@/lib/analiz";
import { bolgeler, type Siddet } from "@/lib/bolgeler";

const siddetler: { deger: Siddet; ad: string }[] = [
  { deger: "hafif", ad: "Hafif" },
  { deger: "orta", ad: "Orta" },
  { deger: "siddetli", ad: "Şiddetli" },
];

export default function AgriAnalizi() {
  // Seçili bölgeler ve her birinin şiddeti. Örnek:
  // { "on-govdeUst": "siddetli", "on-ustKol-2": null }
  const [secimler, setSecimler] = useState<Secimler>({});
  const [belirtiler, setBelirtiler] = useState<string[]>([]);

  // Yapay zeka değerlendirmesinin durumu
  const [yukleniyor, setYukleniyor] = useState(false);
  const [sonuc, setSonuc] = useState<AnalizSonucu | null>(null);
  const [hata, setHata] = useState<string | null>(null);

  // Seçili bölgelerin tüm bilgileri (ad, belirtiler...)
  const seciliBolgeler = bolgeler.filter((b) => b.id in secimler);

  // Seçili bölgelerin belirtileri tek listede, tekrarlar atılmış halde
  const olasiBelirtiler = [...new Set(seciliBolgeler.flatMap((b) => b.belirtiler))];

  // En az bir bölge seçili ve hepsinin şiddeti belirlenmiş mi?
  const hazir =
    seciliBolgeler.length > 0 && seciliBolgeler.every((b) => secimler[b.id] !== null);

  // Seçimler değişince eski değerlendirme geçersiz olur, ekrandan kaldır
  function sonucuTemizle() {
    setSonuc(null);
    setHata(null);
  }

  // Haritada bir bölgeye tıklanınca: seçili değilse ekle, seçiliyse çıkar
  function bolgeTikla(id: string) {
    sonucuTemizle();
    if (id in secimler) {
      bolgeCikar(id);
    } else {
      setSecimler({ ...secimler, [id]: null });
    }
  }

  function bolgeCikar(id: string) {
    sonucuTemizle();
    const yeni = { ...secimler };
    delete yeni[id];
    setSecimler(yeni);

    // Artık hiçbir seçili bölgeye ait olmayan belirtileri de temizle
    const kalanBelirtiler = bolgeler
      .filter((b) => b.id in yeni)
      .flatMap((b) => b.belirtiler);
    setBelirtiler(belirtiler.filter((b) => kalanBelirtiler.includes(b)));
  }

  function siddetSec(id: string, siddet: Siddet) {
    sonucuTemizle();
    setSecimler({ ...secimler, [id]: siddet });
  }

  function belirtiDegistir(belirti: string) {
    sonucuTemizle();
    setBelirtiler((onceki) =>
      onceki.includes(belirti)
        ? onceki.filter((b) => b !== belirti) // seçiliyse çıkar
        : [...onceki, belirti], // değilse ekle
    );
  }

  // Butona basılınca: seçimleri kendi sunucumuza gönder, cevabı bekle
  async function degerlendir() {
    setYukleniyor(true);
    sonucuTemizle();

    const istek: AnalizIstegi = {
      bolgeler: seciliBolgeler.map((b) => ({ id: b.id, siddet: secimler[b.id]! })),
      belirtiler,
    };

    try {
      const cevap = await fetch("/api/analiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(istek),
      });
      const veri = await cevap.json();

      if (cevap.ok) {
        setSonuc(veri);
      } else {
        setHata(veri.hata ?? "Bir hata oluştu, tekrar deneyin.");
      }
    } catch {
      setHata("Sunucuya ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.");
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-10 px-4 py-6 md:flex-row md:items-start md:px-[100px] md:py-8">
      {/* SOL: vücut haritası */}
      <div className="w-full shrink-0 text-center md:w-auto">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-silik">
          Lütfen Bölge Seçiniz
        </p>
        <VucutHaritasi secimler={secimler} onTikla={bolgeTikla} />
      </div>

      {/* SAĞ: kartlar */}
      <div className="flex w-full flex-1 flex-col gap-4 pt-2">
        <Kart baslik={seciliBolgeler.length > 1 ? "Seçili Bölgeler" : "Seçili Bölge"}>
          {seciliBolgeler.length === 0 ? (
            <>
              <p className="mb-1 text-lg font-semibold text-yazi md:text-[22px]">-</p>
              <p className="text-[13px] text-silik">
                Harita Üzerinde Bir Bölgeye Tıklayın. Birden fazla bölge seçebilirsiniz.
              </p>
            </>
          ) : (
            <>
              <ul className="flex flex-col gap-3">
                {seciliBolgeler.map((bolge) => (
                  <li
                    key={bolge.id}
                    className="flex flex-col gap-2 md:flex-row md:items-center"
                  >
                    <span className="text-base font-semibold text-yazi md:w-40 md:shrink-0">
                      {bolge.ad}
                    </span>

                    <div className="flex flex-1 gap-2">
                      {siddetler.map((s) => (
                        <button
                          key={s.deger}
                          onClick={() => siddetSec(bolge.id, s.deger)}
                          className={`flex-1 cursor-pointer rounded-lg border-[1.5px] px-2 py-2 text-[13px] font-medium transition-all ${
                            secimler[bolge.id] === s.deger
                              ? "border-mavi-orta bg-mavi-acik text-mavi"
                              : "border-cizgi bg-white text-soluk hover:border-[#93C5E8] hover:text-yazi"
                          }`}
                        >
                          {s.ad}
                        </button>
                      ))}

                      <button
                        onClick={() => bolgeCikar(bolge.id)}
                        aria-label={`${bolge.ad} bölgesini kaldır`}
                        className="cursor-pointer rounded-lg px-2.5 text-lg leading-none text-silik transition-colors hover:bg-[#FBE8E8] hover:text-[#8C1B1B]"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {!hazir && (
                <p className="mt-3 text-[13px] text-silik">
                  Her bölge için ağrı şiddetini belirleyin
                </p>
              )}
            </>
          )}
        </Kart>

        {/* Bütün bölgelerin şiddeti seçilmeden bu kart görünmez */}
        {hazir && (
          <Kart baslik="Ek Belirtiler">
            <div className="flex flex-wrap gap-2">
              {olasiBelirtiler.map((belirti) => (
                <button
                  key={belirti}
                  onClick={() => belirtiDegistir(belirti)}
                  className={`cursor-pointer rounded-full border-[1.5px] px-3.5 py-1.5 text-[13px] transition-all ${
                    belirtiler.includes(belirti)
                      ? "border-mavi-orta bg-mavi-acik font-medium text-mavi"
                      : "border-cizgi bg-white text-soluk hover:border-mavi-orta hover:text-mavi"
                  }`}
                >
                  {belirti}
                </button>
              ))}
            </div>
          </Kart>
        )}

        <button
          disabled={!hazir || yukleniyor}
          onClick={degerlendir}
          className="w-full cursor-pointer rounded-lg bg-mavi p-3 text-sm font-semibold text-white transition-colors enabled:hover:bg-mavi-koyu disabled:cursor-not-allowed disabled:bg-cizgi disabled:text-silik md:p-[13px] md:text-[15px]"
        >
          {yukleniyor ? "Değerlendiriliyor..." : "Yapay Zeka ile Değerlendir"}
        </button>

        {hata && (
          <p role="alert" className="rounded-lg bg-[#FBE8E8] px-4 py-3 text-sm text-[#8C1B1B]">
            {hata}
          </p>
        )}

        {sonuc && <SonucKarti sonuc={sonuc} />}
      </div>
    </div>
  );
}
