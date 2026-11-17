// Vücut bölgeleri: haritada çizilecek şekil + o bölgeye özel ek belirtiler.
// Çizim alanı 240 x 545 birim, vücudun orta çizgisi x = 120.

export type Siddet = "hafif" | "orta" | "siddetli";

// Şiddetin ekranda ve yapay zekaya gönderilen metinde görünen adı
export const siddetAdlari: Record<Siddet, string> = {
  hafif: "hafif",
  orta: "orta",
  siddetli: "şiddetli",
};
export type Gorunum = "on" | "arka";

export type Taraf = "sag" | "sol";

export type Bolge = {
  id: string;
  ad: string;
  gorunum: Gorunum;
  kod: string; // parçanın türü: "govdeUst", "ustKol", "diz"...
  taraf: Taraf | null; // kişinin sağı mı solu mu (ortadaki parçalarda null)
  belirtiler: string[];
  d: string; // SVG path: şeklin çizgisi
  ayna: boolean; // true ise şekil orta çizgiye göre aynalanır (karşı taraf)
};

// --- ŞEKİLLER ---------------------------------------------------------------
// Ortadaki parçalar bir kez çizilir.
const sekilOrta = {
  bas: "M120 10 C137 10 146 24 146 40 C146 58 135 72 120 72 C105 72 94 58 94 40 C94 24 103 10 120 10 Z",
  boyun: "M109 68 L131 68 L132 82 Q140 89 149 93 L91 93 Q100 89 108 82 Z",
  govdeUst:
    "M91 97 L149 97 Q158 99 163 107 L165 125 L165 150 Q165 163 161 172 L79 172 Q75 163 75 150 L75 125 L77 107 Q82 99 91 97 Z",
  govdeOrta: "M79 176 L161 176 C159 190 157 205 158 222 L82 222 C83 205 81 190 79 176 Z",
  govdeAlt:
    "M82 226 L158 226 C162 240 165 255 166 268 L128 288 Q120 294 112 288 L74 268 C75 255 78 240 82 226 Z",
};

// Yandaki parçalar sadece ekranın SOL tarafı için çizilir,
// karşı taraf aynalanarak elde edilir.
const sekilYan = {
  omuz: "M91 95 C78 93 64 96 58 106 C54 113 53 120 53 127 L74 124 L76 106 Q81 98 91 95 Z",
  ustKol: "M53 131 L74 128 C76 150 73 180 71 204 L51 204 C49 180 50 150 53 131 Z",
  onKol: "M51 208 L71 208 C70 235 64 265 60 288 L44 286 C44 262 47 232 51 208 Z",
  el: "M44 291 L60 293 C62 305 60 320 54 328 C48 332 41 326 40 314 C39 305 41 297 44 291 Z",
  uyluk: "M73 272 L114 293 Q118 296 118 302 C118 330 115 360 112 384 L84 384 C78 355 72 310 73 272 Z",
  diz: "M84 388 L112 388 C113 398 112 408 111 414 L86 414 C84 406 83 397 84 388 Z",
  altBacak: "M86 418 L111 418 C113 440 110 475 107 504 L93 504 C88 478 84 445 86 418 Z",
  ayak: "M93 508 L107 508 C109 516 110 524 108 530 C104 536 88 537 82 532 C80 527 86 518 93 508 Z",
};

// --- BELİRTİLER -------------------------------------------------------------
const belirti = {
  bas: ["Baş ağrısı", "Baş dönmesi", "Bulantı", "Ateş"],
  boyun: ["Boyun tutulması", "Yutma güçlüğü", "Şişlik"],
  ense: ["Tutulma", "Baş ağrısı", "Uyuşma"],
  gogus: ["Baskı hissi", "Nefes darlığı", "Yanma", "Çarpıntı"],
  karin: ["Kramp", "Şişkinlik", "Bulantı", "Kusma"],
  kasik: ["Yanma", "Şişlik", "Kramp", "İdrar yaparken ağrı"],
  sirt: ["Kas spazmı", "Tutulma", "Nefes alırken ağrı", "Yanma"],
  bel: ["Tutulma", "Bacağa yayılan ağrı", "Uyuşma", "Hareket kısıtlılığı"],
  kalca: ["Bacağa yayılan ağrı", "Uyuşma", "Oturunca artan ağrı"],
  omuz: ["Hareket kısıtlılığı", "Tutulma", "Şişlik"],
  kol: ["Uyuşma", "Kas ağrısı", "Şişlik"],
  el: ["Uyuşma", "Karıncalanma", "Şişlik", "Güçsüzlük"],
  bacak: ["Kramp", "Şişlik", "Uyuşma", "Kas ağrısı"],
  diz: ["Şişlik", "Tutulma", "Kilitlenme", "Ses gelmesi"],
  ayak: ["Şişlik", "Uyuşma", "Karıncalanma", "Morarma"],
};

