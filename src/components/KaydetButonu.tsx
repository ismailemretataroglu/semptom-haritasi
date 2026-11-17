"use client";

import { useState } from "react";
import { kayitEkle, type YeniKayit } from "@/lib/gecmis";

// Değerlendirmeyi geçmişe kaydeder. Bir kez basılınca "Kaydedildi" olur.
export default function KaydetButonu({ kayit }: { kayit: YeniKayit }) {
  const [durum, setDurum] = useState<"bekliyor" | "kaydedildi" | "hata">("bekliyor");

  if (durum === "kaydedildi") {
    return (
      <p className="text-[13px] font-medium text-[#1F6B45]">
        ✓ Geçmişe kaydedildi. Kayıtlar yalnızca bu tarayıcıda saklanır.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={() => setDurum(kayitEkle(kayit) ? "kaydedildi" : "hata")}
        className="cursor-pointer rounded-lg border-[1.5px] border-cizgi bg-white px-4 py-2 text-[13px] font-medium text-soluk transition-all hover:border-mavi-orta hover:text-mavi"
      >
        Geçmişe Kaydet
      </button>
      {durum === "hata" && (
        <span role="alert" className="text-[13px] text-[#8C1B1B]">
          Kaydedilemedi. Tarayıcınız bu sitede veri saklamaya izin vermiyor olabilir.
        </span>
      )}
    </div>
  );
}
