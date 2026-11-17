// Bu dosya SUNUCUDA çalışır, tarayıcıya gönderilmez.
// API anahtarı sadece burada kullanıldığı için kullanıcılar onu göremez.
// Adres: POST /api/analiz

import { acilKontrol } from "@/lib/acil";
import type { AnalizSonucu } from "@/lib/analiz";
import { bolgeler, type Bolge, type Siddet } from "@/lib/bolgeler";
import { agriTipleri, cinsiyetler, sureler } from "@/lib/sorular";

const MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const siddetAdi: Record<Siddet, string> = {
  hafif: "hafif",
  orta: "orta",
  siddetli: "şiddetli",
};

// Gemini'ye "cevabı tam olarak bu şekilde ver" dediğimiz şema.
// Böylece cevap her zaman aynı alanlara sahip bir JSON olur.
const cevapSemasi = {
  type: "OBJECT",
  properties: {
    aciliyet: { type: "STRING", enum: ["DUSUK", "ORTA", "YUKSEK"] },
    ozet: { type: "STRING" },
    nedenler: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { ad: { type: "STRING" }, aciklama: { type: "STRING" } },
        required: ["ad", "aciklama"],
      },
    },
    oneriler: { type: "ARRAY", items: { type: "STRING" } },
    dikkat: { type: "ARRAY", items: { type: "STRING" } },
    bolum: { type: "STRING" },
  },
  required: ["aciliyet", "ozet", "nedenler", "oneriler", "dikkat", "bolum"],
};

const sistemTalimati = `Sen deneyimli bir Türk aile hekimisin. Kullanıcının bildirdiği ağrı bölgelerini ve belirtileri BİRLİKTE değerlendir; bölgeler arasındaki olası ilişkiyi de düşün.

Kurallar:
- Türkçe, sıcak ve anlaşılır bir dil kullan. Tıbbi terim kullanırsan kısaca açıkla.
- Kesin teşhis koyma; "olabilir", "düşündürebilir" gibi ifadeler kullan.
- aciliyet: DUSUK, ORTA veya YUKSEK.
- ozet: 2-3 cümlelik genel değerlendirme.
- nedenler: en olası 2-3 neden; her biri için kısa ad ve bir cümlelik açıklama.
- oneriler: 2-4 madde; ne yapmalı, ne zaman doktora gitmeli.
- dikkat: 1-3 madde; görülürse hemen yardım alınması gereken belirtiler.
- bolum: başvurulması en uygun tek bölüm (ör. "Aile Hekimliği", "Kardiyoloji", "Acil Servis").`;

function hata(mesaj: string, durum: number) {
  return Response.json({ hata: mesaj }, { status: durum });
}