// --- LİSTEYİ OLUŞTURMA ------------------------------------------------------
// Yan parçaların ön ve arka görünümdeki adları.
const yanParcalar: {
  kod: keyof typeof sekilYan;
  onAd: string;
  arkaAd: string;
  belirtiler: string[];
}[] = [
  { kod: "omuz", onAd: "Omuz", arkaAd: "Omuz", belirtiler: belirti.omuz },
  { kod: "ustKol", onAd: "Üst Kol", arkaAd: "Üst Kol", belirtiler: belirti.kol },
  { kod: "onKol", onAd: "Ön Kol", arkaAd: "Ön Kol", belirtiler: belirti.kol },
  { kod: "el", onAd: "El", arkaAd: "El", belirtiler: belirti.el },
  { kod: "uyluk", onAd: "Uyluk", arkaAd: "Arka Uyluk", belirtiler: belirti.bacak },
  { kod: "diz", onAd: "Diz", arkaAd: "Diz Arkası", belirtiler: belirti.diz },
  { kod: "altBacak", onAd: "Alt Bacak", arkaAd: "Baldır", belirtiler: belirti.bacak },
  { kod: "ayak", onAd: "Ayak", arkaAd: "Topuk", belirtiler: belirti.ayak },
];

function yanBolgeler(gorunum: Gorunum): Bolge[] {
  // Önden bakınca kişinin SAĞ tarafı ekranın solunda kalır.
  // Arkadan bakınca kişinin SOL tarafı ekranın solunda kalır.
  const ekranSolu = gorunum === "on" ? "Sağ" : "Sol";
  const ekranSagi = gorunum === "on" ? "Sol" : "Sağ";

  return yanParcalar.flatMap((p) => {
    const ad = gorunum === "on" ? p.onAd : p.arkaAd;
    return [
      {
        id: `${gorunum}-${p.kod}-1`,
        ad: `${ekranSolu} ${ad}`,
        gorunum,
        kod: p.kod,
        taraf: gorunum === "on" ? "sag" : "sol",
        belirtiler: p.belirtiler,
        d: sekilYan[p.kod],
        ayna: false,
      },
      {
        id: `${gorunum}-${p.kod}-2`,
        ad: `${ekranSagi} ${ad}`,
        gorunum,
        kod: p.kod,
        taraf: gorunum === "on" ? "sol" : "sag",
        belirtiler: p.belirtiler,
        d: sekilYan[p.kod],
        ayna: true,
      },
    ];
  });
}

function orta(
  gorunum: Gorunum,
  kod: keyof typeof sekilOrta,
  ad: string,
  belirtiler: string[],
): Bolge {
  return {
    id: `${gorunum}-${kod}`,
    ad,
    gorunum,
    kod,
    taraf: null,
    belirtiler,
    d: sekilOrta[kod],
    ayna: false,
  };
}

export const bolgeler: Bolge[] = [
  // Ön görünüm
  orta("on", "boyun", "Boyun", belirti.boyun),
  orta("on", "bas", "Baş", belirti.bas),
  orta("on", "govdeUst", "Göğüs", belirti.gogus),
  orta("on", "govdeOrta", "Karın", belirti.karin),
  orta("on", "govdeAlt", "Kasık", belirti.kasik),
  ...yanBolgeler("on"),

  // Arka görünüm
  orta("arka", "boyun", "Ense", belirti.ense),
  orta("arka", "bas", "Başın Arkası", belirti.bas),
  orta("arka", "govdeUst", "Sırt", belirti.sirt),
  orta("arka", "govdeOrta", "Bel", belirti.bel),
  orta("arka", "govdeAlt", "Kalça", belirti.kalca),
  ...yanBolgeler("arka"),
];
