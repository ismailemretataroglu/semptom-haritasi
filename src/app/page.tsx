import AgriAnalizi from "@/components/AgriAnalizi";

export default function Home() {
  return (
    <main>
      <div className="border-b border-cizgi bg-white px-4 py-5 md:p-8">
        <h1 className="mb-1.5 text-[22px] font-bold text-yazi md:text-[28px]">
          Ağrıyan Bölgeyi Seçiniz
        </h1>
        <p className="text-sm text-soluk">
          Vücudunuzdaki bölgeyi seçin, şiddetini belirtin ve yapay zeka
          değerlendirmesi alın.
        </p>
      </div>

      <AgriAnalizi />
    </main>
  );
}
