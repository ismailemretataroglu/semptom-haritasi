type KartProps = {
    baslik: string;
    children: React.ReactNode;
};

export default function Kart({ baslik, children }: KartProps) {
    return (
        <div className="rounded-xl border border-cizgi bg-white p-5">
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.07em] text-silik">
                {baslik}
            </h3>
            {children}
        </div>
    );
}