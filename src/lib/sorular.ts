// "Biraz daha anlatın" kartındaki soruların seçenekleri.
// Hem ekran hem sunucu bu listeleri kullanır: sunucu, listede olmayan
// bir cevabı kabul etmez.

export const sureler = ["Bugün başladı", "1-3 gündür", "1 haftadan uzun", "Aylardır"];
export const agriTipleri = ["Zonklayıcı", "Baskı tarzı", "Batıcı", "Yanıcı", "Künt"];
export const cinsiyetler = ["Kadın", "Erkek"];

// Hepsi isteğe bağlı: kullanıcı boş bırakabilir.
export type EkBilgi = {
  sure?: string;
  tip?: string;
  yas?: number;
  cinsiyet?: string;
};
