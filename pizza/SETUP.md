# 🍕 Napoli Now - SMS-toiminnon käyttöönotto

## Pika-asennusohje

### 1️⃣ Asenna Node.js riippuvuudet

Avaa PowerShell pizza-kansiossa ja aja:

```powershell
npm install
```

### 2️⃣ Luo Twilio-tili (ILMAINEN)

1. Mene osoitteeseen: https://www.twilio.com/try-twilio
2. Rekisteröidy ilmaiseksi (saat $15 krediittiä)
3. Vahvista puhelinnumerosi
4. Hae Console-sivulta (https://console.twilio.com):
   - **Account SID** (esim. AC1234567890...)
   - **Auth Token** (klikkaa "show" nähdäksesi sen)
5. Hanki ilmainen puhelinnumero:
   - Klikkaa "Get a Trial Number"
   - Valitse numero (esim. +1234567890)

### 3️⃣ Konfiguroi .env tiedosto

1. Kopioi `.env.example` nimellä `.env`:

```powershell
Copy-Item .env.example .env
```

2. Avaa `.env` muistiolla tai VS Codella

3. Korvaa arvot Twiliosta haetuilla:

```env
TWILIO_ACCOUNT_SID=AC123your456real789values0here
TWILIO_AUTH_TOKEN=your_real_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
PORT=3000
```

### 4️⃣ Käynnistä backend-palvelin

```powershell
npm start
```

Näet viestin:
```
🚀 Pizza SMS Server käynnissä portissa 3000
📱 Twilio-yhteys valmis
```

### 5️⃣ Testaa SMS-toiminto!

1. Avaa `pizza.html` selaimessa
2. Lisää pizzoja ostoskoriin
3. Täytä tilauslomake:
   - **TÄRKEÄÄ:** Käytä samaa numeroa jonka vahvistit Twiliossa!
   - Formaatti: `+358401234567` (Suomi) tai `+1234567890` (USA)
4. Lähetä tilaus
5. 🎉 **Saat SMS:n puhelimeesi!**

---

## ⚠️ Yleisiä ongelmia

### "Unverified number" virhe

**Ongelma:** Trial-tilillä voit lähettää VAIN vahvistettuihin numeroihin.

**Ratkaisu:** 
- Lisää testinumerot Twilion konsolissa: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
- Klikkaa "Add Verified Number"
- Syötä numero (esim. +358401234567)
- Vahvista koodi

### Backend ei vastaa

**Tarkista:**
1. Onko `npm start` käynnissä?
2. Näkyykö "🚀 Pizza SMS Server käynnissä"?
3. Onko `.env` tiedosto oikein täytetty?

### "Invalid credentials" virhe

**Tarkista:**
- Account SID alkaa `AC`-tunnuksella
- Auth Token on kopioitu oikein (ei välilyöntejä)
- Puhelinnumero on muodossa `+1234567890`

---

## 💰 Hinnat (Trial vs Maksullinen)

### Trial (ILMAINEN)
- ✅ $15 krediittiä
- ✅ ~2000 SMS:ää
- ⚠️ Vain vahvistettuihin numeroihin
- ⚠️ "Sent from Twilio trial" -teksti

### Maksullinen ($20/kk)
- ✅ Lähetä mihin tahansa numeroon
- ✅ Ei Twilio-brändäystä
- ✅ Suomen SMS: ~$0.007/kpl (7 senttiä/10 SMS:ää)

---

## 🚀 Tuotantoon vienti

Ks. README.md tiedosto Heroku/Render ohjeista.

---

## 🆘 Apua?

1. Katso backend-lokit konsolista
2. Avaa selaimen konsoli (F12)
3. Tarkista Twilio-lokit: https://console.twilio.com/us1/monitor/logs/sms

Valmista! 🍕📱
