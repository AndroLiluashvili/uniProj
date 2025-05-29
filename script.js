// Abstract base class
class StoreItem {
  constructor(id, name, price, quantity) {
    if (new.target === StoreItem) {
      throw new Error("Cannot instantiate abstract class StoreItem directly.");
    }
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  reduceQuantity(count) {
    this.quantity = Math.max(0, this.quantity - count);
  }

  getSummary() {
    throw new Error("Abstract method 'getSummary' must be implemented.");
  }
}

// Item class
class Item extends StoreItem {
  constructor(id, name, category, era, region, condition, authenticity, price, quantity, imagePath) {
    super(id, name, price, quantity);
    this.category = category;
    this.era = era;
    this.region = region;
    this.condition = condition;
    this.authenticity = authenticity;
    this.imagePath = imagePath || "";
  }

  updateCondition(newCondition) {
    this.condition = newCondition;
  }

  updatePrice(newPrice) {
    this.price = newPrice;
  }

  getSummary() {
    return `${this.name} (${this.category}, ${this.era}) - $${this.price}`;
  }

  displayDetails() {
    return `
      ID: ${this.id}\n
      Name: ${this.name}\n
      Category: ${this.category}\n
      Era: ${this.era}\n
      Region: ${this.region}\n
      Condition: ${this.condition}\n
      Authenticity: ${this.authenticity}\n
      Price: $${this.price}\n
      Quantity: ${this.quantity}
    `;
  }
}

// WeaponItem subclass
class WeaponItem extends Item {
  constructor(id, name, era, region, condition, authenticity, price, quantity, imagePath, bladeLength) {
    super(id, name, "Weapon", era, region, condition, authenticity, price, quantity, imagePath);
    this.bladeLength = bladeLength;
  }

  getSummary() {
    return `${this.name} [Blade: ${this.bladeLength}cm] - $${this.price}`;
  }
}

// Inventory class
class Inventory {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
  }

  searchItemByName(name) {
    return this.items.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
  }

  listAllItems() {
    return this.items;
  }

  getItemById(id) {
    return this.items.find(item => item.id === id);
  }
}

// Cart class
class Cart {
  constructor() {
    this.cartItems = [];
  }

  addToCart(item, quantity = 1) {
    const existingCartItem = this.cartItems.find(ci => ci.item.id === item.id);
    let newTotalInCart = quantity;
    if (existingCartItem) {
      newTotalInCart = existingCartItem.quantityInCart + quantity;
    }

    if (newTotalInCart > item.quantity) {
      alert(`Sorry, we only have ${item.quantity} of "${item.name}" in stock. You already have ${existingCartItem ? existingCartItem.quantityInCart : 0} in your cart.`);
      return;
    }

    if (existingCartItem) {
      existingCartItem.quantityInCart += quantity;
    } else {
      this.cartItems.push({ item, quantityInCart: quantity });
    }
  }

  removeFromCart(itemId) {
    this.cartItems = this.cartItems.filter(ci => ci.item.id !== itemId);
  }

  clearCart() {
    this.cartItems = [];
  }

  getCartItems() {
    return this.cartItems;
  }

  getCartTotal() {
    return this.cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantityInCart, 0);
  }
}

// Initialize Inventory and Cart
const myInventory = new Inventory();
let myCart = new Cart();

// Sample Items
const item1 = new WeaponItem(1, "Antique Georgian Sword", "18th Century", "Kakheti", "Good", "Verified", 500, 2, "images/sword.png", 85);
const item2 = new Item(2, "Clay Pottery Vessel", "Pottery", "5th Century BC", "Colchis", "Fair", "Partially Verified", 300, 5, "images/vessel.png");
const item3 = new Item(3, "Georgian Silver Coin", "Coin", "12th Century", "Iberia", "Excellent", "Verified", 150, 10, "images/coin.png");
const item4 = new Item(4, "Bronze Pectoral Cross", "Religious Artifact", "10th Century", "Svaneti", "Good", "Verified", 700, 1, "images/cross.png");
const item5 = new Item(5, "Handwoven Georgian Rug", "Textile", "19th Century", "Kakheti", "Good", "Verified", 1200, 3, "images/rug.png");
const item6 = new Item(6, "Ivory Drinking Horn", "Ceremonial", "17th Century", "Samegrelo", "Fair", "Verified", 900, 2, "images/horn.png");
const item7 = new Item(7, "Gold Filigree Necklace", "Jewelry", "14th Century", "Imereti", "Excellent", "Verified", 2000, 1, "images/necklace.png");
const item8 = new Item(8, "Wood Carved Icon", "Religious Artifact", "16th Century", "Kartli", "Fair", "Partially Verified", 650, 4, "images/icon.png");

myInventory.addItem(item1);
myInventory.addItem(item2);
myInventory.addItem(item3);
myInventory.addItem(item4);
myInventory.addItem(item5);
myInventory.addItem(item6);
myInventory.addItem(item7);
myInventory.addItem(item8);

// Render items to DOM
function renderItems(items) {
  const container = document.getElementById('itemsContainer');
  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = "<p>No items found.</p>";
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <img src="${item.imagePath}" alt="${item.name}" class="item-image" />
      <h3>${item.name}</h3>
      <p><strong>Category:</strong> ${item.category}</p>
      <p><strong>Era:</strong> ${item.era}</p>
      <p><strong>Region:</strong> ${item.region}</p>
      <p><strong>Condition:</strong> ${item.condition}</p>
      <p><strong>Authenticity:</strong> ${item.authenticity}</p>
      <p class="price"><strong>Price:</strong> $${item.price}</p>
      <p><strong>Quantity:</strong> ${item.quantity}</p>
      <button class="add-cart-btn" data-id="${item.id}">Add to Cart</button>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll('.add-cart-btn').forEach(button => {
    button.addEventListener('click', () => {
      const itemId = parseInt(button.getAttribute('data-id'), 10);
      const itemToAdd = myInventory.getItemById(itemId);
      if (itemToAdd) {
        myCart.addToCart(itemToAdd, 1);
        renderCart();
      }
    });
  });
}

function renderCart() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  cartItemsContainer.innerHTML = "";

  const cartData = myCart.getCartItems();
  if (cartData.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cartData.forEach(ci => {
      const cartItemDiv = document.createElement('div');
      cartItemDiv.className = "cart-item";
      cartItemDiv.innerHTML = `
        <p><strong>${ci.item.name}</strong> (x${ci.quantityInCart}) - $${ci.item.price * ci.quantityInCart}</p>
        <button class="remove-cart-btn" data-id="${ci.item.id}">Remove</button>
      `;
      cartItemsContainer.appendChild(cartItemDiv);
    });

    document.querySelectorAll('.remove-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const removeId = parseInt(btn.getAttribute('data-id'), 10);
        myCart.removeFromCart(removeId);
        renderCart();
      });
    });
  }

  cartTotal.innerText = `Total: $${myCart.getCartTotal()}`;
}

renderItems(myInventory.listAllItems());
renderCart();

document.getElementById("searchInput").addEventListener("input", () => {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  renderItems(query ? myInventory.searchItemByName(query) : myInventory.listAllItems());
});
