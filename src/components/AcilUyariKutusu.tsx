import type { AcilUyari } from "@/lib/acil";

export default function AcilUyariKutusu({ uyari }: { uyari: AcilUyari }) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-xl border border-[#F1B5B5] bg-[#FBE8E8] p-5 text-[#8C1B1B] md:flex-row md:items-center"
    >
      <div className="flex-1">
        <p className="mb-1 text-[15px] font-semibold">⚠ {uyari.baslik}</p>
        <p className="text-sm leading-relaxed">{uyari.mesaj}</p>
        <p className="mt-2 text-xs opacity-80">
          Bu uyarı yapay zekadan bağımsız, sabit kurallarla gösterilir.
        </p>
      </div>

      {uyari.duzey === "112" && (
        <a
          href="tel:112"
          className="shrink-0 rounded-lg bg-[#C53030] px-5 py-3 text-center text-[15px] font-bold text-white transition-colors hover:bg-[#9B2C2C]"
        >
          112&apos;yi Ara
        </a>
      )}
    </div>
  );
}
