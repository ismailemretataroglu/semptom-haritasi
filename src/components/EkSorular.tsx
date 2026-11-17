import Kart from "@/components/Kart";
import { agriTipleri, cinsiyetler, sureler, type EkBilgi } from "@/lib/sorular";

type Props = {
  deger: EkBilgi;
  onDegis: (yeni: EkBilgi) => void;
};

// Tek seçimlik hap butonlar. Seçili olana tekrar basılınca seçim kalkar.
function Secenekler({
  etiket,
  secenekler,
  secili,
  onSec,
}: {
  etiket: string;
  secenekler: string[];
  secili: string | undefined;
  onSec: (yeni: string | undefined) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[13px] text-soluk">{etiket}</p>
      <div className="flex flex-wrap gap-2">
        {secenekler.map((s) => (
          <button
            key={s}
            onClick={() => onSec(secili === s ? undefined : s)}
            aria-pressed={secili === s}
            className={`cursor-pointer rounded-full border-[1.5px] px-3.5 py-1.5 text-[13px] transition-all ${
              secili === s
                ? "border-mavi-orta bg-mavi-acik font-medium text-mavi"
                : "border-cizgi bg-white text-soluk hover:border-mavi-orta hover:text-mavi"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function EkSorular({ deger, onDegis }: Props) {
  return (
    <Kart baslik="Biraz Daha Anlatın (İsteğe Bağlı)">
      <div className="grid gap-5 md:grid-cols-2">
        <Secenekler
          etiket="Ne zamandır?"
          secenekler={sureler}
          secili={deger.sure}
          onSec={(sure) => onDegis({ ...deger, sure })}
        />
        <Secenekler
          etiket="Ağrının tipi"
          secenekler={agriTipleri}
          secili={deger.tip}
          onSec={(tip) => onDegis({ ...deger, tip })}
        />
        <Secenekler
          etiket="Cinsiyet"
          secenekler={cinsiyetler}
          secili={deger.cinsiyet}
          onSec={(cinsiyet) => onDegis({ ...deger, cinsiyet })}
        />
        <div>
          <label htmlFor="yas" className="mb-2 block text-[13px] text-soluk">
            Yaş
          </label>
          <input
            id="yas"
            type="number"
            min={0}
            max={120}
            inputMode="numeric"
            placeholder="örn. 35"
            value={deger.yas ?? ""}
            onChange={(e) => {
              const sayi = e.target.valueAsNumber;
              // Boş ya da geçersizse yaşı hiç gönderme
              const yas = Number.isInteger(sayi) && sayi >= 0 && sayi <= 120 ? sayi : undefined;
              onDegis({ ...deger, yas });
            }}
            className="w-28 rounded-lg border-[1.5px] border-cizgi bg-white px-3 py-1.5 text-[13px] text-yazi outline-none transition-colors focus:border-mavi-orta"
          />
        </div>
      </div>
    </Kart>
  );
}
