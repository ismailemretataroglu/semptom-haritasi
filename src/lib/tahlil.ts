// Tahlil sayfasında tarayıcı ile sunucu arasında gidip gelen verinin şekli.

export type ParametreDurumu = "NORMAL" | "YUKSEK" | "DUSUK";

export type Parametre = {
  ad: string; // ör. "Hemoglobin"
  deger: string; // değer ve birimi, ör. "11.2 g/dL"
  referans: string; // referans aralığı, ör. "13.5 - 17.5" (yoksa boş)
  durum: ParametreDurumu;
};

export type TahlilSonucu = {
  tahlilMi: boolean; // yüklenen dosya gerçekten bir tahlil sonucu mu?
  parametreler: Parametre[];
  yorum: string;
};

// Dosya kuralları: hem ekranda hem sunucuda aynı sınırlar kullanılır.
export const izinliTurler = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
export const azamiBoyut = 4 * 1024 * 1024; // 4 MB
