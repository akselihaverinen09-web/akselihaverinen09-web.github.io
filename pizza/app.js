// EmailJS Configuration
// Hanki ilmaiset tunnukset: https://www.emailjs.com/
const EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',    // Korvaa EmailJS-palvelun ID:llä
  templateId: 'YOUR_TEMPLATE_ID',  // Korvaa EmailJS-templaten ID:llä
  publicKey: 'YOUR_PUBLIC_KEY'     // Korvaa EmailJS public key:llä
};

// Alusta EmailJS
if (typeof emailjs !== 'undefined') {
  emailjs.init(EMAILJS_CONFIG.publicKey);
}

const REAL_PHOTO_POOL = [
  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1576458088443-04a19c4a1540?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800&h=600&fit=crop"
];

const DEFAULT_MENU = [
  {
    id: "margherita",
    name: "Margherita Classica",
    description: "Tomaattikastike, mozzarella, basilika",
    toppings: ["mozzarella", "basilika", "tomaattikastike"],
    price: 11.5,
    image: REAL_PHOTO_POOL[0]
  },
  {
    id: "pepperoni",
    name: "Pepperoni Heat",
    description: "Pepperoni, mozzarella, oregano",
    toppings: ["pepperoni", "mozzarella", "oregano"],
    price: 13.0,
    image: "assets/pizzas/pepperoni.jpg"
  },
  {
    id: "bbq-chicken",
    name: "BBQ Chicken",
    description: "Kana, BBQ-kastike, paprika, punasipuli",
    toppings: ["kana", "BBQ-kastike", "paprika", "punasipuli"],
    price: 14.5,
    image: REAL_PHOTO_POOL[2]
  },
  {
    id: "veggie",
    name: "Garden Veggie",
    description: "Paprika, herkkusieni, oliivi, rucola",
    toppings: ["paprika", "herkkusieni", "oliivi", "rucola"],
    price: 12.5,
    image: REAL_PHOTO_POOL[3]
  },
  {
    id: "diavola",
    name: "Diavola Fire",
    description: "Tulinen salami, jalapeno, chili",
    toppings: ["tulinen salami", "jalapeno", "chili"],
    price: 14.0,
    image: REAL_PHOTO_POOL[4]
  },
  {
    id: "quattro-formaggi",
    name: "Quattro Formaggi",
    description: "Mozzarella, gorgonzola, parmesan, ricotta",
    toppings: ["mozzarella", "gorgonzola", "parmesan", "ricotta"],
    price: 15.0,
    image: REAL_PHOTO_POOL[5]
  },
  {
    id: "tropical",
    name: "Tropical Twist",
    description: "Kinkku, ananas, mozzarella",
    toppings: ["kinkku", "ananas", "mozzarella"],
    price: 13.5,
    image: REAL_PHOTO_POOL[6]
  },
  {
    id: "truffle",
    name: "Truffle Bianco",
    description: "Tryffelioljya, herkkusieni, burrata",
    toppings: ["tryffelioljy", "herkkusieni", "burrata"],
    price: 16.5,
    image: REAL_PHOTO_POOL[7]
  }
];

