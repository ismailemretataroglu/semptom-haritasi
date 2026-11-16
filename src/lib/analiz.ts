// Tarayıcı ile sunucu arasında gidip gelen verinin şekli.
// İki taraf da bu dosyayı kullandığı için birbirleriyle uyumsuz olamazlar.

import type { Siddet } from "@/lib/bolgeler";

// Tarayıcının sunucuya gönderdiği
export type AnalizIstegi = {
  bolgeler: { id: string; siddet: Siddet }[];
  belirtiler: string[];
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
