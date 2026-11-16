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

      <div className="mx-auto max-w-[800px] px-4 py-6 md:px-20 md:py-8">
        <div className="mb-6 cursor-pointer rounded-xl border-2 border-dashed border-[#D0CAC0] bg-white px-8 py-12 text-center transition-all hover:border-mavi hover:bg-mavi-zemin">
          <p className="mb-1.5 text-base text-yazi">Dosya Seç veya Sürükle</p>
          <small className="text-[13px] text-silik">PNG, JPG veya PDF</small>
        </div>
      </div>
    </main>
  );
}
