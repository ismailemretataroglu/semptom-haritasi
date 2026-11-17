"use client";

import { useRef, useState } from "react";
import KaydetButonu from "@/components/KaydetButonu";
import TahlilSonuclari from "@/components/TahlilSonuclari";
import { azamiBoyut, izinliTurler, type TahlilSonucu } from "@/lib/tahlil";

export default function TahlilYorumla() {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [suruklenen, setSuruklenen] = useState(false); // dosya kutunun üzerinde mi?
  const [dosyaAdi, setDosyaAdi] = useState<string | null>(null);
  const [sonuc, setSonuc] = useState<TahlilSonucu | null>(null);
  const [hata, setHata] = useState<string | null>(null);

  // Gizli <input type="file"> elemanına ulaşmak için
  const girdi = useRef<HTMLInputElement>(null);

  async function yukle(dosya: File | undefined) {
    if (!dosya || yukleniyor) return;

    setSonuc(null);
    setHata(null);
    setDosyaAdi(dosya.name);

    // Sunucuya göndermeden önce burada da kontrol et: kullanıcı boşuna beklemesin
    if (!izinliTurler.includes(dosya.type)) {
      setHata("Sadece PNG, JPG, WEBP veya PDF dosyaları yüklenebilir.");
      return;
    }
    if (dosya.size > azamiBoyut) {
      setHata("Dosya çok büyük. En fazla 4 MB yükleyebilirsiniz.");
      return;
    }

    setYukleniyor(true);
    try {
      const form = new FormData();
      form.append("dosya", dosya);

      const cevap = await fetch("/api/tahlil", { method: "POST", body: form });
      const veri = await cevap.json();

      if (!cevap.ok) {
        setHata(veri.hata ?? "Bir hata oluştu, tekrar deneyin.");
      } else if (!veri.tahlilMi) {
        setHata("Bu dosya bir tahlil sonucuna benzemiyor. Lütfen tahlil belgenizi yükleyin.");
      } else {
        setSonuc(veri);
      }
    } catch {
      setHata("Sunucuya ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.");
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div className="mx-auto max-w-[800px] px-4 py-6 md:px-20 md:py-8">
      {/* Yükleme kutusu: tıklanabilir ve üzerine dosya bırakılabilir */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Tahlil dosyası seç"
        onClick={() => girdi.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            girdi.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault(); // bu olmazsa tarayıcı dosyayı yeni sekmede açar
          setSuruklenen(true);
        }}
        onDragLeave={() => setSuruklenen(false)}
        onDrop={(e) => {
          e.preventDefault();
          setSuruklenen(false);
          yukle(e.dataTransfer.files[0]);
        }}
        className={`mb-6 cursor-pointer rounded-xl border-2 border-dashed px-8 py-12 text-center transition-all hover:border-mavi hover:bg-mavi-zemin ${
          suruklenen ? "border-mavi bg-mavi-zemin" : "border-[#D0CAC0] bg-white"
        }`}
      >
        <p className="mb-1.5 text-base text-yazi">
          {suruklenen ? "Dosyayı bırakın" : "Dosya Seç veya Sürükle"}
        </p>
        <small className="text-[13px] text-silik">PNG, JPG veya PDF · en fazla 4 MB</small>
      </div>

      <input
        ref={girdi}
        type="file"
        accept={izinliTurler.join(",")}
        className="hidden"
        onChange={(e) => {
          yukle(e.target.files?.[0]);
          e.target.value = ""; // aynı dosya tekrar seçilebilsin
        }}
      />

      {dosyaAdi && (
        <p className="mb-4 text-[13px] text-soluk">
          Dosya: <span className="font-medium text-yazi">{dosyaAdi}</span>
        </p>
      )}

      {yukleniyor && <p className="py-5 text-sm text-soluk">Analiz ediliyor...</p>}

      {hata && (
        <p role="alert" className="rounded-lg bg-[#FBE8E8] px-4 py-3 text-sm text-[#8C1B1B]">
          {hata}
        </p>
      )}

      {sonuc && (
        <div className="flex flex-col gap-4">
          <TahlilSonuclari sonuc={sonuc} />
          <KaydetButonu
            key={JSON.stringify(sonuc)}
            kayit={{ tur: "tahlil", dosyaAdi: dosyaAdi ?? "tahlil", sonuc }}
          />
        </div>
      )}

      {!sonuc && !yukleniyor && (
        <p className="text-xs text-silik">
          Yüklediğiniz dosya yalnızca yorumlanmak üzere yapay zeka servisine gönderilir, bu sitede
          saklanmaz.
        </p>
      )}
    </div>
  );
}
