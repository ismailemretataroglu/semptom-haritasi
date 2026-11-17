import TahlilYorumla from "@/components/TahlilYorumla";

export const metadata = { title: "Tahlil Yorumla" };

export default function Tahlil() {
  return (
    <main>
      <div className="border-b border-cizgi bg-white px-4 py-5 md:p-8">
        <h1 className="mb-1.5 text-[22px] font-bold text-yazi md:text-[28px]">
          Tahlilini Yorumla
        </h1>
        <p className="text-sm text-soluk">
          Kan tahlili sonucunuzu yükleyin, yapay zeka anlaşılır bir analiz yapsın.
        </p>
      </div>

      <TahlilYorumla />
    </main>
  );
}
