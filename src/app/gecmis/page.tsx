import GecmisListesi from "@/components/GecmisListesi";

export const metadata = { title: "Geçmiş Kayıtlar" };

export default function Gecmis() {
  return (
    <main>
      <div className="border-b border-cizgi bg-white px-4 py-5 md:p-8">
        <h1 className="mb-1.5 text-[22px] font-bold text-yazi md:text-[28px]">Geçmiş Kayıtlar</h1>
        <p className="text-sm text-soluk">
          Kaydettiğiniz değerlendirmeler. Doktorunuza götürmek için yazdırabilir ya da PDF olarak
          kaydedebilirsiniz.
        </p>
      </div>

      <GecmisListesi />
    </main>
  );
}
