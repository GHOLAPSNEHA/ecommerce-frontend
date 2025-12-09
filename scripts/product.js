const API_URL = "https://fakestoreapi.com/products/";

const productId = new URLSearchParams(window.location.search).get("id");
const detailContainer = document.getElementById("productDetail");

async function fetchProductDetails() {
  try {
    const res = await fetch(API_URL + productId);
    const product = await res.json();
    renderProduct(product);
  } catch (error) {
    detailContainer.innerHTML = "<p>Error loading product.</p>";
  }
}

fetchProductDetails();


function renderProduct(product) {
  detailContainer.innerHTML = `
    <div class="product-wrapper">

      <div class="product-images">
        <img id="mainImage" src="${product.image}" alt="${product.title}">
      </div>

      <div class="product-info">
        <h1>${product.title}</h1>
        <p class="price">$${product.price.toFixed(2)}</p>
        <p class="description">${product.description}</p>

        <div class="variation-box">
          <label>Size:</label>
          <select id="sizeSelect">
            <option>S</option>
            <option>M</option>
            <option>L</option>
          </select>
        </div>

        <div class="quantity-box">
          <button id="minusBtn">−</button>
          <span id="qty">1</span>
          <button id="plusBtn">+</button>
        </div>

        <button class="add-cart-btn" id="addToCartBtn">
          Add to Cart
        </button>
      </div>
    </div>
  `;

  setupQuantityButtons();
  setupAddToCart(product);
  enableImageZoom();
}
function setupAddToCart(product) {
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    const size = document.getElementById("sizeSelect").value;
    const quantity = parseInt(document.getElementById("qty").innerText);

    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      size: size,
      qty: quantity
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(cartItem);

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    alert("Added to Cart!");
  });
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cartCount").innerText = cart.length;
}

updateCartCount();

function setupQuantityButtons() {
  const qty = document.getElementById("qty");
  const plus = document.getElementById("plusBtn");
  const minus = document.getElementById("minusBtn");

  plus.addEventListener("click", () => {
    qty.innerText = parseInt(qty.innerText) + 1;
  });

  minus.addEventListener("click", () => {
    if (qty.innerText > 1) {
      qty.innerText = parseInt(qty.innerText) - 1;
    }
  });
}




// product.js - logic for product page add-to-cart buttons

// document.addEventListener("DOMContentLoaded", () => {
//     const buttons = document.querySelectorAll(".addToCartBtn");

//     buttons.forEach(btn => {
//         btn.addEventListener("click", () => {
//             const id = btn.dataset.id;
//             const name = btn.dataset.name;
//             const price = parseFloat(btn.dataset.price);
//             const image = btn.dataset.image;

//             const product = { id, name, price, image };
//             addToCart(product);

//             // Feedback message
//             alert(`${name} added to cart!`);
//         });
//     });
// });