export async function POST(request: Request) {
  // 1) Anahtar var mı?
  const anahtar = process.env.GEMINI_API_KEY;
  if (!anahtar) {
    return hata("Sunucuda GEMINI_API_KEY tanımlı değil (.env.local dosyasını kontrol edin).", 500);
  }

  // 2) Gelen veriyi oku ve doğrula.
  //    Tarayıcıdan gelen hiçbir şeye güvenmiyoruz: sadece bizim listemizdeki
  //    bölge ve belirtileri kabul ediyoruz. Böylece kimse araya kendi
  //    metnini sokup yapay zekaya başka bir şey yaptıramaz.
  let govde: unknown;
  try {
    govde = await request.json();
  } catch {
    return hata("Geçersiz istek.", 400);
  }

  const {
    bolgeler: gelenBolgeler,
    belirtiler: gelenBelirtiler,
    ek: gelenEk,
  } = (govde ?? {}) as { bolgeler?: unknown; belirtiler?: unknown; ek?: unknown };

  if (!Array.isArray(gelenBolgeler) || gelenBolgeler.length === 0 || gelenBolgeler.length > 12) {
    return hata("En az bir bölge seçilmelidir.", 400);
  }

  const secilenler: { bolge: Bolge; siddet: Siddet }[] = [];
  for (const g of gelenBolgeler) {
    const bolge = bolgeler.find((b) => b.id === g?.id);
    if (!bolge || typeof g?.siddet !== "string" || !Object.hasOwn(siddetAdi, g.siddet)) {
      return hata("Geçersiz bölge veya şiddet.", 400);
    }
    secilenler.push({ bolge, siddet: g.siddet as Siddet });
  }

  const izinliBelirtiler = new Set(secilenler.flatMap((s) => s.bolge.belirtiler));
  const belirtiler = Array.isArray(gelenBelirtiler)
    ? gelenBelirtiler.filter((b): b is string => typeof b === "string" && izinliBelirtiler.has(b))
    : [];

  // Ek bilgiler isteğe bağlı; sadece bizim listemizdeki cevapları kabul et
  const ek = (gelenEk && typeof gelenEk === "object" ? gelenEk : {}) as Record<string, unknown>;
  const listeden = (deger: unknown, liste: string[]) =>
    typeof deger === "string" && liste.includes(deger) ? deger : null;
  const sure = listeden(ek.sure, sureler);
  const tip = listeden(ek.tip, agriTipleri);
  const cinsiyet = listeden(ek.cinsiyet, cinsiyetler);
  const yas =
    typeof ek.yas === "number" && Number.isInteger(ek.yas) && ek.yas >= 0 && ek.yas <= 120
      ? ek.yas
      : null;

  // Kural tabanlı acil durum kontrolü (tarayıcıdakiyle aynı fonksiyon)
  const acil = acilKontrol(secilenler, belirtiler);

  // 3) Soruyu hazırla
  const satirlar = [
    "Kullanıcının şikayetleri:",
    ...secilenler.map((s) => `- ${s.bolge.ad}: ${siddetAdi[s.siddet]} ağrı`),
    `- Ek belirtiler: ${belirtiler.length ? belirtiler.join(", ") : "belirtilmedi"}`,
  ];
  if (sure) satirlar.push(`- Süre: ${sure}`);
  if (tip) satirlar.push(`- Ağrının tipi: ${tip}`);
  if (yas !== null) satirlar.push(`- Yaş: ${yas}`);
  if (cinsiyet) satirlar.push(`- Cinsiyet: ${cinsiyet}`);
  const soru = satirlar.join("\n");

  // 4) Gemini'ye gönder
  let cevap: Response;
  try {
    cevap = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": anahtar },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sistemTalimati }] },
        contents: [{ role: "user", parts: [{ text: soru }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
          responseSchema: cevapSemasi,
        },
      }),
    });
  } catch (e) {
    console.error("Gemini'ye ulaşılamadı:", e);
    return hata("Yapay zeka servisine ulaşılamadı. İnternet bağlantınızı kontrol edin.", 502);
  }

  if (!cevap.ok) {
    // Ayrıntıyı sadece sunucu terminaline yazıyoruz, kullanıcıya göstermiyoruz.
    console.error("Gemini hatası:", cevap.status, await cevap.text());
    if (cevap.status === 429) {
      return hata("Çok fazla istek gönderildi. Biraz bekleyip tekrar deneyin.", 429);
    }
    return hata("Yapay zeka servisi hata verdi. Lütfen tekrar deneyin.", 502);
  }

  // 5) Cevabı çöz
  try {
    const veri = await cevap.json();
    const metin: string = veri.candidates[0].content.parts[0].text;
    const sonuc = JSON.parse(metin) as AnalizSonucu;

    // Kurallarımız acil diyorsa, yapay zeka ne derse desin aciliyet YÜKSEK kalır
    if (acil) sonuc.aciliyet = "YUKSEK";
    return Response.json(sonuc);
  } catch (e) {
    console.error("Gemini cevabı çözülemedi:", e);
    return hata("Yapay zekadan anlaşılır bir cevap alınamadı. Tekrar deneyin.", 502);
  }
}
