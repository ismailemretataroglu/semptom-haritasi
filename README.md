# Semptom Haritası

Vücut haritası üzerinden ağrıyan bölgeleri seçip yapay zeka destekli bir ön değerlendirme alabileceğiniz, kan tahlili sonuçlarınızı anlaşılır bir dille yorumlatabileceğiniz bir web uygulaması.

> ⚕ **Tıbbi uyarı:** Bu uygulama bir öğrenme/portfolyo projesidir. Tıbbi teşhis koymaz ve doktor muayenesinin yerini tutmaz. Acil bir durumda **112**'yi arayın.

<!-- Ekran görüntülerini docs/ klasörüne koyup aşağıdaki satırları açın:
![Ağrı analizi](docs/agri-analizi.png)
![Tahlil yorumlama](docs/tahlil.png)
-->

## Özellikler

**Ağrı analizi**
- Ön ve arka görünümlü, 42 bölgeli etkileşimli vücut haritası (SVG)
- Aynı anda birden fazla bölge seçimi; her bölge için ayrı ağrı şiddeti
- Bölgeye özel ek belirtiler, isteğe bağlı süre / ağrı tipi / yaş / cinsiyet soruları
- Yapay zekadan şemaya bağlı (JSON) değerlendirme: aciliyet, olası nedenler, öneriler, dikkat edilmesi gerekenler ve başvurulabilecek bölüm
- **Kural tabanlı acil durum uyarısı:** Göğüs ağrısı + sol kola yayılma gibi kritik kombinasyonlarda yapay zekayı beklemeden 112 uyarısı gösterilir; bu durumda aciliyet sunucu tarafında da "Yüksek"e sabitlenir

**Tahlil yorumlama**
- PNG, JPG, WEBP veya PDF yükleme (tıklayarak ya da sürükle-bırak)
- Her test için değer, referans aralığı ve Normal / Yüksek / Düşük etiketi
- Anlaşılır Türkçe yapay zeka yorumu

**Geçmiş**
- Değerlendirmeleri tarayıcıda saklama (localStorage), listeleme ve silme
- Doktora götürmek için yazdırma / PDF olarak kaydetme

## Teknolojiler

| | |
|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router) + React |
| Dil | TypeScript |
| Stil | Tailwind CSS |
| Yapay zeka | Google Gemini API (`gemini-2.5-flash`, yapılandırılmış JSON çıktı) |

## Kurulum

Gereksinim: Node.js 20 veya üstü ve bir [Gemini API anahtarı](https://aistudio.google.com/apikey).

```bash
git clone https://github.com/ismailemretataroglu/semptom-haritasi.git
cd semptom-haritasi
npm install
cp .env.example .env.local   # sonra .env.local içine kendi anahtarınızı yazın
npm run dev
```

Tarayıcıda http://localhost:3000 adresini açın.

## Proje yapısı

```
src/
├── app/
│   ├── page.tsx               # Ağrı analizi sayfası
│   ├── tahlil/page.tsx        # Tahlil yorumlama sayfası
│   ├── gecmis/page.tsx        # Geçmiş kayıtlar sayfası
│   └── api/
│       ├── analiz/route.ts    # Ağrı değerlendirmesi (sunucu)
│       └── tahlil/route.ts    # Tahlil yorumlama (sunucu)
├── components/                # Arayüz bileşenleri (VucutHaritasi, SonucKarti...)
└── lib/
    ├── bolgeler.ts            # Vücut bölgeleri: şekiller ve belirtiler
    ├── acil.ts                # Kural tabanlı acil durum kontrolü
    ├── gecmis.ts              # localStorage ile geçmiş kayıtlar
    └── ...                    # Ortak tipler ve sabitler
```

## Güvenlik ve gizlilik

- **API anahtarı tarayıcıya hiç gönderilmez.** Tarayıcı yalnızca bu uygulamanın kendi sunucusuna (`/api/...`) istek atar; Gemini'ye istek sunucudan gider.
- **Gelen veriler doğrulanır.** Sunucu yalnızca uygulamanın kendi listesindeki bölge, şiddet, belirti ve cevapları kabul eder; kullanıcı yapay zekaya serbest metin gönderemez.
- **Yüklenen tahlil dosyaları saklanmaz.** Dosya yalnızca yorumlanmak üzere Gemini'ye iletilir. Not: Gemini API'nin ücretsiz katmanında Google gönderilen verileri ürün geliştirme amacıyla kullanabilir.
- **Geçmiş kayıtlar yalnızca kullanıcının tarayıcısında** tutulur, sunucuya gönderilmez.

## Sınırlamalar

- Acil durum kuralları (`src/lib/acil.ts`) bilinen temel uyarı işaretlerine dayanır, ancak **bir hekim tarafından doğrulanmamıştır** ve kapsamlı bir tıbbi tarama değildir.
- Yapay zeka tahlil değerlerini okurken hata yapabilir; sonuçlar her zaman asıl belgeyle karşılaştırılmalıdır.
- Yüklenebilecek dosya boyutu 4 MB ile sınırlıdır.
