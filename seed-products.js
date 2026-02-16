const admin = require('firebase-admin');

// 🔥 REEMPLAZA con la ruta de tu serviceAccountKey.json
const serviceAccount = require('./rikaso-firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const products = [

  // ==========================
  // 🥪 CLÁSICOS
  // ==========================
  {
    name: "Lomito",
    categoryId: "clasicos",
    price: 8500,
    stock: 20,
    minStockAlert: 5,
    active: true,
    imageUrl: "https://example.com/lomito.jpg"
  },
  {
    name: "Milanesa",
    categoryId: "clasicos",
    price: 7500,
    stock: 20,
    minStockAlert: 5,
    active: true,
    imageUrl: "https://example.com/milanesa.jpg"
  },
  {
    name: "Jamón y Queso",
    categoryId: "clasicos",
    price: 5000,
    stock: 25,
    minStockAlert: 5,
    active: true,
    imageUrl: "https://example.com/jamonqueso.jpg"
  },
  {
    name: "Pollo",
    categoryId: "clasicos",
    price: 7200,
    stock: 18,
    minStockAlert: 5,
    active: true,
    imageUrl: "https://example.com/pollo.jpg"
  },
  {
    name: "Vegetariano",
    categoryId: "clasicos",
    price: 6800,
    stock: 15,
    minStockAlert: 5,
    active: true,
    imageUrl: "https://example.com/vegetariano.jpg"
  },

  // ==========================
  // 🌯 ESPECIALES
  // ==========================
  {
    name: "Especial Casa",
    categoryId: "especiales",
    price: 9900,
    stock: 15,
    minStockAlert: 4,
    active: true,
    imageUrl: "https://example.com/especial.jpg"
  },
  {
    name: "Lomito Doble",
    categoryId: "especiales",
    price: 11500,
    stock: 12,
    minStockAlert: 3,
    active: true,
    imageUrl: "https://example.com/lomito-doble.jpg"
  },
  {
    name: "Milanesa Napolitana",
    categoryId: "especiales",
    price: 10200,
    stock: 10,
    minStockAlert: 3,
    active: true,
    imageUrl: "https://example.com/milanesa-napo.jpg"
  },
  {
    name: "Pollo BBQ",
    categoryId: "especiales",
    price: 9500,
    stock: 14,
    minStockAlert: 3,
    active: true,
    imageUrl: "https://example.com/pollo-bbq.jpg"
  },
  {
    name: "Veggie Premium",
    categoryId: "especiales",
    price: 9200,
    stock: 10,
    minStockAlert: 3,
    active: true,
    imageUrl: "https://example.com/veggie-premium.jpg"
  },

  // ==========================
  // 🍟 COMBOS
  // ==========================
  {
    name: "Combo Lomito",
    categoryId: "combos",
    price: 12500,
    stock: 20,
    minStockAlert: 5,
    active: true,
    imageUrl: "https://example.com/combo-lomito.jpg"
  },
  {
    name: "Combo Milanesa",
    categoryId: "combos",
    price: 11500,
    stock: 20,
    minStockAlert: 5,
    active: true,
    imageUrl: "https://example.com/combo-milanesa.jpg"
  },
  {
    name: "Combo Pollo",
    categoryId: "combos",
    price: 11800,
    stock: 18,
    minStockAlert: 5,
    active: true,
    imageUrl: "https://example.com/combo-pollo.jpg"
  },
  {
    name: "Combo Veggie",
    categoryId: "combos",
    price: 11000,
    stock: 15,
    minStockAlert: 5,
    active: true,
    imageUrl: "https://example.com/combo-veggie.jpg"
  },
  {
    name: "Combo Especial",
    categoryId: "combos",
    price: 14500,
    stock: 12,
    minStockAlert: 4,
    active: true,
    imageUrl: "https://example.com/combo-especial.jpg"
  },

  // ==========================
  // 🥤 BEBIDAS
  // ==========================
  { name: "Coca 500ml", categoryId: "bebidas", price: 2500, stock: 50, minStockAlert: 10, active: true, imageUrl: "https://example.com/coca.jpg" },
  { name: "Sprite 500ml", categoryId: "bebidas", price: 2500, stock: 50, minStockAlert: 10, active: true, imageUrl: "https://example.com/sprite.jpg" },
  { name: "Fanta 500ml", categoryId: "bebidas", price: 2500, stock: 50, minStockAlert: 10, active: true, imageUrl: "https://example.com/fanta.jpg" },
  { name: "Agua", categoryId: "bebidas", price: 1800, stock: 40, minStockAlert: 10, active: true, imageUrl: "https://example.com/agua.jpg" },
  { name: "Jugo Natural", categoryId: "bebidas", price: 3000, stock: 30, minStockAlert: 8, active: true, imageUrl: "https://example.com/jugo.jpg" },

  // ==========================
  // ➕ EXTRAS
  // ==========================
  { name: "Queso Extra", categoryId: "extras", price: 800, stock: 100, minStockAlert: 20, active: true, imageUrl: "https://example.com/queso.jpg" },
  { name: "Huevo", categoryId: "extras", price: 700, stock: 100, minStockAlert: 20, active: true, imageUrl: "https://example.com/huevo.jpg" },
  { name: "Palta", categoryId: "extras", price: 1000, stock: 50, minStockAlert: 10, active: true, imageUrl: "https://example.com/palta.jpg" },
  { name: "Papas Chicas", categoryId: "extras", price: 2500, stock: 30, minStockAlert: 5, active: true, imageUrl: "https://example.com/papas.jpg" },
  { name: "Papas Grandes", categoryId: "extras", price: 3500, stock: 30, minStockAlert: 5, active: true, imageUrl: "https://example.com/papas-grandes.jpg" },

  // ==========================
  // 🎯 PROMOS
  // ==========================
  { name: "Promo 2x1 Lomito", categoryId: "promos", price: 15000, stock: 10, minStockAlert: 2, active: true, imageUrl: "https://example.com/promo1.jpg" },
  { name: "Promo Familiar", categoryId: "promos", price: 35000, stock: 5, minStockAlert: 1, active: true, imageUrl: "https://example.com/promo2.jpg" },
  { name: "Promo Estudiante", categoryId: "promos", price: 12000, stock: 8, minStockAlert: 2, active: true, imageUrl: "https://example.com/promo3.jpg" },
  { name: "Happy Hour", categoryId: "promos", price: 9000, stock: 10, minStockAlert: 2, active: true, imageUrl: "https://example.com/promo4.jpg" },
  { name: "Promo Combo Doble", categoryId: "promos", price: 18000, stock: 6, minStockAlert: 1, active: true, imageUrl: "https://example.com/promo5.jpg" }
];

async function seedProducts() {
  const batch = db.batch();

  products.forEach(product => {
    const ref = db.collection('products').doc();
    batch.set(ref, product);
  });

  await batch.commit();
  console.log("✅ 30 productos cargados correctamente");
  process.exit();
}

seedProducts();
