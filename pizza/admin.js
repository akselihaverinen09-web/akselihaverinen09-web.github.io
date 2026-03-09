const MENU_KEY = "pizza.menu";
const ORDERS_KEY = "pizza.orders";

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
    image: REAL_PHOTO_POOL[1]
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

const FALLBACK_IMAGES = REAL_PHOTO_POOL;

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
  const fallbackImage = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
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
  const menu = readJSON(MENU_KEY, null);
  if (!Array.isArray(menu) || menu.length === 0) {
    saveJSON(MENU_KEY, DEFAULT_MENU);
    return;
  }
  saveJSON(MENU_KEY, menu.map(normalizeMenuItem));
}

const addPizzaForm = document.getElementById("addPizzaForm");
const menuTableBody = document.getElementById("menuTableBody");
const ordersList = document.getElementById("ordersList");
const refreshOrders = document.getElementById("refreshOrders");
const clearOrders = document.getElementById("clearOrders");

function getMenu() {
  return readJSON(MENU_KEY, []).map(normalizeMenuItem);
}

function setMenu(menu) {
  saveJSON(MENU_KEY, menu);
}

function renderMenuTable() {
  const menu = getMenu();
  menuTableBody.innerHTML = "";

  if (menu.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="5">Menu on tyhja.</td>';
    menuTableBody.appendChild(tr);
    return;
  }

  for (const item of menu) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.description}</td>
      <td>${item.toppings.join(", ")}</td>
      <td>${item.price.toFixed(2)} EUR</td>
      <td>
        <button class="ghost-btn" data-edit-id="${item.id}" type="button">Muokkaa</button>
        <button class="danger-btn" data-delete-id="${item.id}" type="button">Poista</button>
      </td>
    `;
    menuTableBody.appendChild(tr);
  }
}

function renderOrders() {
  const orders = readJSON(ORDERS_KEY, []).slice().reverse();
  ordersList.innerHTML = "";

  if (orders.length === 0) {
    ordersList.innerHTML = "<p class=\"muted\">Tilauksia ei ole viela.</p>";
    return;
  }

  for (const order of orders) {
    const card = document.createElement("article");
    card.className = "order-card";
    const addressText = order.customer.address ? order.customer.address : "-";
    const notesText = order.customer.notes ? order.customer.notes : "-";

    card.innerHTML = `
      <h3>${order.id}</h3>
      <div class="order-meta">
        <span>${new Date(order.createdAt).toLocaleString("fi-FI")}</span>
        <span>${order.customer.name}</span>
        <span>${order.customer.phone}</span>
        <span>${order.customer.type}</span>
        <span>Yhteensa ${order.total.toFixed(2)} EUR</span>
      </div>
      <p><strong>Osoite:</strong> ${addressText}</p>
      <p><strong>Lisatiedot:</strong> ${notesText}</p>
      <p><strong>Maksu:</strong> ${order.payment.method} (${order.payment.card})</p>
      <ul class="order-items">
        ${order.items
          .map((line) => {
            const toppings = Array.isArray(line.toppings) && line.toppings.length > 0
              ? ` - taytteet: ${line.toppings.join(", ")}`
              : "";
            return `<li>${line.name} x ${line.qty} (${line.price.toFixed(2)} EUR)${toppings}</li>`;
          })
          .join("")}
      </ul>
    `;

    ordersList.appendChild(card);
  }
}

addPizzaForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(addPizzaForm);
  const name = String(formData.get("pizzaName") || "").trim();
  const description = String(formData.get("pizzaDescription") || "").trim();
  const toppingsRaw = String(formData.get("pizzaToppings") || "").trim();
  const pizzaImage = String(formData.get("pizzaImage") || "").trim();
  const price = Number(formData.get("pizzaPrice"));
  const toppings = parseToppings(toppingsRaw);

  if (!name || !description || toppings.length === 0 || !Number.isFinite(price) || price <= 0) {
    return;
  }

  const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;
  const randomImage = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
  const image = pizzaImage || randomImage;

  const menu = getMenu();
  menu.push({ id, name, description, toppings, price, image });
  setMenu(menu);

  addPizzaForm.reset();
  renderMenuTable();
});

menuTableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const menu = getMenu();

  const deleteId = target.getAttribute("data-delete-id");
  if (deleteId) {
    setMenu(menu.filter((item) => item.id !== deleteId));
    renderMenuTable();
    return;
  }

  const editId = target.getAttribute("data-edit-id");
  if (editId) {
    const current = menu.find((item) => item.id === editId);
    if (!current) {
      return;
    }

    const name = prompt("Uusi nimi", current.name);
    if (!name) {
      return;
    }
    const description = prompt("Uusi kuvaus", current.description);
    if (!description) {
      return;
    }
    const toppingsRaw = prompt("Uudet taytteet (pilkulla)", current.toppings.join(", "));
    if (!toppingsRaw) {
      return;
    }
    const toppings = parseToppings(toppingsRaw);
    if (toppings.length === 0) {
      return;
    }
    const priceRaw = prompt("Uusi hinta", String(current.price));
    const price = Number(priceRaw);
    if (!Number.isFinite(price) || price <= 0) {
      return;
    }
    const image = prompt("Uusi kuva-URL", current.image);
    if (!image) {
      return;
    }

    const updated = menu.map((item) =>
      item.id === editId
        ? { ...item, name: name.trim(), description: description.trim(), toppings, price, image: image.trim() }
        : item
    );

    setMenu(updated);
    renderMenuTable();
  }
});

refreshOrders.addEventListener("click", renderOrders);

clearOrders.addEventListener("click", () => {
  const confirmed = confirm("Poistetaanko kaikki tilaukset?");
  if (!confirmed) {
    return;
  }
  saveJSON(ORDERS_KEY, []);
  renderOrders();
});

ensureMenu();
renderMenuTable();
renderOrders();
