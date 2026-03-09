# 📧 Sähköposti-ilmoitusten käyttöönotto

## EmailJS - Ilmainen sähköpostipalvelu

EmailJS mahdollistaa sähköpostien lähettämisen suoraan JavaScript-koodista ilman omaa palvelinta.

### 1️⃣ Luo EmailJS-tili (ILMAINEN)

1. Mene osoitteeseen: **https://www.emailjs.com/**
2. Klikkaa **"Sign Up Free"**
3. Rekisteröidy (Google/GitHub/sähköposti)
4. Vahvista sähköpostisi

**Ilmainen tili antaa:**
- ✅ 200 sähköpostia/kuukausi
- ✅ 2 sähköpostitiliä
- ✅ Kaikki perustoiminnot

---

### 2️⃣ Konfiguroi sähköpostipalvelu

#### A) Lisää Gmail-tili

1. Kirjaudu EmailJS-konsolliin: https://dashboard.emailjs.com/
2. Valitse **"Email Services"**
3. Klikkaa **"Add New Service"**
4. Valitse **"Gmail"**
5. Klikkaa **"Connect Account"** → kirjaudu Gmail-tilillesi
6. Kopioi **Service ID** (esim. `service_abc1234`)

**Vaihtoehto:** Voit käyttää myös Outlook, Yahoo, tai SMTP-palvelua.

---

### 3️⃣ Luo sähköpostitemplate

1. Valitse **"Email Templates"**
2. Klikkaa **"Create New Template"**
3. Anna nimeksi: **"Pizza Order Confirmation"**
4. Muokkaa template seuraavasti:

#### Template asetukset:

**Subject (Aihe):**
```
Tilausvahvistus - Napoli Now Pizza 🍕
```

**Content (Sisältö):**
```html
Hei {{to_name}}!

Kiitos tilauksestasi Napoli Now pizzeriasta! 🍕

═══════════════════════════════════
TILAUSNUMERO: {{order_id}}
═══════════════════════════════════

PIZZAT:
{{order_items}}

YHTEENSÄ: {{order_total}}

TOIMITUSTAPA: {{delivery_type}}
OSOITE: {{delivery_address}}

ARVIOITU TOIMITUSAIKA: {{estimated_time}}

═══════════════════════════════════

Kiitos tilauksestasi! 
Jos sinulla on kysyttävää, vastaa tähän viestiin.

Tervetuloa uudelleen!
- Napoli Now Team

Pizzakatu 7, Helsinki
puh. 040 123 4567
```

5. Klikkaa **"Save"**
6. Kopioi **Template ID** (esim. `template_xyz9876`)

---

### 4️⃣ Hae Public Key

1. Valitse **"Account"** → **"General"**
2. Etsi **"Public Key"**
3. Kopioi avain (esim. `AbCdEfGhIjKlMnOp`)

---

### 5️⃣ Päivitä app.js

Avaa `pizza/app.js` ja etsi tämä osio (rivit ~1-8):

```javascript
const EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',    // ← Korvaa tähän Service ID
  templateId: 'YOUR_TEMPLATE_ID',  // ← Korvaa tähän Template ID
  publicKey: 'YOUR_PUBLIC_KEY'     // ← Korvaa tähän Public Key
};
```

**Esimerkki:**
```javascript
const EMAILJS_CONFIG = {
  serviceId: 'service_abc1234',
  templateId: 'template_xyz9876',
  publicKey: 'AbCdEfGhIjKlMnOp'
};
```

---

### 6️⃣ Testaa!

1. Avaa `pizza.html` selaimessa
2. Lisää pizzoja ostoskoriin
3. Täytä tilauslomake (KÄYTÄ OIKEAA SÄHKÖPOSTIOSOITETTASI)
4. Lähetä tilaus
5. **Tarkista sähköpostisi!** 📧

---

## ⚠️ Yleisiä ongelmia

### "EmailJS ei ole vielä määritetty"

**Ratkaisu:** 
- Varmista että olet korvannut `YOUR_SERVICE_ID`, `YOUR_TEMPLATE_ID` ja `YOUR_PUBLIC_KEY` oikeilla arvoilla
- Käynnistä sivu uudelleen (Ctrl+Shift+R)

### Sähköposti ei saavu

**Tarkista:**
1. ✅ Kaikki kolme ID:tä on oikein `app.js`:ssä
2. ✅ Template on tallennettu ja julkaistu
3. ✅ Gmail-yhteys on aktiivinen (Email Services)
4. ✅ Roskapostikansio
5. ✅ Selaimen konsoli (F12) - näkyykö virheitä?

### "Payment required" virhe

**Syy:** Ylitit 200 sähköpostin/kk rajan.

**Ratkaisu:**
- Päivitä maksulliseen (alkaen $9/kk = 1000 sähköpostia)
- TAI odota seuraavaan kuukauteen

### CORS-virhe

**Ratkaisu:** EmailJS toimii suoraan selaimesta, ei tarvitse palvelinta. Varmista että:
- EmailJS-kirjasto ladataan (`pizza.html` head-osiossa)
- Public Key on oikein

---

## 📊 EmailJS rajoitukset

| Taso | Hinta | Viestit/kk | Email-tilit |
|------|-------|------------|-------------|
| **Free** | 0€ | 200 | 2 |
| **Personal** | $9/kk | 1,000 | 5 |
| **Business** | $35/kk | 10,000 | 15 |

---

## 🔒 Turvallisuus

**HUOM:** Public Key voi olla julkinen - se ei ole salainen!
- ✅ Public Key = OK jakaa
- ❌ Private Key = ÄLÄ jaa mihinkään

EmailJS suojaa väärinkäytöltä:
- Rate limiting
- Domain whitelisting
- Captcha-tuki

---

## 💡 Lisäominaisuudet

### Lisää liitetiedostoja

Template-editorissa voit lisätä:
- Logo (kuva URL)
- PDF-tilausvahvistus
- Tracking-linkit

### Webhook-notifikaatiot

Saat ilmoituksen kun:
- Sähköposti lähetetty
- Sähköposti bounced
- Vastaanottaja avasi viestin

### A/B testing

Testaa eri template-versioita!

---

## 🆘 Tuki

- EmailJS dokumentaatio: https://www.emailjs.com/docs/
- Tuki: support@emailjs.com
- Videoguide: https://www.youtube.com/watch?v=x7Ewtay0Q78

---

**Valmista! Pizza-tilaukset lähettävät nyt automaattiset vahvistussähköpostit! 🍕📧**
