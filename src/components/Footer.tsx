export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 border-t border-cizgi bg-white p-8 text-center print:hidden">
      <p className="text-sm text-soluk">
        💧 Sağlığınız için günde en az 2 litre su içmeyi unutmayın.
      </p>
      <p className="text-sm text-soluk">
        🚶 Düzenli yürüyüş bağışıklık sisteminizi güçlendirir.
      </p>
      <p className="text-sm text-soluk">
        😴 Kaliteli uyku, vücudunuzun en iyi ilacıdır.
      </p>
      <p className="mt-2 text-xs text-silik">
        © 2026 Semptom Haritası — Tıbbi tavsiye niteliği taşımaz.
      </p>
    </footer>
  );
}
