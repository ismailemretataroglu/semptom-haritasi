import type { Parametre, ParametreDurumu, TahlilSonucu } from "@/lib/tahlil";

// Renkler eski tahlil.js ile aynı
const durumStili: Record<ParametreDurumu, { etiket: string; yazi: string; zemin: string }> = {
  YUKSEK: { etiket: "↑ Yüksek", yazi: "text-[#8C1B1B]", zemin: "bg-[#FBE8E8]" },
  DUSUK: { etiket: "↓ Düşük", yazi: "text-[#1B5E8C]", zemin: "bg-[#EAF3FB]" },
  NORMAL: { etiket: "✓ Normal", yazi: "text-[#1F6B45]", zemin: "bg-[#EBF5F0]" },
};

function ParametreKarti({ p }: { p: Parametre }) {
  const stil = durumStili[p.durum] ?? durumStili.NORMAL;
  return (
    <div className="min-w-[140px] break-inside-avoid rounded-lg border border-cizgi bg-white p-3.5">
      <p className="mb-1 text-xs text-silik">{p.ad}</p>
      <p className={`mb-0.5 text-xl font-semibold ${stil.yazi}`}>{p.deger}</p>
      <p className="mb-1.5 min-h-4 text-[11px] text-silik">{p.referans}</p>
      <span className={`rounded-[10px] px-2 py-0.5 text-[11px] font-semibold ${stil.yazi} ${stil.zemin}`}>
        {stil.etiket}
      </span>
    </div>
  );
}

// Tahlil sonucunun görünümü: değer kartları + yapay zeka yorumu.
// Hem Tahlil sayfasında hem Geçmiş sayfasında kullanılır.
export default function TahlilSonuclari({ sonuc }: { sonuc: TahlilSonucu }) {
  const normalDisi = sonuc.parametreler.filter((p) => p.durum !== "NORMAL").length;

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-silik">
        Test Parametreleri
        {sonuc.parametreler.length > 0 &&
          ` · ${sonuc.parametreler.length} test, ${normalDisi} normal dışı`}
      </p>
      <div className="mb-2 grid grid-cols-1 gap-2.5 min-[481px]:grid-cols-2 md:flex md:flex-wrap">
        {sonuc.parametreler.map((p, i) => (
          <ParametreKarti key={`${p.ad}-${i}`} p={p} />
        ))}
      </div>

      <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-[0.06em] text-silik">
        AI Yorumu
      </p>
      <div className="overflow-hidden rounded-xl border border-cizgi bg-white">
        <div className="border-b border-cizgi bg-mavi-zemin px-5 py-3 text-[13px] font-semibold text-mavi">
          Semptom Haritası Değerlendirmesi
        </div>
        <div className="p-5 text-sm leading-[1.7] text-yazi">{sonuc.yorum}</div>
      </div>

      <p className="mt-3 text-xs text-silik">
        Bu yorum yapay zeka tarafından üretilmiştir ve kesin teşhis değildir. Sonuçlarınızı
        doktorunuzla değerlendirin.
      </p>
    </div>
  );
}
