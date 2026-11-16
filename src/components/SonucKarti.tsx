import type { Aciliyet, AnalizSonucu } from "@/lib/analiz";

// Rozet renkleri eski sitedeki .badge.low / .med / .high ile aynı
const rozet: Record<Aciliyet, { yazi: string; sinif: string }> = {
  DUSUK: { yazi: "✓ Düşük Aciliyet", sinif: "bg-[#EBF5F0] text-[#1F6B45]" },
  ORTA: { yazi: "⚡ Orta Aciliyet", sinif: "bg-[#FBF3E8] text-[#8C5A1B]" },
  YUKSEK: { yazi: "⚠ Yüksek Aciliyet", sinif: "bg-[#FBE8E8] text-[#8C1B1B]" },
};

function Bolum({ baslik, children }: { baslik: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-1 font-semibold text-yazi">{baslik}</h4>
      {children}
    </div>
  );
}

export default function SonucKarti({ sonuc }: { sonuc: AnalizSonucu }) {
  const r = rozet[sonuc.aciliyet] ?? rozet.ORTA;

  return (
    <div className="overflow-hidden rounded-xl border border-cizgi bg-white">
      <div className="flex items-center justify-between border-b border-cizgi bg-mavi-zemin px-5 py-3 text-[13px] font-semibold text-mavi">
        <span>Değerlendirme</span>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${r.sinif}`}>{r.yazi}</span>
      </div>

      <div className="flex flex-col gap-4 p-5 text-sm leading-[1.7] text-yazi">
        <p>{sonuc.ozet}</p>

        <Bolum baslik="Olası Nedenler">
          <ul className="list-disc pl-5">
            {sonuc.nedenler.map((n) => (
              <li key={n.ad}>
                <strong>{n.ad}:</strong> {n.aciklama}
              </li>
            ))}
          </ul>
        </Bolum>

        <Bolum baslik="Öneriler">
          <ul className="list-disc pl-5">
            {sonuc.oneriler.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </Bolum>

        <Bolum baslik="Dikkat">
          <ul className="list-disc pl-5">
            {sonuc.dikkat.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </Bolum>

        <p className="rounded-lg bg-mavi-acik px-4 py-3 text-mavi">
          <strong>Başvurulabilecek bölüm:</strong> {sonuc.bolum}
        </p>

        <p className="text-xs text-silik">
          Bu değerlendirme yapay zeka tarafından üretilmiştir ve kesin teşhis değildir.
          Şikayetleriniz için bir doktora başvurun.
        </p>
      </div>
    </div>
  );
}
