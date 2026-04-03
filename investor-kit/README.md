# MuPark Investor Kit

Bu klasor, yatirimci sunumu ve sesli tanitim videosunu hizli ve tutarli sekilde uretmek icin hazirlandi.

## Hedef

- Tek bir merkezden sunum anlatisi, sayisal veriler, video metni ve cekim plani yonetmek
- Her gorusme turu icin tarihli bir calisma paketi olusturmak
- Ekipte ayni dil ve ayni hikayeyi korumak

## Klasor Yapisi

- `templates/`: Tekrar kullanilabilir sunum ve video sablonlari
  - TR: `*-tr.md`, `subtitle-template.srt`
  - EN: `*-en.md`, `subtitle-template-en.srt`
- `runs/`: Her pitch turu icin olusan tarihli calisma klasorleri

## Hizli Baslangic

1. Asagidaki komutla yeni pitch paketi olustur:
   - `npm run pitch:init -- tobb-demo`
2. Olusan klasoru ac:
   - `investor-kit/runs/YYYY-MM-DD-tobb-demo/`
3. `brief.md` dosyasinda toplanti hedefini doldur.
4. `presentation/` altinda hedef dile gore deck sablonunu doldur.
5. `presentation/embed-config.json` dosyasina PDF/PPT/E-kitap URL'lerini gir.
6. `video/` altinda hedef dile gore voice-over, shot list ve SRT dosyasini doldur.
7. `video/publish-config.json` dosyasina yayinlanacak video kimliklerini (YouTube/Vimeo/MP4) gir.
8. Gorselleri `assets/raw/`, final ciktilari `assets/exports/` altina koy.

## Onerilen Uretim Akisi

1. Deger onerisi ve problem anlatisini kesinlestir.
2. KPI ve pilot metrikleri `metrics-input-template.md` uzerinden topla.
3. 10 slaytlik deck'i tamamla.
4. 60-90 sn seslendirme metnini tamamla.
5. Shot list + altyazi dosyasini guncelle.
6. Prova videosu al, metin surelerini optimize et.
