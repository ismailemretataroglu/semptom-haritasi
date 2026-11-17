// Geçmiş kayıtlar: tarayıcının localStorage alanında saklanır.
// Veriler sunucuya gönderilmez; sadece bu tarayıcıda, bu cihazda durur.

import { useMemo, useSyncExternalStore } from "react";
import type { AnalizSonucu } from "@/lib/analiz";
import type { Siddet } from "@/lib/bolgeler";
import type { EkBilgi } from "@/lib/sorular";
import type { TahlilSonucu } from "@/lib/tahlil";

export type AgriKaydi = {
  id: string;
  tarih: string; // ISO biçiminde, ör. "2026-11-16T15:30:00.000Z"
  tur: "agri";
  bolgeler: { ad: string; siddet: Siddet }[];
  belirtiler: string[];
  ek: EkBilgi;
  acil: boolean; // kural tabanlı acil uyarı çıkmış mıydı?
  sonuc: AnalizSonucu;
};

export type TahlilKaydi = {
  id: string;
  tarih: string;
  tur: "tahlil";
  dosyaAdi: string;
  sonuc: TahlilSonucu;
};

export type Kayit = AgriKaydi | TahlilKaydi;

// Kaydederken id ve tarihi biz veririz, çağıran vermez.
export type YeniKayit = Omit<AgriKaydi, "id" | "tarih"> | Omit<TahlilKaydi, "id" | "tarih">;

const ANAHTAR = "semptom-haritasi:gecmis";
const DEGISTI = "semptom-haritasi:gecmis-degisti";
const AZAMI_KAYIT = 50;

function hamOku(): string {
  try {
    return localStorage.getItem(ANAHTAR) ?? "[]";
  } catch {
    return "[]"; // gizli sekme vb. durumlarda localStorage kapalı olabilir
  }
}

function coz(ham: string): Kayit[] {
  try {
    const veri = JSON.parse(ham);
    return Array.isArray(veri) ? veri : [];
  } catch {
    return [];
  }
}

function yaz(kayitlar: Kayit[]): boolean {
  try {
    localStorage.setItem(ANAHTAR, JSON.stringify(kayitlar));
    // Aynı sekmedeki bileşenlere "liste değişti" haberi ver
    window.dispatchEvent(new Event(DEGISTI));
    return true;
  } catch {
    return false; // alan dolu ya da localStorage kapalı
  }
}

export function kayitEkle(yeni: YeniKayit): boolean {
  const kayit = {
    ...yeni,
    id: crypto.randomUUID(),
    tarih: new Date().toISOString(),
  } as Kayit;
  // En yeni kayıt başa gelir; liste AZAMI_KAYIT'ı geçerse en eskiler düşer
  return yaz([kayit, ...coz(hamOku())].slice(0, AZAMI_KAYIT));
}

export function kayitSil(id: string) {
  yaz(coz(hamOku()).filter((k) => k.id !== id));
}

export function tumunuSil() {
  yaz([]);
}

function aboneOl(haberVer: () => void) {
  window.addEventListener(DEGISTI, haberVer); // bu sekmedeki değişiklikler
  window.addEventListener("storage", haberVer); // başka sekmedeki değişiklikler
  return () => {
    window.removeEventListener(DEGISTI, haberVer);
    window.removeEventListener("storage", haberVer);
  };
}

// Bileşenlerin geçmişi okuması için hook. Liste değişince bileşen yeniden çizilir.
export function useGecmis(): Kayit[] {
  // useSyncExternalStore: React dışındaki bir kaynağı (localStorage) güvenle okur.
  // Üçüncü parametre sunucudaki değerdir; sunucuda localStorage olmadığı için boş liste.
  const ham = useSyncExternalStore(aboneOl, hamOku, () => "[]");
  return useMemo(() => coz(ham), [ham]);
}