const MENU_KEY = "pizza.menu";
const CART_KEY = "pizza.cart";
const ORDERS_KEY = "pizza.orders";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function parseToppings(input) {
  if (Array.isArray(input)) {
    return input.map((part) => String(part).trim()).filter(Boolean);
  }
  if (typeof input !== "string") {
    return [];
  }
  return input
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function normalizeMenuItem(item, index) {
  const source = item || {};
  const safeName = String(source.name || `Pizza ${index + 1}`).trim();
  const fallbackImage = REAL_PHOTO_POOL[index % REAL_PHOTO_POOL.length];
  const toppings = parseToppings(source.toppings || source.description || "");

  return {
    id: String(source.id || safeName.toLowerCase().replace(/[^a-z0-9]+/g, "-")).trim(),
    name: safeName,
    description: String(source.description || "").trim(),
    toppings,
    price: Number(source.price) > 0 ? Number(source.price) : 10,
    image: String(source.image || fallbackImage).trim() || fallbackImage
  };
}

function ensureMenu() {
  const existing = readJSON(MENU_KEY, null);
  if (!Array.isArray(existing) || existing.length === 0) {
    saveJSON(MENU_KEY, DEFAULT_MENU);
    return DEFAULT_MENU;
  }
  const normalized = existing.map(normalizeMenuItem);
  saveJSON(MENU_KEY, normalized);
  return normalized;
}

let menu = ensureMenu();
let cart = readJSON(CART_KEY, []);

const menuGrid = document.getElementById("menuGrid");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutForm = document.getElementById("checkoutForm");
const orderMessage = document.getElementById("orderMessage");
const orderType = document.getElementById("orderType");
const addressRow = document.getElementById("addressRow");
const customerAddress = document.getElementById("customerAddress");

function formatPrice(value) {
  return `${value.toFixed(2)} EUR`;
}

function renderMenu() {
  menu = readJSON(MENU_KEY, DEFAULT_MENU).map(normalizeMenuItem);
  saveJSON(MENU_KEY, menu);
  menuGrid.innerHTML = "";

  for (const item of menu) {
    const card = document.createElement("article");
    card.className = "pizza-item";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" loading="lazy" data-pizza-id="${item.id}" />
      <div class="pizza-body">
        <div class="pizza-head">
          <div class="pizza-name">${item.name}</div>
          <div class="pizza-price">${formatPrice(item.price)}</div>
        </div>
        <p class="pizza-desc">${item.description}</p>
        <div class="toppings-list">${item.toppings
          .map((topping) => `<span class="topping-chip">${topping}</span>`)
          .join("")}</div>
        <button class="primary-btn" data-add-id="${item.id}">Lisaa ostoskoriin</button>
      </div>
    `;
    menuGrid.appendChild(card);
  }
}

function persistCart() {
  saveJSON(CART_KEY, cart);
}

function addToCart(id) {
  const found = cart.find((entry) => entry.id === id);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  persistCart();
  renderCart();
}

function updateQty(id, delta) {
  const found = cart.find((entry) => entry.id === id);
  if (!found) {
    return;
  }
  found.qty += delta;
  if (found.qty <= 0) {
    cart = cart.filter((entry) => entry.id !== id);
  }
  persistCart();
  renderCart();
}

function getCartLines() {
  return cart
    .map((entry) => {
      const product = menu.find((item) => item.id === entry.id);
      if (!product) {
        return null;
      }
      return {
        ...product,
        qty: entry.qty,
        lineTotal: product.price * entry.qty
      };
    })
    .filter(Boolean);
}

function renderCart() {
  const lines = getCartLines();
  cartItems.innerHTML = "";

  if (lines.length === 0) {
    cartItems.innerHTML = "<p class=\"muted\">Ostoskori on tyhja.</p>";
    cartTotal.textContent = formatPrice(0);
    return;
  }

  let total = 0;

  for (const line of lines) {
    total += line.lineTotal;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <div class="cart-item-name">${line.name}</div>
        <small class="muted">${formatPrice(line.lineTotal)}</small>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" data-qty-id="${line.id}" data-delta="-1">-</button>
        <span>${line.qty}</span>
        <button class="qty-btn" data-qty-id="${line.id}" data-delta="1">+</button>
      </div>
      <button class="ghost-btn" data-remove-id="${line.id}">Poista</button>
    `;
    cartItems.appendChild(row);
  }

  cartTotal.textContent = formatPrice(total);
}

function toggleAddress() {
  const delivery = orderType.value === "Kotiinkuljetus";
  addressRow.style.display = delivery ? "flex" : "none";
  customerAddress.required = delivery;
}

function maskCardNumber(value) {
  const digits = value.replace(/\s+/g, "");
  if (digits.length < 4) {
    return "****";
  }
  return `**** **** **** ${digits.slice(-4)}`;
}

async function sendEmailConfirmation(email, name, orderId, items, total, deliveryType, address) {
  const itemsList = items.map(item => `${item.qty}x ${item.name} (${formatPrice(item.price)})`).join("\n");
  
  // Tarkista että EmailJS on määritetty
  if (EMAILJS_CONFIG.serviceId === 'YOUR_SERVICE_ID') {
    console.log("⚠️ EmailJS ei ole vielä määritetty!");
    console.log("═══════════════════════════════════");
    console.log("📧 SIMULOITU SÄHKÖPOSTI");
    console.log("═══════════════════════════════════");
    console.log(`Vastaanottaja: ${email}`);
    console.log(`Asiakas: ${name}`);
    console.log(`Tilausnumero: ${orderId}`);
    console.log(`\nPizzat:\n${itemsList}`);
    console.log(`\nYhteensä: ${formatPrice(total)}`);
    console.log(`Toimitustapa: ${deliveryType}`);
    if (deliveryType === "Kotiinkuljetus") {
      console.log(`Osoite: ${address}`);
    }
    console.log("═══════════════════════════════════");
    console.log("💡 Määritä EmailJS tunnukset app.js tiedostossa");
    
    return { success: false, error: 'EmailJS ei määritetty' };
  }

  try {
    console.log("📧 Lähetetään sähköposti...");
    
    const templateParams = {
      to_email: email,
      to_name: name,
      order_id: orderId,
      order_items: itemsList,
      order_total: formatPrice(total),
      delivery_type: deliveryType,
      delivery_address: deliveryType === "Kotiinkuljetus" ? address : "Nouto: Pizzakatu 7, Helsinki",
      estimated_time: "30-45 min"
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams
    );

    console.log("✅ Sähköposti lähetetty onnistuneesti!", response);
    return { success: true };
    
  } catch (error) {
    console.error("❌ Sähköpostin lähetys epäonnistui:", error);
    return { success: false, error: error.text || error.message };
  }
}

menuGrid.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  
  // Avataan modal kun pizzan kuvaa klikataan
  const pizzaId = target.getAttribute("data-pizza-id");
  if (pizzaId) {
    openPizzaModal(pizzaId);
    return;
  }
  
  const id = target.getAttribute("data-add-id");
  if (id) {
    addToCart(id);
  }
});

