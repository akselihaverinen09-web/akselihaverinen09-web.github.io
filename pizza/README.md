# Napoli Now - Pizza Ordering with SMS Notifications

## 🍕 Ominaisuudet

- Pizza-menu hallinta
- Ostoskori
- Verkkomaksu
- **SMS-vahvistukset Twilion kautta**
- Tilausten hallinta (admin-näkymä)

## 📋 Asennus

### 1. Asenna riippuvuudet

```bash
npm install
```

### 2. Twilio-tilin luonti

1. Luo ilmainen tili osoitteessa [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Vahvista puhelinnumerosi (trial-tilillä voit lähettää vain vahvistettuihin numeroihin)
3. Hae [Twilio Console](https://console.twilio.com) sivulta:
   - **Account SID**
   - **Auth Token**
   - **Twilio Phone Number** (saat ilmaiseksi trial-version)

### 3. Konfiguroi ympäristömuuttujat

Kopioi `.env.example` tiedostoksi `.env`:

```bash
cp .env.example .env
```

Muokkaa `.env` tiedostoa ja lisää Twilio-tunnuksesi:

```env
TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcdef
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
PORT=3000
```

**HUOM:** Trial-tilillä voit lähettää SMS:iä vain vahvistettuihin numeroihin. Lisää testiumerot Twilion konsolissa: **Phone Numbers > Manage > Verified Caller IDs**

### 4. Päivitä frontend API URL

Avaa `app.js` ja varmista että `API_URL` osoittaa serveriin:

```javascript
const API_URL = 'http://localhost:3000';
```

## 🚀 Käynnistä palvelin

### Kehitystila (automaattinen uudelleenkäynnistys):

```bash
npm run dev
```

### Tuotantotila:

```bash
npm start
```

Palvelin käynnistyy osoitteeseen `http://localhost:3000`

## 📱 SMS-toiminnon testaus

1. Käynnistä backend-palvelin (`npm start`)
2. Avaa `pizza.html` selaimessa
3. Lisää pizzoja ostoskoriin
4. Täytä tilauslomake
   - **Tärkeää:** Käytä Twiliossa vahvistettua puhelinnumeroa (trial-tilillä)
   - Numero muodossa: `+358401234567` (Suomi) tai `+1234567890` (USA)
5. Lähetä tilaus
6. Saat SMS:n käyttämääsi numeroon!

## 🔧 Troubleshooting

### "Unverified number" error

**Syy:** Trial-tilillä voit lähettää vain vahvistettuihin numeroihin.

**Ratkaisu:** 
- Lisää numerosi Twilion konsolissa: **Phone Numbers > Manage > Verified Caller IDs**
- TAI päivitä Twilio-tilisi maksulliseksi (USD $20/kk)

### CORS-virhe selaimessa

**Syy:** Frontend ja backend eri osoitteissa.

**Ratkaisu:** CORS on jo käytössä `server.js`:ssä. Varmista että palvelin on käynnissä.

### "Invalid phone number" error

**Syy:** Numero väärässä muodossa.

**Ratkaisu:** Käytä kansainvälistä formaattia: `+[maa][numero]` (esim. `+358401234567`)

## 📦 Deployment

### Heroku (ilmainen)

```bash
# Asenna Heroku CLI
heroku login
heroku create napoli-now-pizza
git push heroku main

# Aseta ympäristömuuttujat
heroku config:set TWILIO_ACCOUNT_SID=your_sid
heroku config:set TWILIO_AUTH_TOKEN=your_token
heroku config:set TWILIO_PHONE_NUMBER=your_number
```

### Render.com (ilmainen)

1. Luo uusi Web Service
2. Yhdistä GitHub repo
3. Build command: `npm install`
4. Start command: `npm start`
5. Lisää Environment Variables (.env sisältö)

## 💡 Tips

- **Trial-rajoitukset:** Twilio trial lähettää "Sent from your Twilio trial account" viestin alkuun
- **Suomen numerot:** Muista `+358` etuliite (esim. `+358401234567`)
- **Maksullinen tili:** ~USD $20/kk, SMS ~$0.0075/kpl (Suomi)

## 🛠 Teknologiat

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Backend:** Node.js + Express
- **SMS:** Twilio API
- **Storage:** LocalStorage (frontend), voisi lisätä MongoDB/PostgreSQL

## 📄 Lisenssi

MIT
