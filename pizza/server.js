const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// SMS sending endpoint
app.post('/api/send-sms', async (req, res) => {
  try {
    const { phone, name, orderId, items, total, deliveryType, address } = req.body;

    // Validate required fields
    if (!phone || !name || !orderId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Puuttuvia tietoja: puhelin, nimi tai tilausnumero' 
      });
    }

    // Format items list for SMS
    const itemsList = items.map(item => `${item.qty}x ${item.name}`).join(", ");

    // Build SMS message
    const message = `Hei ${name}!

Kiitos tilauksestasi Napoli Now pizzeriasta! 🍕

Tilausnumero: ${orderId}
Pizzat: ${itemsList}
Yhteensä: ${total}

Toimitustapa: ${deliveryType}
${deliveryType === "Kotiinkuljetus" ? `Toimitusosoite: ${address}` : "Nouto: Pizzakatu 7, Helsinki"}

Arvioitu toimitusaika: 30-45 min

Tervetuloa uudelleen!
- Napoli Now`;

    // Send SMS via Twilio
    const twilioResponse = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: phone
    });

    console.log('✅ SMS lähetetty:', twilioResponse.sid);
    
    res.json({ 
      success: true, 
      messageSid: twilioResponse.sid,
      message: 'SMS lähetetty onnistuneesti'
    });

  } catch (error) {
    console.error('❌ SMS-lähetysvirhe:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'SMS-lähetys epäonnistui'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Pizza SMS Server käynnissä portissa ${PORT}`);
  console.log(`📱 Twilio-yhteys valmis`);
});