cartItems.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const removeId = target.getAttribute("data-remove-id");
  if (removeId) {
    cart = cart.filter((entry) => entry.id !== removeId);
    persistCart();
    renderCart();
    return;
  }

  const qtyId = target.getAttribute("data-qty-id");
  if (qtyId) {
    const delta = Number(target.getAttribute("data-delta"));
    if (!Number.isNaN(delta)) {
      updateQty(qtyId, delta);
    }
  }
});

orderType.addEventListener("change", toggleAddress);

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  orderMessage.textContent = "";
  orderMessage.className = "order-message";

  if (cart.length === 0) {
    orderMessage.textContent = "Lisaa ensin pizza ostoskoriin.";
    orderMessage.classList.add("error");
    return;
  }

  const lines = getCartLines();
  const total = lines.reduce((sum, line) => sum + line.lineTotal, 0);

  const formData = new FormData(checkoutForm);
  const name = String(formData.get("customerName") || "").trim();
  const email = String(formData.get("customerEmail") || "").trim();
  const phone = String(formData.get("customerPhone") || "").trim();
  const type = String(formData.get("orderType") || "Kotiinkuljetus");
  const address = String(formData.get("customerAddress") || "").trim();
  const notes = String(formData.get("orderNotes") || "").trim();
  const cardNumber = String(formData.get("cardNumber") || "").trim();

  if (!name || !email || !phone) {
    orderMessage.textContent = "Tayta nimi, sahkoposti ja puhelin.";
    orderMessage.classList.add("error");
    return;
  }

  if (type === "Kotiinkuljetus" && !address) {
    orderMessage.textContent = "Kotiinkuljetus tarvitsee osoitteen.";
    orderMessage.classList.add("error");
    return;
  }

  const orderId = `ORD-${Date.now()}`;
  const orders = readJSON(ORDERS_KEY, []);
  orders.push({
    id: orderId,
    createdAt: new Date().toISOString(),
    customer: { name, email, phone, type, address, notes },
    payment: { method: "Korttimaksu", card: maskCardNumber(cardNumber) },
    items: lines.map((line) => ({
      id: line.id,
      name: line.name,
      qty: line.qty,
      price: line.price,
      toppings: Array.isArray(line.toppings) ? line.toppings : []
    })),
    total
  });

  saveJSON(ORDERS_KEY, orders);

  // Näytä lataustila
  orderMessage.textContent = "Lahetetaan tilausta...";
  orderMessage.classList.add("info");

  // Lähetä vahvistussähköposti
  const emailResult = await sendEmailConfirmation(email, name, orderId, lines, total, type, address);

  cart = [];
  persistCart();
  renderCart();

  checkoutForm.reset();
  toggleAddress();

  // Näytä tulos
  if (emailResult.success) {
    orderMessage.textContent = `Tilaus vastaanotettu! Vahvistus lahetetty osoitteeseen ${email}`;
  } else {
    orderMessage.textContent = `Tilaus vastaanotettu! Tilausnumero: ${orderId} (Sahkopostin lahetys epaonnistui)`;
  }
  orderMessage.classList.remove("info");
  orderMessage.classList.add("success");
});

// Modal toiminnallisuus
const pizzaModal = document.getElementById("pizzaModal");
const closeModalBtn = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalDescription = document.getElementById("modalDescription");
const modalToppings = document.getElementById("modalToppings");
const modalPrice = document.getElementById("modalPrice");

function openPizzaModal(pizzaId) {
  const pizza = menu.find(item => item.id === pizzaId);
  if (!pizza) return;
  
  modalImage.src = pizza.image;
  modalImage.alt = pizza.name;
  modalName.textContent = pizza.name;
  modalDescription.textContent = pizza.description;
  modalToppings.innerHTML = pizza.toppings
    .map((topping) => `<span class="topping-chip">${topping}</span>`)
    .join("");
  modalPrice.textContent = formatPrice(pizza.price);
  
  pizzaModal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closePizzaModal() {
  pizzaModal.classList.remove("show");
  document.body.style.overflow = "";
}

closeModalBtn.addEventListener("click", closePizzaModal);

pizzaModal.addEventListener("click", (event) => {
  if (event.target === pizzaModal) {
    closePizzaModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && pizzaModal.classList.contains("show")) {
    closePizzaModal();
  }
});

renderMenu();
renderCart();
toggleAddress();
