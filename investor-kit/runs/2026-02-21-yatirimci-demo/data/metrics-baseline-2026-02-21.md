# MuPark Baseline Metrikleri

Tarih: 2026-02-21  
Kapsam: Kod tabanindaki mevcut implementasyon ve seed verisi

## 1) Urun ve Operasyon

- Pilot zone sayisi: `3`  
  Kaynak: `scripts/seed.ts`
- Toplam kapasite: `36` park alani (`12 + 14 + 10`)  
  Kaynak: `scripts/seed.ts`
- EV kose sayisi: `6` (zone basina 2 adet, toplam kapasitenin `%16.7`si)  
  Kaynak: `scripts/seed.ts`, `lib/services/liveSpot.ts`
- Saatlik ucret bandi: `4.2 - 5.0 TL` (ortalama `4.67 TL`)  
  Kaynak: `scripts/seed.ts`
- No-show ceza bandi: `35 - 45 TL` (ortalama `40 TL`)  
  Kaynak: `scripts/seed.ts`, `lib/models/zone.ts`
- Canli veri yenileme periyodu: `15 saniye`  
  Kaynak: `components/LiveDemo.tsx`

## 2) Akis ve Ozellik

- Surucu akisi: `4 adim` (Bul -> Rezerve et -> Rota -> Park et)  
  Kaynak: `components/HowItWorks.tsx`
- Demo panelinde canli operasyon: mevcut  
  Kaynak: `components/LiveDemo.tsx`, `app/api/live-spots/route.ts`
- QR tabanli check-in/out akisi: mevcut  
  Kaynak: `components/HowItWorks.tsx`, `scripts/seed.ts`

## 3) Seed Uzerinden Ornek KPI (Demo Referansi)

- Aktif rezervasyon adedi (pending + active): `2`
- Tamamlanan rezervasyon: `1`
- Seedlenen basarili islem geliri: `5.5 TL`
- Seed anlik doluluk (rezervasyon bazli): `%6` (`2/36`)

Not: Bu bolum yalnizca demo/seed ortamini temsil eder; saha KPI olarak kullanilmadan once pilot ortam verisiyle guncellenmelidir.

## 4) Pazarlama Iddialari (Dogrulama Gerektirir)

- AI dogruluk: `%99`
- Canli takip: `7/24`
- MVP suresi: `6 hafta`

Kaynak: `components/Hero.tsx`  
Not: Bu iddialar teknik rapor veya saha olcum dosyasi ile desteklenmelidir.

