// Kural tabanlı acil durum kontrolü.
//
// Bu dosyada yapay zeka YOK. Bazı belirti kombinasyonları o kadar kritiktir ki
// yapay zekanın cevabını beklemeden ve ona güvenmeden uyarı göstermek gerekir.
// Kurallar bilerek az ve basit tutuldu; tam bir tıbbi tarama değildir.
//
// Aynı fonksiyon hem tarayıcıda (anında uyarı için) hem sunucuda
// (aciliyeti YÜKSEK'e sabitlemek için) çalışır.

import type { Bolge, Siddet } from "@/lib/bolgeler";

export type AcilUyari = {
  duzey: "112" | "acil-servis";
  baslik: string;
  mesaj: string;
};

type Secilen = { bolge: Bolge; siddet: Siddet | null };

export function acilKontrol(secilenler: Secilen[], belirtiler: string[]): AcilUyari | null {
  // Yardımcılar: kuralları okunur yazabilmek için
  const var_ = (kosul: (s: Secilen) => boolean) => secilenler.some(kosul);
  const belirti = (ad: string) => belirtiler.includes(ad);
  const enAzOrta = (s: Secilen) => s.siddet === "orta" || s.siddet === "siddetli";
  const siddetli = (s: Secilen) => s.siddet === "siddetli";

  const gogus = (s: Secilen) => s.bolge.gorunum === "on" && s.bolge.kod === "govdeUst";
  const solKolVeyaOmuz = (s: Secilen) =>
    s.bolge.taraf === "sol" && ["omuz", "ustKol", "onKol"].includes(s.bolge.kod);
  const boyunVeyaEnse = (s: Secilen) => s.bolge.kod === "boyun";
  const bas = (s: Secilen) => s.bolge.kod === "bas";
  const karin = (s: Secilen) => s.bolge.gorunum === "on" && s.bolge.kod === "govdeOrta";
  const altBacak = (s: Secilen) => s.bolge.kod === "altBacak";

  // KURAL 1: Kalp krizi şüphesi
  // - Orta/şiddetli göğüs ağrısı + sol kola, omuza veya boyna yayılma
  // - Herhangi bir şiddette göğüs ağrısı + nefes darlığı
  // - Şiddetli göğüs ağrısı + baskı hissi
  const gogusOrta = var_((s) => gogus(s) && enAzOrta(s));
  const gogusSiddetli = var_((s) => gogus(s) && siddetli(s));
  if (
    (gogusOrta && (var_(solKolVeyaOmuz) || var_(boyunVeyaEnse))) ||
    (var_(gogus) && belirti("Nefes darlığı")) ||
    (gogusSiddetli && belirti("Baskı hissi"))
  ) {
    return {
      duzey: "112",
      baslik: "Acil belirti kombinasyonu",
      mesaj:
        "Göğüs ağrısının sol kola, omuza veya boyna yayılması ya da nefes darlığı ve baskı hissiyle birlikte görülmesi kalp kaynaklı olabilir. Beklemeyin, hemen 112'yi arayın.",
    };
  }

  // KURAL 2: Menenjit / beyin kaynaklı acil durum şüphesi
  // Şiddetli baş ağrısı + ateş + ense sertliği
  if (
    var_((s) => bas(s) && siddetli(s)) &&
    belirti("Ateş") &&
    (var_(boyunVeyaEnse) || belirti("Boyun tutulması") || belirti("Tutulma"))
  ) {
    return {
      duzey: "112",
      baslik: "Acil belirti kombinasyonu",
      mesaj:
        "Şiddetli baş ağrısının ateş ve ense sertliğiyle birlikte görülmesi acil değerlendirme gerektirir. Hemen 112'yi arayın.",
    };
  }

  // KURAL 3: Akciğere pıhtı atması şüphesi
  // Bacakta şişlik + nefes darlığı
  if (var_(altBacak) && belirti("Şişlik") && belirti("Nefes darlığı")) {
    return {
      duzey: "112",
      baslik: "Acil belirti kombinasyonu",
      mesaj:
        "Bacakta ağrı ve şişliğin nefes darlığıyla birlikte görülmesi damar tıkanıklığına işaret edebilir. Hemen 112'yi arayın.",
    };
  }

  // KURAL 4: Akut karın şüphesi
  // Şiddetli karın ağrısı + kusma
  if (var_((s) => karin(s) && siddetli(s)) && belirti("Kusma")) {
    return {
      duzey: "acil-servis",
      baslik: "Acil değerlendirme gerekebilir",
      mesaj:
        "Şiddetli karın ağrısının kusmayla birlikte görülmesi acil müdahale gerektiren bir duruma işaret edebilir. Vakit kaybetmeden en yakın acil servise başvurun.",
    };
  }

  return null;
}
