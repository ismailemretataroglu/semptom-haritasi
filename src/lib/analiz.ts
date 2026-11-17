// Tarayıcı ile sunucu arasında gidip gelen verinin şekli.
// İki taraf da bu dosyayı kullandığı için birbirleriyle uyumsuz olamazlar.

import type { Siddet } from "@/lib/bolgeler";
import type { EkBilgi } from "@/lib/sorular";

// Tarayıcının sunucuya gönderdiği
export type AnalizIstegi = {
  bolgeler: { id: string; siddet: Siddet }[];
  belirtiler: string[];
  ek: EkBilgi;
};

export type Aciliyet = "DUSUK" | "ORTA" | "YUKSEK";

// Sunucunun tarayıcıya döndürdüğü
export type AnalizSonucu = {
  aciliyet: Aciliyet;
  ozet: string;
  nedenler: { ad: string; aciklama: string }[];
  oneriler: string[];
  dikkat: string[];
  bolum: string; // hangi bölüme başvurulmalı (ör. "Kardiyoloji")
};
